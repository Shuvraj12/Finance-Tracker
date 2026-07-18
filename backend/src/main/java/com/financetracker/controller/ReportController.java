package com.financetracker.controller;

import com.financetracker.dto.ReportPeriod;
import com.financetracker.dto.ReportResponse;
import com.financetracker.security.UserPrincipal;
import com.financetracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<ReportResponse> getReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "MONTH") ReportPeriod period) {
        return ResponseEntity.ok(reportService.getReport(principal.getId(), period));
    }
}
