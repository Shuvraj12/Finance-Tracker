package com.financetracker.service;

import com.financetracker.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard(Long userId);
}
