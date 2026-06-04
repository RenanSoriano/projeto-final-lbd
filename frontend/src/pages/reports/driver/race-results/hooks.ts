import { useQuery } from "@tanstack/react-query";
import type { ReportPaginationParams } from "../../../../api";
import { getReportRows } from "../../../../api";

export function useDriverRaceResultsReport(pagination: ReportPaginationParams) {
  return useQuery({
    queryKey: ["reports", "driver", "race-results", pagination],
    queryFn: async () => getReportRows("/reports/driver/race-results", pagination)
  });
}
