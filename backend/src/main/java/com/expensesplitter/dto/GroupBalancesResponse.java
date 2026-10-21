package com.expensesplitter.dto;

import java.math.BigDecimal;
import java.util.List;

public class GroupBalancesResponse {
    private Long groupId;
    private String groupName;
    private BigDecimal totalExpenses;
    private BigDecimal totalSettlements;
    private List<MemberBalanceDTO> members;
    private boolean balanced;

    public GroupBalancesResponse() {
    }

    public GroupBalancesResponse(Long groupId, String groupName, BigDecimal totalExpenses,
                                 BigDecimal totalSettlements, List<MemberBalanceDTO> members, boolean balanced) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.totalExpenses = totalExpenses;
        this.totalSettlements = totalSettlements;
        this.members = members;
        this.balanced = balanced;
    }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public String getGroupName() { return groupName; }
    public void setGroupName(String groupName) { this.groupName = groupName; }
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }
    public BigDecimal getTotalSettlements() { return totalSettlements; }
    public void setTotalSettlements(BigDecimal totalSettlements) { this.totalSettlements = totalSettlements; }
    public List<MemberBalanceDTO> getMembers() { return members; }
    public void setMembers(List<MemberBalanceDTO> members) { this.members = members; }
    public boolean isBalanced() { return balanced; }
    public void setBalanced(boolean balanced) { this.balanced = balanced; }
}
