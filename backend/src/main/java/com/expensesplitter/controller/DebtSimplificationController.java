package com.expensesplitter.controller;

import com.expensesplitter.dto.SimplifiedDebtDTO;
import com.expensesplitter.service.DebtSimplificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/simplify-debts")
public class DebtSimplificationController {

    private final DebtSimplificationService debtSimplificationService;

    public DebtSimplificationController(DebtSimplificationService debtSimplificationService) {
        this.debtSimplificationService = debtSimplificationService;
    }

    @GetMapping
    public ResponseEntity<List<SimplifiedDebtDTO>> getSimplifiedDebts(@PathVariable Long groupId) {
        return ResponseEntity.ok(debtSimplificationService.simplifyDebts(groupId));
    }
}
