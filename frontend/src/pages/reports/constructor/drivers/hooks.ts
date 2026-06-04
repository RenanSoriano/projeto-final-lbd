import { useQuery } from "@tanstack/react-query";
import type { ReportPaginationParams } from "../../../../api";
import { getReportRows } from "../../../../api";

export function useConstructorDriversReport(pagination: ReportPaginationParams) {
  return useQuery({
    queryKey: ["reports", "constructor", "drivers", pagination],
    queryFn: async () => getReportRows("/reports/constructor/drivers", pagination)
  });
}
