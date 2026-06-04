import { Trophy } from "lucide-react";
import type { DataGridColumn } from "../../../../components/DataGrid";

export const title = "Top pilotos";
export const description = "Pilotos com maior pontuação acumulada.";
export const icon = Trophy;

export const columns: DataGridColumn[] = [
  { key: "driver_name", header: "Piloto" },
  { key: "driver_ref", header: "Referência" },
  { key: "total_points", header: "Pontos", align: "right" },
  { key: "races_count", header: "Corridas", align: "right" }
];
