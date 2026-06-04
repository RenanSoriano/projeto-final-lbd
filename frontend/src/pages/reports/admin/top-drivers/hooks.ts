import { useQuery } from "@tanstack/react-query";
import type { ReportPaginationParams } from "../../../../api";
import { getReportRows } from "../../../../api";

export function useAdminTopDriversReport(pagination: ReportPaginationParams) {
  return useQuery({
    queryKey: ["reports", "admin", "top-drivers", pagination],
    queryFn: async () => getReportRows("/reports/admin/top-drivers", pagination)
  });
}
