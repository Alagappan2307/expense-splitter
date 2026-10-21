package com.expensesplitter.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ExpenseParticipantShareInput {

    @NotNull(message = "Participant user ID is required")
    private Long userId;

    private BigDecimal percentage;
    private BigDecimal customAmount;

    public ExpenseParticipantShareInput() {
    }

    public ExpenseParticipantShareInput(Long userId) {
        this.userId = userId;
    }

    public ExpenseParticipantShareInput(Long userId, BigDecimal percentage, BigDecimal customAmount) {
        this.userId = userId;
        this.percentage = percentage;
        this.customAmount = customAmount;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
    public BigDecimal getCustomAmount() { return customAmount; }
    public void setCustomAmount(BigDecimal customAmount) { this.customAmount = customAmount; }
}
