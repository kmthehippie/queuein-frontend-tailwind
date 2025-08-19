import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const pathname = useLocation().pathname;
  const [dbPath, setDbPath] = useState(false);

  useEffect(() => {
    if (pathname.slice(1, 3) === "db") {
      setDbPath(true);
    } else {
      setDbPath(false);
    }
  }, [pathname]);
  return (
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center ">
      {!dbPath && (
        <Link to="/">
          <div className="absolute top-0 left-3 z-10 m-3 cursor-pointer block md:left-auto">
            <span className="flex items-end font-black text-primary-green">
              <img src="/Q-logo.svg" alt="Queue In Logo" className=" w-12 " />{" "}
              UEUE IN
            </span>
          </div>
        </Link>
      )}

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 bg-fixed ">
        <img
          src="/BackgroundImage.jpg"
          alt="Background Image containing Leaves"
          className="absolute right-0 h-screen w-screen object-cover md:w-2/3 rounded-l-[5rem] print:hidden"
        />
      </div>

      <div className="relative z-10 w-5/5 sm:w-4/5 h-[85vh] border-1 border-white overflow-y-auto lg:w-300 rounded-4xl shadow-2xl bg-white/65 print:h-dvh print:shadow-none">
        <Outlet className="m-0 p-0" />
      </div>
    </div>
  );
};

export default Layout;
