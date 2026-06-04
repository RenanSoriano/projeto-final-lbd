import { Flag, Gauge, ListChecks, Trophy, Users, type LucideIcon } from "lucide-react";

export const title = "Visão geral";
export const description = "Contagens gerais da base.";
export const icon = Gauge;

export type OverviewMetric = {
  icon: LucideIcon;
  key: string;
  label: string;
};

export const metrics: OverviewMetric[] = [
  { key: "users_count", label: "Usuários", icon: Users },
  { key: "drivers_count", label: "Pilotos", icon: Trophy },
  { key: "constructors_count", label: "Escuderias", icon: Flag },
  { key: "races_count", label: "Corridas", icon: Gauge },
  { key: "results_count", label: "Resultados", icon: ListChecks }
];

export function formatMetricValue(value: unknown) {
  if (typeof value === "number") {
    return new Intl.NumberFormat("pt-BR").format(value);
  }

  if (typeof value === "string" && value !== "") {
    return value;
  }

  return "0";
}
