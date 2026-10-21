package com.expensesplitter.dto;

import java.math.BigDecimal;

public class ExpenseShareDTO {
    private Long id;
    private Long userId;
    private String userName;
    private BigDecimal shareAmount;
    private BigDecimal percentage;

    public ExpenseShareDTO() {
    }

    public ExpenseShareDTO(Long id, Long userId, String userName, BigDecimal shareAmount, BigDecimal percentage) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.shareAmount = shareAmount;
        this.percentage = percentage;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public BigDecimal getShareAmount() { return shareAmount; }
    public void setShareAmount(BigDecimal shareAmount) { this.shareAmount = shareAmount; }
    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
}
