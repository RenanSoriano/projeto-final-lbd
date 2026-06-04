import { Flag } from "lucide-react";
import type { DataGridColumn } from "../../../../components/DataGrid";

export const title = "Top escuderias";
export const description = "Escuderias com maior pontuação acumulada.";
export const icon = Flag;

export const columns: DataGridColumn[] = [
  { key: "constructor_name", header: "Escuderia" },
  { key: "constructor_ref", header: "Referência" },
  { key: "total_points", header: "Pontos", align: "right" },
  { key: "drivers_count", header: "Pilotos", align: "right" }
];
