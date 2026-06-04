import { BarChart3 } from "lucide-react";
import type { DataGridColumn } from "../../../../components/DataGrid";

export const title = "Resumo de desempenho";
export const description = "Pontos, corridas, vitórias e melhor posição.";
export const icon = BarChart3;

export const columns: DataGridColumn[] = [
  { key: "driver_name", header: "Piloto" },
  { key: "races_count", header: "Corridas", align: "right" },
  { key: "total_points", header: "Pontos", align: "right" },
  { key: "best_position", header: "Melhor posição", align: "right" },
  { key: "wins", header: "Vitórias", align: "right" }
];
