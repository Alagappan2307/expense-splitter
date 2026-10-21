package com.expensesplitter.dto;

import java.math.BigDecimal;
import java.util.List;

public class GroupReportResponse {
    private GroupResponse group;
    private GroupBalancesResponse balances;
    private List<SimplifiedDebtDTO> simplifiedDebts;
    private List<ExpenseResponse> recentExpenses;
    private List<SettlementResponse> recentSettlements;
    private BigDecimal totalExpenseAmount;
    private BigDecimal totalSettlementAmount;
    private int totalExpensesCount;
    private int totalSettlementsCount;

    public GroupReportResponse() {
    }

    public GroupResponse getGroup() { return group; }
    public void setGroup(GroupResponse group) { this.group = group; }
    public GroupBalancesResponse getBalances() { return balances; }
    public void setBalances(GroupBalancesResponse balances) { this.balances = balances; }
    public List<SimplifiedDebtDTO> getSimplifiedDebts() { return simplifiedDebts; }
    public void setSimplifiedDebts(List<SimplifiedDebtDTO> simplifiedDebts) { this.simplifiedDebts = simplifiedDebts; }
    public List<ExpenseResponse> getRecentExpenses() { return recentExpenses; }
    public void setRecentExpenses(List<ExpenseResponse> recentExpenses) { this.recentExpenses = recentExpenses; }
    public List<SettlementResponse> getRecentSettlements() { return recentSettlements; }
    public void setRecentSettlements(List<SettlementResponse> recentSettlements) { this.recentSettlements = recentSettlements; }
    public BigDecimal getTotalExpenseAmount() { return totalExpenseAmount; }
    public void setTotalExpenseAmount(BigDecimal totalExpenseAmount) { this.totalExpenseAmount = totalExpenseAmount; }
    public BigDecimal getTotalSettlementAmount() { return totalSettlementAmount; }
    public void setTotalSettlementAmount(BigDecimal totalSettlementAmount) { this.totalSettlementAmount = totalSettlementAmount; }
    public int getTotalExpensesCount() { return totalExpensesCount; }
    public void setTotalExpensesCount(int totalExpensesCount) { this.totalExpensesCount = totalExpensesCount; }
    public int getTotalSettlementsCount() { return totalSettlementsCount; }
    public void setTotalSettlementsCount(int totalSettlementsCount) { this.totalSettlementsCount = totalSettlementsCount; }
}
