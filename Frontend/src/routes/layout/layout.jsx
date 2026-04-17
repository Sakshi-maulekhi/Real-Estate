import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Layout() {
  return (
    <div className="min-h-screen max-w-[1366px] mx-auto px-5 flex flex-col lg:max-w-[1280px] md:max-w-[768px] sm:max-w-[640px]">

      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen max-w-[1366px] mx-auto px-5 flex flex-col lg:max-w-[1280px] md:max-w-[768px] sm:max-w-[640px]">

      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

    </div>
  );
}

export { Layout, RequireAuth };
