import { Navigate } from "react-router-dom";
import { useAuth } from "../../../auth";
import type { UserType } from "../../../types";

type ReportAccessProps = {
  children: React.ReactNode;
  userType: UserType;
};

export function ReportAccess({ children, userType }: ReportAccessProps) {
  const { user } = useAuth();

  if (!user || user.tipo !== userType) {
    return <Navigate replace to="/reports" />;
  }

  return children;
}
