import { useQuery } from "@tanstack/react-query";
import { getReportRows } from "../../../../api";

export function useAdminOverviewReport() {
  return useQuery({
    queryKey: ["reports", "admin", "overview"],
    queryFn: async () =>
      getReportRows("/reports/admin/overview", { page: 1, pageSize: 20 })
  });
}
