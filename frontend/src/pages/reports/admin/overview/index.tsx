import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../../../api";
import { useAdminOverviewReport } from "./hooks";
import { description, formatMetricValue, icon, metrics, title } from "./utils";

export function AdminOverviewReportPage() {
  const report = useAdminOverviewReport();
  const row = report.data?.rows[0] ?? {};
  const Icon = icon;

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

      {report.isLoading ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-8 text-center text-sm text-zinc-400">
          Carregando relatório...
        </div>
      ) : null}

      {report.error ? (
        <div className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {getApiErrorMessage(report.error)}
        </div>
      ) : null}

      {!report.isLoading && !report.error ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => (
            <MetricCard
              icon={metric.icon}
              key={metric.key}
              label={metric.label}
              value={formatMetricValue(row[metric.key])}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

type MetricCardProps = {
  icon: typeof icon;
  label: string;
  value: string;
};

function MetricCard({ icon: MetricIcon, label, value }: MetricCardProps) {
  return (
    <article className="min-h-32 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-zinc-950 text-cyan-300">
          <MetricIcon className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </p>
      </div>
      <p className="mt-5 text-3xl font-semibold">{value}</p>
    </article>
  );
}
