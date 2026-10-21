package com.expensesplitter.controller;

import com.expensesplitter.dto.GroupBalancesResponse;
import com.expensesplitter.service.BalanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groups/{groupId}/balances")
public class BalanceController {

    private final BalanceService balanceService;

    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    @GetMapping
    public ResponseEntity<GroupBalancesResponse> getGroupBalances(@PathVariable Long groupId) {
        return ResponseEntity.ok(balanceService.calculateGroupBalances(groupId));
    }
}
