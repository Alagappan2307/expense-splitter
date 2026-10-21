package com.expensesplitter.dto;

import java.math.BigDecimal;

public class MemberBalanceDTO {
    private Long userId;
    private String userName;
    private BigDecimal totalPaidForExpenses;
    private BigDecimal totalExpenseShareOwed;
    private BigDecimal totalSettlementsPaid;
    private BigDecimal totalSettlementsReceived;
    private BigDecimal netBalance;
    private String status;

    public MemberBalanceDTO() {
    }

    public MemberBalanceDTO(Long userId, String userName, BigDecimal totalPaidForExpenses,
                            BigDecimal totalExpenseShareOwed, BigDecimal totalSettlementsPaid,
                            BigDecimal totalSettlementsReceived, BigDecimal netBalance, String status) {
        this.userId = userId;
        this.userName = userName;
        this.totalPaidForExpenses = totalPaidForExpenses;
        this.totalExpenseShareOwed = totalExpenseShareOwed;
        this.totalSettlementsPaid = totalSettlementsPaid;
        this.totalSettlementsReceived = totalSettlementsReceived;
        this.netBalance = netBalance;
        this.status = status;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public BigDecimal getTotalPaidForExpenses() { return totalPaidForExpenses; }
    public void setTotalPaidForExpenses(BigDecimal totalPaidForExpenses) { this.totalPaidForExpenses = totalPaidForExpenses; }
    public BigDecimal getTotalExpenseShareOwed() { return totalExpenseShareOwed; }
    public void setTotalExpenseShareOwed(BigDecimal totalExpenseShareOwed) { this.totalExpenseShareOwed = totalExpenseShareOwed; }
    public BigDecimal getTotalSettlementsPaid() { return totalSettlementsPaid; }
    public void setTotalSettlementsPaid(BigDecimal totalSettlementsPaid) { this.totalSettlementsPaid = totalSettlementsPaid; }
    public BigDecimal getTotalSettlementsReceived() { return totalSettlementsReceived; }
    public void setTotalSettlementsReceived(BigDecimal totalSettlementsReceived) { this.totalSettlementsReceived = totalSettlementsReceived; }
    public BigDecimal getNetBalance() { return netBalance; }
    public void setNetBalance(BigDecimal netBalance) { this.netBalance = netBalance; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
