package com.expensesplitter.dto;

import com.expensesplitter.entity.SplitMethod;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ExpenseResponse {
    private Long id;
    private Long groupId;
    private String groupName;
    private Long payerId;
    private String payerName;
    private String description;
    private String category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private SplitMethod splitMethod;
    private LocalDateTime createdAt;
    private List<ExpenseShareDTO> shares;

    public ExpenseResponse() {
    }

    public ExpenseResponse(Long id, Long groupId, String groupName, Long payerId, String payerName,
                           String description, String category, BigDecimal amount, LocalDate expenseDate,
                           SplitMethod splitMethod, LocalDateTime createdAt, List<ExpenseShareDTO> shares) {
        this.id = id;
        this.groupId = groupId;
        this.groupName = groupName;
        this.payerId = payerId;
        this.payerName = payerName;
        this.description = description;
        this.category = category;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.splitMethod = splitMethod;
        this.createdAt = createdAt;
        this.shares = shares;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public Long getPayerId() { return payerId; }
    public void setPayerId(Long payerId) { this.payerId = payerId; }
    public String getPayerName() { return payerName; }
    public void setPayerName(String payerName) { this.payerName = payerName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
    public SplitMethod getSplitMethod() { return splitMethod; }
    public void setSplitMethod(SplitMethod splitMethod) { this.splitMethod = splitMethod; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<ExpenseShareDTO> getShares() { return shares; }
    public void setShares(List<ExpenseShareDTO> shares) { this.shares = shares; }
}
