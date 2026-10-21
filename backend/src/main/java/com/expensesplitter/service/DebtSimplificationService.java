package com.expensesplitter.service;

import com.expensesplitter.dto.GroupBalancesResponse;
import com.expensesplitter.dto.MemberBalanceDTO;
import com.expensesplitter.dto.SimplifiedDebtDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class DebtSimplificationService {

    private final BalanceService balanceService;

    public DebtSimplificationService(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    public List<SimplifiedDebtDTO> simplifyDebts(Long groupId) {
        GroupBalancesResponse balancesResponse = balanceService.calculateGroupBalances(groupId);
        return simplifyFromBalances(balancesResponse.getMembers());
    }

    public List<SimplifiedDebtDTO> simplifyFromBalances(List<MemberBalanceDTO> memberBalances) {
        List<BalanceEntry> debtors = new ArrayList<>();
        List<BalanceEntry> creditors = new ArrayList<>();

        for (MemberBalanceDTO mb : memberBalances) {
            BigDecimal bal = mb.getNetBalance();
            if (bal.compareTo(BigDecimal.ZERO) < 0) {
                debtors.add(new BalanceEntry(mb.getUserId(), mb.getUserName(), bal.abs()));
            } else if (bal.compareTo(BigDecimal.ZERO) > 0) {
                creditors.add(new BalanceEntry(mb.getUserId(), mb.getUserName(), bal));
            }
        }

        debtors.sort((a, b) -> b.amount.compareTo(a.amount));
        creditors.sort((a, b) -> b.amount.compareTo(a.amount));

        List<SimplifiedDebtDTO> suggestions = new ArrayList<>();
        int i = 0, j = 0;

        while (i < debtors.size() && j < creditors.size()) {
            BalanceEntry debtor = debtors.get(i);
            BalanceEntry creditor = creditors.get(j);

            BigDecimal settlementAmount = debtor.amount.min(creditor.amount).setScale(2, RoundingMode.HALF_UP);

            if (settlementAmount.compareTo(BigDecimal.ZERO) > 0) {
                suggestions.add(new SimplifiedDebtDTO(
                        debtor.userId, debtor.userName,
                        creditor.userId, creditor.userName,
                        settlementAmount
                ));
            }

            debtor.amount = debtor.amount.subtract(settlementAmount);
            creditor.amount = creditor.amount.subtract(settlementAmount);

            if (debtor.amount.compareTo(new BigDecimal("0.001")) <= 0) i++;
            if (creditor.amount.compareTo(new BigDecimal("0.001")) <= 0) j++;
        }

        return suggestions;
    }

    private static class BalanceEntry {
        Long userId;
        String userName;
        BigDecimal amount;
        BalanceEntry(Long userId, String userName, BigDecimal amount) {
            this.userId = userId;
            this.userName = userName;
            this.amount = amount;
        }
    }
}
