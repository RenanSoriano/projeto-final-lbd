const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

type HealthResponse = {
  status: "ok";
};

type DatabasePingResponse = {
  ok: boolean;
  database?: {
    now: string;
  };
  error?: string;
};

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getHealth() {
  return fetchJson<HealthResponse>("/health");
}

export function getDatabasePing() {
  return fetchJson<DatabasePingResponse>("/db/ping");
}
