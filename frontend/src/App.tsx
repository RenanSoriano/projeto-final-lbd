import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { getDatabasePing, getHealth } from "./api.js";

export function App() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: getHealth
  });

  const databasePing = useQuery({
    queryKey: ["database-ping"],
    queryFn: getDatabasePing
  });

  const refresh = () => {
    void health.refetch();
    void databasePing.refetch();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
              Projeto Final
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              Painel do monorepo
            </h1>
          </div>

          <nav className="flex gap-2">
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-300 text-zinc-950"
                    : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                }`
              }
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-300 text-zinc-950"
                    : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                }`
              }
              to="/status"
            >
              Status
            </NavLink>
          </nav>
        </header>

        <section className="grid flex-1 content-center gap-4 py-10 md:grid-cols-2">
          <StatusPanel
            label="API"
            title="Express"
            state={health.isLoading ? "loading" : health.data?.status ?? "offline"}
            detail={
              health.error
                ? health.error.message
                : "GET /health retorna o estado do servidor."
            }
          />

          <StatusPanel
            label="Banco"
            title="Postgres"
            state={
              databasePing.isLoading
                ? "loading"
                : databasePing.data?.ok
                  ? "connected"
                  : "offline"
            }
            detail={
              databasePing.data?.database?.now ??
              databasePing.error?.message ??
              "GET /db/ping valida o pool do Postgres."
            }
          />
        </section>

        <footer className="flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            Backend em <span className="text-zinc-200">localhost:3000</span> e
            frontend em <span className="text-zinc-200">localhost:5173</span>.
          </p>
          <button
            className="h-10 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={health.isFetching || databasePing.isFetching}
            onClick={refresh}
            type="button"
          >
            Atualizar
          </button>
        </footer>
      </div>
    </main>
  );
}

type StatusPanelProps = {
  label: string;
  title: string;
  state: string;
  detail: string;
};

function StatusPanel({ label, title, state, detail }: StatusPanelProps) {
  const isOnline = state === "ok" || state === "connected";

  return (
    <article className="min-h-56 rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            {label}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isOnline
              ? "bg-emerald-300 text-emerald-950"
              : "bg-amber-300 text-amber-950"
          }`}
        >
          {state}
        </span>
      </div>

      <p className="mt-8 break-words text-sm leading-6 text-zinc-300">
        {detail}
      </p>
    </article>
  );
}
