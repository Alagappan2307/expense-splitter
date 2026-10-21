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

    @PostMapping("/settlements")
    public ResponseEntity<SettlementResponse> recordSettlement(@Valid @RequestBody CreateSettlementRequest request) {
        SettlementResponse response = settlementService.recordSettlement(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/groups/{groupId}/settlements")
    public ResponseEntity<List<SettlementResponse>> getSettlementsByGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok(settlementService.getSettlementsByGroupId(groupId));
    }

    @GetMapping("/groups/{groupId}/report")
    public ResponseEntity<GroupReportResponse> getGroupReport(@PathVariable Long groupId) {
        return ResponseEntity.ok(settlementService.generateGroupReport(groupId));
    }
}
