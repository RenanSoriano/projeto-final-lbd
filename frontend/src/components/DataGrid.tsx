import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, type ReactNode } from "react";

type RowData = Record<string, unknown>;

export type DataGridColumn<TRow extends RowData = RowData> = {
  key: Extract<keyof TRow, string> | string;
  header?: ReactNode;
  cell?: (value: unknown, row: TRow) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
  hidden?: boolean;
};

type DataGridProps<TRow extends RowData = RowData> = {
  rows: TRow[];
  columns?: DataGridColumn<TRow>[];
  includeUnconfiguredColumns?: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    pageSizeOptions: number[];
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
  };
};

function formatHeader(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("pt-BR", {
      maximumFractionDigits: 2
    }).format(value);
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  return String(value);
}

function getAlignClass(align: DataGridColumn["align"]) {
  if (align === "center") {
    return "text-center";
  }

  if (align === "right") {
    return "text-right";
  }

  return "text-left";
}

function createColumnDef<TRow extends RowData>(
  column: DataGridColumn<TRow>
): ColumnDef<TRow> {
  const alignClass = getAlignClass(column.align);

  return {
    accessorKey: column.key,
    header: () => (
      <span className={`${alignClass} block ${column.headerClassName ?? ""}`}>
        {column.header ?? formatHeader(column.key)}
      </span>
    ),
    cell: ({ getValue, row }) => (
      <span className={`${alignClass} block ${column.className ?? ""}`}>
        {column.cell
          ? column.cell(getValue(), row.original)
          : formatCellValue(getValue())}
      </span>
    )
  };
}

export function DataGrid<TRow extends RowData = RowData>({
  rows,
  columns: configuredColumns,
  includeUnconfiguredColumns = true,
  pagination
}: DataGridProps<TRow>) {
  const columns = useMemo<ColumnDef<TRow>[]>(() => {
    const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
    const configuredKeys = new Set(
      configuredColumns?.map((column) => column.key) ?? []
    );
    const visibleConfiguredColumns =
      configuredColumns?.filter((column) => !column.hidden) ?? [];
    const inferredColumns =
      includeUnconfiguredColumns || !configuredColumns
        ? keys
            .filter((key) => !configuredKeys.has(key))
            .map<DataGridColumn<TRow>>((key) => ({ key }))
        : [];

    return [...visibleConfiguredColumns, ...inferredColumns].map((column) =>
      createColumnDef(column)
    );
  }, [configuredColumns, includeUnconfiguredColumns, rows]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  if (rows.length === 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-10 text-center text-sm text-zinc-400">
          Nenhum registro encontrado.
        </div>
        {pagination ? <PaginationControls pagination={pagination} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10 bg-zinc-900 text-xs uppercase tracking-wide text-zinc-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="border-b border-zinc-800 px-4 py-3 font-semibold"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-950">
              {table.getRowModel().rows.map((row) => (
                <tr className="hover:bg-zinc-900" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className="whitespace-nowrap px-4 py-3 text-zinc-200"
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {pagination ? <PaginationControls pagination={pagination} /> : null}
    </div>
  );
}

function PaginationControls({
  pagination
}: {
  pagination: NonNullable<DataGridProps["pagination"]>;
}) {
  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.page < pagination.totalPages;
  const firstItem =
    pagination.total === 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;
  const lastItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
      <p>
        {firstItem}-{lastItem} de {pagination.total} registros
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-zinc-400">
          Linhas
          <select
            className="h-9 rounded-md border border-zinc-700 bg-zinc-950 px-2 text-zinc-100 outline-none focus:border-cyan-300"
            onChange={(event) =>
              pagination.onPageSizeChange(Number(event.target.value))
            }
            value={pagination.pageSize}
          >
            {pagination.pageSizeOptions.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoPrevious}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="min-w-28 text-center text-zinc-400">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoNext}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            type="button"
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
