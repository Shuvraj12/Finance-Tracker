package com.financetracker.service;

import com.financetracker.dto.ReportPeriod;
import com.financetracker.dto.ReportResponse;

public interface ReportService {

    ReportResponse getReport(Long userId, ReportPeriod period);
}
