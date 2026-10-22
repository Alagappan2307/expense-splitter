package com.expensesplitter.controller;

import com.expensesplitter.dto.CreateSettlementRequest;
import com.expensesplitter.dto.GroupReportResponse;
import com.expensesplitter.dto.SettlementResponse;
import com.expensesplitter.service.SettlementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SettlementController {

    private final SettlementService settlementService;

    public SettlementController(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    // Record a settlement between two group members
    @PostMapping("/settlements")
    public ResponseEntity<SettlementResponse> recordSettlement(
            @Valid @RequestBody CreateSettlementRequest request) {

        SettlementResponse response =
                settlementService.recordSettlement(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Get all settlements for a particular group
    @GetMapping("/groups/{groupId}/settlements")
    public ResponseEntity<List<SettlementResponse>> getSettlementsByGroup(
            @PathVariable Long groupId) {

        List<SettlementResponse> settlements =
                settlementService.getSettlementsByGroupId(groupId);

        return ResponseEntity.ok(settlements);
    }

    // Generate the complete financial report for a group
    @GetMapping("/groups/{groupId}/report")
    public ResponseEntity<GroupReportResponse> getGroupReport(
            @PathVariable Long groupId) {

        GroupReportResponse report =
                settlementService.generateGroupReport(groupId);

        return ResponseEntity.ok(report);
    }
}