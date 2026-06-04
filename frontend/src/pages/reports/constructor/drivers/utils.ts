import { Users } from "lucide-react";
import type { DataGridColumn } from "../../../../components/DataGrid";

export const title = "Pilotos associados";
export const description = "Pilotos que correram pela escuderia.";
export const icon = Users;

export const columns: DataGridColumn[] = [
  { key: "driver_name", header: "Piloto" },
  { key: "driver_ref", header: "Referência" },
  { key: "races_count", header: "Corridas", align: "right" },
  { key: "total_points", header: "Pontos", align: "right" }
];
