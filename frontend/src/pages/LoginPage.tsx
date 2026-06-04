import { useMutation } from "@tanstack/react-query";
import { KeyRound, LogIn, User } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api";
import { useAuth } from "../auth";

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => login(loginValue, password),
    onSuccess: () => {
      const from = (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname;
      navigate(from ?? "/dashboard", { replace: true });
    }
  });

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-5 py-8 text-zinc-100">
      <section className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
            Formula Data
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Entrar na ferramenta</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Acesse com seu usuário de administrador, escuderia ou piloto.
          </p>
        </div>

        <form
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-6"
          onSubmit={submit}
        >
          <label className="block text-sm font-medium text-zinc-200" htmlFor="login">
            Identificação
          </label>
          <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 focus-within:border-cyan-300">
            <User className="h-4 w-4 text-zinc-500" />
            <input
              autoComplete="username"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-600"
              id="login"
              onChange={(event) => setLoginValue(event.target.value)}
              placeholder="admin, farina_d, alfa_c"
              required
              value={loginValue}
            />
          </div>

          <label
            className="mt-5 block text-sm font-medium text-zinc-200"
            htmlFor="password"
          >
            Senha
          </label>
          <div className="mt-2 flex h-11 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-950 px-3 focus-within:border-cyan-300">
            <KeyRound className="h-4 w-4 text-zinc-500" />
            <input
              autoComplete="current-password"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-600"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
              required
              type="password"
              value={password}
            />
          </div>

          {mutation.error ? (
            <p className="mt-4 rounded-md border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {getApiErrorMessage(mutation.error)}
            </p>
          ) : null}

          <button
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={mutation.isPending}
            type="submit"
          >
            <LogIn className="h-4 w-4" />
            {mutation.isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
