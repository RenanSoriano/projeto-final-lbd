import { useQuery } from "@tanstack/react-query";
import type { ReportPaginationParams } from "../../../../api";
import { getReportRows } from "../../../../api";

export function useDriverPerformanceSummaryReport(
  pagination: ReportPaginationParams
) {
  return useQuery({
    queryKey: ["reports", "driver", "performance-summary", pagination],
    queryFn: async () =>
      getReportRows("/reports/driver/performance-summary", pagination)
  });
}
