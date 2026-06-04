import { ArrowLeft, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../../api";
import { DataGrid, type DataGridColumn } from "../../../components/DataGrid";
import type { ReportRowsResponse } from "../../../types";

type ReportPageFrameProps = {
  columns: DataGridColumn[];
  description: string;
  error: unknown;
  icon: LucideIcon;
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
    pageSizeOptions: number[];
    reportPagination?: ReportRowsResponse["pagination"];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
  rows: Array<Record<string, unknown>>;
  title: string;
};

export function ReportPageFrame({
  columns,
  description,
  error,
  icon: Icon,
  isLoading,
  pagination,
  rows,
  title
}: ReportPageFrameProps) {
  const reportPagination = pagination.reportPagination;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-zinc-900 text-cyan-300">
            <Icon className="h-5 w-5" />
          </span>
          <p className="mt-5 text-sm font-medium uppercase tracking-wide text-cyan-300">
            Relatório
          </p>
          <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>

        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          to="/reports"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-400">
          Carregando relatório...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {getApiErrorMessage(error)}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <DataGrid
          columns={columns}
          pagination={
            reportPagination
              ? {
                  page: reportPagination.page,
                  pageSize: reportPagination.pageSize,
                  total: reportPagination.total,
                  totalPages: reportPagination.totalPages,
                  pageSizeOptions: pagination.pageSizeOptions,
                  onPageChange: pagination.onPageChange,
                  onPageSizeChange: pagination.onPageSizeChange
                }
              : {
                  page: pagination.page,
                  pageSize: pagination.pageSize,
                  total: 0,
                  totalPages: 1,
                  pageSizeOptions: pagination.pageSizeOptions,
                  onPageChange: pagination.onPageChange,
                  onPageSizeChange: pagination.onPageSizeChange
                }
          }
          rows={rows}
        />
      ) : null}
    </section>
  );
}
