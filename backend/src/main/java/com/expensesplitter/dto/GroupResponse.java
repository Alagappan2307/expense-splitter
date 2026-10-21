package com.expensesplitter.dto;

import java.time.LocalDateTime;
import java.util.List;

public class GroupResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private int membersCount;
    private List<UserResponse> members;

    public GroupResponse() {
    }

    public GroupResponse(Long id, String name, String description, LocalDateTime createdAt,
                         int membersCount, List<UserResponse> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.membersCount = membersCount;
        this.members = members;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public int getMembersCount() { return membersCount; }
    public void setMembersCount(int membersCount) { this.membersCount = membersCount; }
    public List<UserResponse> getMembers() { return members; }
    public void setMembers(List<UserResponse> members) { this.members = members; }
}
