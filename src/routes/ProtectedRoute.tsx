import { Navigate } from "react-router";
import { User } from "../hooks/auth";
import MenuHeader from "../components/MenuHeader";

type ProtectedRouteProps = {
  user: User | null;
  children: React.ReactNode;
};

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <MenuHeader />
      <div style={{ marginLeft: "280px", width: "calc(100% - 280px)" }}>
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoute;
