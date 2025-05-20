import { Outlet } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import useAuth from "../hooks/useAuth";

const DBLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Outlet />;
  } else {
    return (
      <div className="h-full w-full md:grid md:grid-cols-5">
        <Sidenav />
        <div className="md:col-span-4 ">
          <Outlet />
        </div>
      </div>
    );
  }
};

export default DBLayout;
