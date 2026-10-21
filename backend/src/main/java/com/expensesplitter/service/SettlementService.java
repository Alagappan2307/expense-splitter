package com.expensesplitter.service;

import com.expensesplitter.dto.*;
import com.expensesplitter.entity.Group;
import com.expensesplitter.entity.Settlement;
import com.expensesplitter.entity.User;
import com.expensesplitter.exception.BadRequestException;
import com.expensesplitter.exception.ResourceNotFoundException;
import com.expensesplitter.repository.GroupMemberRepository;
import com.expensesplitter.repository.GroupRepository;
import com.expensesplitter.repository.SettlementRepository;
import com.expensesplitter.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final GroupService groupService;
    private final ExpenseService expenseService;
    private final BalanceService balanceService;
    private final DebtSimplificationService debtSimplificationService;

    public SettlementService(SettlementRepository settlementRepository,
                             GroupRepository groupRepository,
                             UserRepository userRepository,
                             GroupMemberRepository groupMemberRepository,
                             GroupService groupService,
                             ExpenseService expenseService,
                             BalanceService balanceService,
                             DebtSimplificationService debtSimplificationService) {
        this.settlementRepository = settlementRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.groupService = groupService;
        this.expenseService = expenseService;
        this.balanceService = balanceService;
        this.debtSimplificationService = debtSimplificationService;
    }

    @Transactional
    public SettlementResponse recordSettlement(CreateSettlementRequest request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + request.getGroupId()));

        if (request.getPayerId().equals(request.getPayeeId())) {
            throw new BadRequestException("Payer and payee cannot be the same person");
        }

        User payer = userRepository.findById(request.getPayerId())
                .orElseThrow(() -> new ResourceNotFoundException("Payer user not found with ID: " + request.getPayerId()));

        User payee = userRepository.findById(request.getPayeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Payee user not found with ID: " + request.getPayeeId()));

        if (!groupMemberRepository.existsByGroupIdAndUserId(group.getId(), payer.getId())) {
            throw new BadRequestException("Payer '" + payer.getName() + "' is not a member of group '" + group.getName() + "'");
        }

        if (!groupMemberRepository.existsByGroupIdAndUserId(group.getId(), payee.getId())) {
            throw new BadRequestException("Payee '" + payee.getName() + "' is not a member of group '" + group.getName() + "'");
        }

        BigDecimal amount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Settlement payment amount must be greater than zero");
        }

        Settlement settlement = new Settlement(
                group,
                payer,
                payee,
                amount,
                request.getSettlementDate(),
                request.getNotes() != null ? request.getNotes().trim() : null
        );

        Settlement saved = settlementRepository.save(settlement);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SettlementResponse> getSettlementsByGroupId(Long groupId) {
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        return settlementRepository.findByGroupIdOrderBySettlementDateDescIdDesc(groupId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GroupReportResponse generateGroupReport(Long groupId) {
        GroupResponse groupResponse = groupService.getGroupById(groupId);
        GroupBalancesResponse balancesResponse = balanceService.calculateGroupBalances(groupId);
        List<SimplifiedDebtDTO> simplifiedDebts = debtSimplificationService.simplifyDebts(groupId);
        List<ExpenseResponse> expenses = expenseService.getExpensesByGroupId(groupId);
        List<SettlementResponse> settlements = getSettlementsByGroupId(groupId);

        GroupReportResponse report = new GroupReportResponse();
        report.setGroup(groupResponse);
        report.setBalances(balancesResponse);
        report.setSimplifiedDebts(simplifiedDebts);
        report.setRecentExpenses(expenses);
        report.setRecentSettlements(settlements);
        report.setTotalExpenseAmount(balancesResponse.getTotalExpenses());
        report.setTotalSettlementAmount(balancesResponse.getTotalSettlements());
        report.setTotalExpensesCount(expenses.size());
        report.setTotalSettlementsCount(settlements.size());

        return report;
    }

    public SettlementResponse mapToResponse(Settlement s) {
        return new SettlementResponse(
                s.getId(),
                s.getGroup().getId(),
                s.getGroup().getName(),
                s.getPayer().getId(),
                s.getPayer().getName(),
                s.getPayee().getId(),
                s.getPayee().getName(),
                s.getAmount(),
                s.getSettlementDate(),
                s.getNotes(),
                s.getCreatedAt()
        );
    }
}
