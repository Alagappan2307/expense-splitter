package com.expensesplitter.service;

import com.expensesplitter.dto.CreateGroupRequest;
import com.expensesplitter.dto.GroupResponse;
import com.expensesplitter.dto.UserResponse;
import com.expensesplitter.entity.Group;
import com.expensesplitter.entity.GroupMember;
import com.expensesplitter.entity.User;
import com.expensesplitter.exception.BadRequestException;
import com.expensesplitter.exception.ResourceNotFoundException;
import com.expensesplitter.repository.GroupMemberRepository;
import com.expensesplitter.repository.GroupRepository;
import com.expensesplitter.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public GroupService(GroupRepository groupRepository,
                        GroupMemberRepository groupMemberRepository,
                        UserRepository userRepository,
                        UserService userService) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public GroupResponse createGroup(CreateGroupRequest request) {
        if (groupRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BadRequestException("Group with name '" + request.getName().trim() + "' already exists");
        }

        Group group = new Group(request.getName().trim(), request.getDescription());
        Group savedGroup = groupRepository.save(group);

        List<UserResponse> members = new ArrayList<>();
        if (request.getMemberUserIds() != null && !request.getMemberUserIds().isEmpty()) {
            for (Long userId : request.getMemberUserIds()) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
                GroupMember member = new GroupMember(savedGroup, user);
                groupMemberRepository.save(member);
                members.add(userService.mapToResponse(user));
            }
        }

        return new GroupResponse(
                savedGroup.getId(),
                savedGroup.getName(),
                savedGroup.getDescription(),
                savedGroup.getCreatedAt(),
                members.size(),
                members
        );
    }

    @Transactional(readOnly = true)
    public List<GroupResponse> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GroupResponse getGroupById(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + id));
        return mapToResponse(group);
    }

    @Transactional
    public GroupResponse addMemberToGroup(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new BadRequestException("User '" + user.getName() + "' is already a member of this group");
        }

        GroupMember groupMember = new GroupMember(group, user);
        groupMemberRepository.save(groupMember);

        return mapToResponse(group);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getGroupMembers(Long groupId) {
        groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with ID: " + groupId));
        return groupMemberRepository.findByGroupId(groupId).stream()
                .map(gm -> userService.mapToResponse(gm.getUser()))
                .collect(Collectors.toList());
    }

    public GroupResponse mapToResponse(Group group) {
        List<GroupMember> groupMembers = groupMemberRepository.findByGroupId(group.getId());
        List<UserResponse> members = groupMembers.stream()
                .map(gm -> userService.mapToResponse(gm.getUser()))
                .collect(Collectors.toList());

        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getCreatedAt(),
                members.size(),
                members
        );
    }
}
