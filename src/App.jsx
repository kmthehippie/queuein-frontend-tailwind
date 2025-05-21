//Import Router Stuff
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./assets/context/AuthContext.jsx";
import { SocketProvider } from "./assets/context/SocketContext.jsx";

//Import Pages
const Layout = lazy(() => import("./assets/pages/Layout"));
const Error = lazy(() => import("./assets/pages/Error"));
const ErrorDB = lazy(() => import("./assets/pages/ErrorDB"));
const Login = lazy(() => import("./assets/pages/Login"));
const Register = lazy(() => import("./assets/pages/Register"));
const Settings = lazy(() => import("./assets/pages/Settings"));
const AccountLanding = lazy(() => import("./assets/pages/AccountLanding"));
const OutletLanding = lazy(() => import("./assets/pages/OutletLanding"));
const JoinQueue = lazy(() => import("./assets/pages/JoinQueue"));
const Waiting = lazy(() => import("./assets/pages/Waiting"));
const Home = lazy(() => import("./assets/pages/Home"));
const AllOutlets = lazy(() => import("./assets/pages/AllOutlets.jsx"));
const NewOutlet = lazy(() => import("./assets/pages/NewOutlet.jsx"));
const LeaveQueue = lazy(() => import("./assets/pages/LeaveQueue.jsx"));

//Import Components
import ProtectedRoutes from "./assets/components/ProtectedRoutes";
import Sidenav from "./assets/components/Sidenav.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: ":acctSlug",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <AccountLanding />
          </Suspense>
        ),
        children: [
          {
            path: "outlet/:outletId",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <OutletLanding />
              </Suspense>
            ),
            //element: OutletLandingPage -- landing page for customer to join queue and view queue data
          },
          {
            path: "join/:queueId",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <JoinQueue />
              </Suspense>
            ),
          },
          {
            path: "queueItem/:queueItem",
            element: (
              <SocketProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <Waiting />
                </Suspense>
              </SocketProvider>
            ),
          },
          {
            path: "leftQueue/:queueItem",
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <LeaveQueue />
              </Suspense>
            ),
          },
          { path: "seated/:queueItem", element: <Waiting /> },
        ],
      },
      {
        path: "/db",
        element: (
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </AuthProvider>
        ),
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          //TODO: forgotpassword,
          {
            path: ":accountId",
            element: (
              <ProtectedRoutes>
                <div className="h-full w-full md:grid md:grid-cols-5">
                  <Sidenav />
                  <div className="md:col-span-4 ">
                    <Outlet />
                  </div>
                </div>
              </ProtectedRoutes>
            ),
            children: [
              {
                //* ALL OUTLETS
                path: "outlets",
                element: <Outlet />,
                children: [
                  {
                    path: "new",
                    element: <NewOutlet />,
                  },
                  {
                    path: "all",
                    element: <AllOutlets />,
                  },
                ],
              },
              {
                //* SETTINGS PAGE
                path: "settings",
                element: <Settings />,
                //element: settings -- set the outlet settings, egs. how long the default estimated wait time is. add new outlets. pay monies to me yay.
                //To edit info such as default estimated wait time, name, address, location map links, waze links, hours open, etc. (So this should be an editable form)
              },
              {
                //* INDIVIDUAL OUTLET
                path: "outlet/:outletId",
                //element: outlet -- here we are inside the outlet element where we can start a queue, or not. etc.
                children: [
                  {
                    path: "inactive",
                    //element: inactiveQueue -- queue is inactive
                  },
                  {
                    path: "active/:queueId",
                    //element: activeQueue -- the active queue where we can call, seat, etc.
                  },
                ],
              },
              {
                path: "customers",
                //element: customers -- displays all customers that agree to share their data here. but if the customer refuse to share data, automatically delete in 24 hours
              },
            ],
          },
          { path: "*", element: <ErrorDB /> },
        ],
      },
      { path: "*", element: <Error /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
