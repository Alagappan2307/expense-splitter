package com.expensesplitter.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateSettlementRequest {

    @NotNull(message = "Group ID is required")
    private Long groupId;

    @NotNull(message = "Payer ID is required")
    private Long payerId;

    @NotNull(message = "Payee ID is required")
    private Long payeeId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Settlement date is required")
    private LocalDate settlementDate;

    private String notes;

    public CreateSettlementRequest() {
    }

    public CreateSettlementRequest(Long groupId, Long payerId, Long payeeId, BigDecimal amount,
                                   LocalDate settlementDate, String notes) {
        this.groupId = groupId;
        this.payerId = payerId;
        this.payeeId = payeeId;
        this.amount = amount;
        this.settlementDate = settlementDate;
        this.notes = notes;
    }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public Long getPayerId() { return payerId; }
    public void setPayerId(Long payerId) { this.payerId = payerId; }
    public Long getPayeeId() { return payeeId; }
    public void setPayeeId(Long payeeId) { this.payeeId = payeeId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getSettlementDate() { return settlementDate; }
    public void setSettlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
