import { BarChart3, LogOut, PanelLeft, UserCircle } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export function AppShell() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="flex flex-col min-h-screen text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/95">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
              Projeto Final
            </p>
            <h1 className="mt-1 text-2xl font-semibold">Formula Data</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex gap-2">
              <NavButton icon={PanelLeft} label="Dashboard" to="/dashboard" />
              <NavButton icon={BarChart3} label="Relatórios" to="/reports" />
            </nav>

            <div className="flex items-center gap-3 border-t border-zinc-800 pt-3 sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
              <div className="flex min-w-0 items-center gap-2 text-sm">
                <UserCircle className="h-5 w-5 shrink-0 text-zinc-500" />
                <span className="truncate text-zinc-300">{user?.name}</span>
              </div>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-900 px-3 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 py-8 flex-1">
        <Outlet />
      </div>
    </main>
  );
}

type NavButtonProps = {
  icon: typeof PanelLeft;
  label: string;
  to: string;
};

function NavButton({ icon: Icon, label, to }: NavButtonProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        `inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
          isActive
            ? "bg-cyan-300 text-zinc-950"
            : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
        }`
      }
      to={to}
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}
