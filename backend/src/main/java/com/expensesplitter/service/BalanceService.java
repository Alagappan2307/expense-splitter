package com.expensesplitter.service;

import com.expensesplitter.dto.GroupBalancesResponse;
import com.expensesplitter.dto.MemberBalanceDTO;
import com.expensesplitter.entity.*;
import com.expensesplitter.exception.ResourceNotFoundException;
import com.expensesplitter.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class BalanceService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final ExpenseRepository expenseRepository;
    private final ExpenseShareRepository expenseShareRepository;
    private final SettlementRepository settlementRepository;

    public BalanceService(GroupRepository groupRepository,
                          GroupMemberRepository groupMemberRepository,
                          ExpenseRepository expenseRepository,
                          ExpenseShareRepository expenseShareRepository,
                          SettlementRepository settlementRepository) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.expenseRepository = expenseRepository;
        this.expenseShareRepository = expenseShareRepository;
        this.settlementRepository = settlementRepository;
    }

    @Transactional(readOnly = true)
    public GroupBalancesResponse calculateGroupBalances(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));

        List<GroupMember> groupMembers = groupMemberRepository.findByGroupId(groupId);
        List<Expense> expenses = expenseRepository.findByGroupIdOrderByExpenseDateDescIdDesc(groupId);
        List<ExpenseShare> allShares = expenseShareRepository.findByExpenseGroupId(groupId);
        List<Settlement> settlements = settlementRepository.findByGroupIdOrderBySettlementDateDescIdDesc(groupId);

        Map<Long, BigDecimal> paidForExpensesMap = new HashMap<>();
        Map<Long, BigDecimal> shareOwedMap = new HashMap<>();
        Map<Long, BigDecimal> settlementsPaidMap = new HashMap<>();
        Map<Long, BigDecimal> settlementsReceivedMap = new HashMap<>();

        for (GroupMember member : groupMembers) {
            Long uid = member.getUser().getId();
            paidForExpensesMap.put(uid, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            shareOwedMap.put(uid, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            settlementsPaidMap.put(uid, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
            settlementsReceivedMap.put(uid, BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        }

        BigDecimal totalExpenses = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        for (Expense expense : expenses) {
            totalExpenses = totalExpenses.add(expense.getAmount());
            Long payerId = expense.getPayer().getId();
            paidForExpensesMap.put(payerId, paidForExpensesMap.getOrDefault(payerId, BigDecimal.ZERO).add(expense.getAmount()));
        }

        for (ExpenseShare share : allShares) {
            Long userId = share.getUser().getId();
            shareOwedMap.put(userId, shareOwedMap.getOrDefault(userId, BigDecimal.ZERO).add(share.getShareAmount()));
        }

        BigDecimal totalSettlements = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        for (Settlement s : settlements) {
            totalSettlements = totalSettlements.add(s.getAmount());
            Long payerId = s.getPayer().getId();
            Long payeeId = s.getPayee().getId();
            settlementsPaidMap.put(payerId, settlementsPaidMap.getOrDefault(payerId, BigDecimal.ZERO).add(s.getAmount()));
            settlementsReceivedMap.put(payeeId, settlementsReceivedMap.getOrDefault(payeeId, BigDecimal.ZERO).add(s.getAmount()));
        }

        List<MemberBalanceDTO> memberBalances = new ArrayList<>();
        BigDecimal sumNet = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

        for (GroupMember gm : groupMembers) {
            Long uid = gm.getUser().getId();
            String name = gm.getUser().getName();

            BigDecimal paidExp = paidForExpensesMap.get(uid).setScale(2, RoundingMode.HALF_UP);
            BigDecimal owedShare = shareOwedMap.get(uid).setScale(2, RoundingMode.HALF_UP);
            BigDecimal paidSet = settlementsPaidMap.get(uid).setScale(2, RoundingMode.HALF_UP);
            BigDecimal recSet = settlementsReceivedMap.get(uid).setScale(2, RoundingMode.HALF_UP);

            BigDecimal netBalance = paidExp.subtract(owedShare).add(paidSet).subtract(recSet).setScale(2, RoundingMode.HALF_UP);

            String status;
            if (netBalance.compareTo(BigDecimal.ZERO) > 0) {
                status = "CREDITOR";
            } else if (netBalance.compareTo(BigDecimal.ZERO) < 0) {
                status = "DEBTOR";
            } else {
                status = "SETTLED";
            }

            sumNet = sumNet.add(netBalance);
            memberBalances.add(new MemberBalanceDTO(
                    uid, name, paidExp, owedShare, paidSet, recSet, netBalance, status
            ));
        }

        memberBalances.sort((a, b) -> b.getNetBalance().compareTo(a.getNetBalance()));
        boolean balanced = sumNet.compareTo(BigDecimal.ZERO) == 0;

        return new GroupBalancesResponse(
                group.getId(),
                group.getName(),
                totalExpenses,
                totalSettlements,
                memberBalances,
                balanced
        );
    }
}
