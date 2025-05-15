import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      <Link to="/">
        <div className="absolute top-0 left-3 z-10 m-3 cursor-pointer block md:left-auto">
          <span className="flex items-end font-black text-primary-green">
            <img src="/Q-logo.svg" alt="Queue In Logo" className=" w-15 " />{" "}
            UEUE IN
          </span>
        </div>
      </Link>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 bg-fixed ">
        <img
          src="/BackgroundImage.jpg"
          alt="Background Image containing Leaves"
          className="absolute right-0 h-screen w-screen object-cover md:w-2/3 rounded-l-[5rem] "
        />
      </div>

      <div className="relative z-10 w-5/5 sm:w-4/5 h-4/5 border-1 border-white overflow-y-auto lg:w-300 rounded-4xl shadow-2xl bg-white/65">
        <Outlet className="m-0 p-0" />
        {/* This is where your page content will be rendered */}
      </div>
    </div>
  );
};

export default Layout;
