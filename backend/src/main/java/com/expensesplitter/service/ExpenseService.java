package com.expensesplitter.service;

import com.expensesplitter.dto.CreateExpenseRequest;
import com.expensesplitter.dto.ExpenseParticipantShareInput;
import com.expensesplitter.dto.ExpenseResponse;
import com.expensesplitter.dto.ExpenseShareDTO;
import com.expensesplitter.entity.*;
import com.expensesplitter.exception.BadRequestException;
import com.expensesplitter.exception.ResourceNotFoundException;
import com.expensesplitter.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;

    public ExpenseService(ExpenseRepository expenseRepository,
                          GroupRepository groupRepository,
                          UserRepository userRepository,
                          GroupMemberRepository groupMemberRepository) {
        this.expenseRepository = expenseRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.groupMemberRepository = groupMemberRepository;
    }

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + request.getGroupId()));

        User payer = userRepository.findById(request.getPayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Payer not found with ID: " + request.getPayerId()));

        if (!groupMemberRepository.existsByGroupIdAndUserId(group.getId(), payer.getId())) {
            throw new BadRequestException("Payer '" + payer.getName() + "' is not a member of group '" + group.getName() + "'");
        }

        BigDecimal totalAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
        if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Expense amount must be greater than zero");
        }

        if (request.getParticipants() == null || request.getParticipants().isEmpty()) {
            throw new BadRequestException("Expense must have at least one participant");
        }

        Set<Long> seenParticipantIds = new HashSet<>();
        Map<Long, User> participantUserMap = new HashMap<>();

        for (ExpenseParticipantShareInput input : request.getParticipants()) {
            if (!seenParticipantIds.add(input.getUserId())) {
                throw new BadRequestException("Duplicate participant ID found in request: " + input.getUserId());
            }
            User participant = userRepository.findById(input.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Participant not found with ID: " + input.getUserId()));

            if (!groupMemberRepository.existsByGroupIdAndUserId(group.getId(), participant.getId())) {
                throw new BadRequestException("Participant '" + participant.getName() + "' is not a member of group '" + group.getName() + "'");
            }
            participantUserMap.put(participant.getId(), participant);
        }

        Expense expense = new Expense(
                group,
                payer,
                request.getDescription().trim(),
                request.getCategory().trim(),
                totalAmount,
                request.getExpenseDate(),
                request.getSplitMethod()
        );

        List<ExpenseShare> calculatedShares = computeShares(expense, request.getParticipants(), participantUserMap, totalAmount, request.getSplitMethod());

        for (ExpenseShare share : calculatedShares) {
            expense.addShare(share);
        }

        Expense savedExpense = expenseRepository.save(expense);
        return mapToResponse(savedExpense);
    }

    private List<ExpenseShare> computeShares(Expense expense,
                                            List<ExpenseParticipantShareInput> participantInputs,
                                            Map<Long, User> userMap,
                                            BigDecimal totalAmount,
                                            SplitMethod splitMethod) {
        int n = participantInputs.size();
        List<ExpenseShare> shares = new ArrayList<>(n);

        switch (splitMethod) {
            case EQUAL: {
                BigDecimal equalShare = totalAmount.divide(BigDecimal.valueOf(n), 2, RoundingMode.HALF_UP);
                BigDecimal runningSum = BigDecimal.ZERO;

                for (int i = 0; i < n; i++) {
                    ExpenseParticipantShareInput input = participantInputs.get(i);
                    User user = userMap.get(input.getUserId());
                    shares.add(new ExpenseShare(user, equalShare, null));
                    runningSum = runningSum.add(equalShare);
                }

                BigDecimal remainder = totalAmount.subtract(runningSum);
                if (remainder.compareTo(BigDecimal.ZERO) != 0) {
                    ExpenseShare firstShare = shares.get(0);
                    firstShare.setShareAmount(firstShare.getShareAmount().add(remainder));
                }
                break;
            }

            case PERCENTAGE: {
                BigDecimal totalPercentage = BigDecimal.ZERO;
                for (ExpenseParticipantShareInput input : participantInputs) {
                    if (input.getPercentage() == null || input.getPercentage().compareTo(BigDecimal.ZERO) < 0) {
                        throw new BadRequestException("Each participant must have a non-negative percentage");
                    }
                    totalPercentage = totalPercentage.add(input.getPercentage());
                }

                if (totalPercentage.compareTo(new BigDecimal("100.00")) != 0 &&
                    totalPercentage.subtract(new BigDecimal("100.00")).abs().compareTo(new BigDecimal("0.01")) > 0) {
                    throw new BadRequestException("Total percentage must equal 100%. Current total: " + totalPercentage + "%");
                }

                BigDecimal runningSum = BigDecimal.ZERO;
                for (int i = 0; i < n; i++) {
                    ExpenseParticipantShareInput input = participantInputs.get(i);
                    User user = userMap.get(input.getUserId());
                    BigDecimal share = totalAmount.multiply(input.getPercentage())
                            .divide(new BigDecimal("100.00"), 2, RoundingMode.HALF_UP);
                    shares.add(new ExpenseShare(user, share, input.getPercentage()));
                    runningSum = runningSum.add(share);
                }

                BigDecimal remainder = totalAmount.subtract(runningSum);
                if (remainder.compareTo(BigDecimal.ZERO) != 0) {
                    ExpenseShare firstShare = shares.get(0);
                    firstShare.setShareAmount(firstShare.getShareAmount().add(remainder));
                }
                break;
            }

            case CUSTOM: {
                BigDecimal totalCustom = BigDecimal.ZERO;
                for (ExpenseParticipantShareInput input : participantInputs) {
                    if (input.getCustomAmount() == null || input.getCustomAmount().compareTo(BigDecimal.ZERO) < 0) {
                        throw new BadRequestException("Each participant must have a non-negative custom amount");
                    }
                    totalCustom = totalCustom.add(input.getCustomAmount().setScale(2, RoundingMode.HALF_UP));
                }

                if (totalCustom.compareTo(totalAmount) != 0) {
                    throw new BadRequestException("Sum of custom shares (" + totalCustom + ") must equal total expense amount (" + totalAmount + ")");
                }

                for (ExpenseParticipantShareInput input : participantInputs) {
                    User user = userMap.get(input.getUserId());
                    BigDecimal share = input.getCustomAmount().setScale(2, RoundingMode.HALF_UP);
                    shares.add(new ExpenseShare(user, share, null));
                }
                break;
            }

            default:
                throw new BadRequestException("Unsupported split method: " + splitMethod);
        }

        return shares;
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByGroupId(Long groupId) {
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        return expenseRepository.findByGroupIdOrderByExpenseDateDescIdDesc(groupId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return mapToResponse(expense);
    }

    public ExpenseResponse mapToResponse(Expense expense) {
        List<ExpenseShareDTO> shareDTOs = expense.getShares().stream()
                .map(s -> new ExpenseShareDTO(
                        s.getId(),
                        s.getUser().getId(),
                        s.getUser().getName(),
                        s.getShareAmount(),
                        s.getPercentage()
                ))
                .collect(Collectors.toList());

        return new ExpenseResponse(
                expense.getId(),
                expense.getGroup().getId(),
                expense.getGroup().getName(),
                expense.getPayer().getId(),
                expense.getPayer().getName(),
                expense.getDescription(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getExpenseDate(),
                expense.getSplitMethod(),
                expense.getCreatedAt(),
                shareDTOs
        );
    }
}
