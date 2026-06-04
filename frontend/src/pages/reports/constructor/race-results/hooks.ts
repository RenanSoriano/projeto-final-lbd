import { useQuery } from "@tanstack/react-query";
import type { ReportPaginationParams } from "../../../../api";
import { getReportRows } from "../../../../api";

export function useConstructorRaceResultsReport(
  pagination: ReportPaginationParams
) {
  return useQuery({
    queryKey: ["reports", "constructor", "race-results", pagination],
    queryFn: async () =>
      getReportRows("/reports/constructor/race-results", pagination)
  });
}
