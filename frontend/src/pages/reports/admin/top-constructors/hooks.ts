import { useQuery } from "@tanstack/react-query";
import type { ReportPaginationParams } from "../../../../api";
import { getReportRows } from "../../../../api";

export function useAdminTopConstructorsReport(pagination: ReportPaginationParams) {
  return useQuery({
    queryKey: ["reports", "admin", "top-constructors", pagination],
    queryFn: async () =>
      getReportRows("/reports/admin/top-constructors", pagination)
  });
}
