//Import Router Stuff
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./assets/context/AuthContext.jsx";
import { SocketProvider } from "./assets/context/SocketContext.jsx";
import { LocalStorageProvider } from "./assets/context/LocalStorageContext.jsx";

//Import Pages
const Layout = lazy(() => import("./assets/pages/Layout"));
const Error = lazy(() => import("./assets/pages/Error"));
const ErrorDB = lazy(() => import("./assets/pages/ErrorDB"));
const Home = lazy(() => import("./assets/pages/Home"));
const LeaveQueue = lazy(() => import("./assets/pages/LeaveQueue.jsx"));
const Register = lazy(() => import("./assets/pages/Register"));

//Import Pages From Account
const Login = lazy(() => import("./assets/pages/account/Login.jsx"));
const Logout = lazy(() => import("./assets/pages/account/Logout.jsx"));
const Settings = lazy(() => import("./assets/pages/account/Settings.jsx"));
const SettingsAccount = lazy(() =>
  import("./assets/pages/account/SettingsAccount.jsx")
);
const SettingsOutlet = lazy(() =>
  import("./assets/pages/account/SettingsOutlet.jsx")
);
const AuditLogs = lazy(() => import("./assets/pages/account/AuditLogs.jsx"));
const AllOutlets = lazy(() => import("./assets/pages/account/AllOutlets.jsx"));
const NewOutlet = lazy(() => import("./assets/pages/account/NewOutlet.jsx"));
const InactiveOutlet = lazy(() =>
  import("./assets/pages/account/InactiveOutlet.jsx")
);
const ActiveOutlet = lazy(() =>
  import("./assets/pages/account/ActiveOutlet.jsx")
);
const IndividualOutlet = lazy(() =>
  import("./assets/pages/account/IndividualOutlet.jsx")
);
const StaffManagement = lazy(() =>
  import("./assets/pages/account/StaffManagement.jsx")
);

//Import Pages From Customer
const AccountLanding = lazy(() =>
  import("./assets/pages/customer/AccountLanding")
);
const OutletLanding = lazy(() =>
  import("./assets/pages/customer/OutletLanding.jsx")
);
const JoinQueue = lazy(() => import("./assets/pages/customer/JoinQueue.jsx"));
const Waiting = lazy(() => import("./assets/pages/customer/Waiting.jsx"));

//Import Components
import ProtectedRoutes from "./assets/components/ProtectedRoutes";
import Sidenav from "./assets/components/Sidenav.jsx";
import LocalStorageCheck from "./assets/components/LocalStorageCheck.jsx";
import AuthCheck from "./assets/components/AuthCheck.jsx";
import QRCode from "./assets/components/QRCode.jsx";

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
          <LocalStorageProvider>
            <LocalStorageCheck />
            <Outlet />
          </LocalStorageProvider>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<div>Loading...</div>}>
                <AccountLanding />
              </Suspense>
            ),
          },
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
          {
            path: "login",
            element: (
              <AuthCheck>
                <Login />
              </AuthCheck>
            ),
          },
          {
            path: "register",
            element: (
              <AuthCheck>
                <Register />
              </AuthCheck>
            ),
          },

          //TODO: forgotpassword,
          {
            path: ":accountId",
            element: (
              <ProtectedRoutes>
                <div className="h-full w-full lg:grid lg:grid-cols-5 top-0 left-0 absolute lg:relative">
                  <Sidenav />
                  <div className="lg:col-span-4 relative">
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
                path: "quit",
                element: <Logout />,
              },
              {
                //* SETTINGS PAGE
                path: "settings",
                element: (
                  <Suspense fallback={<div>Loading...</div>}>
                    <Settings />
                  </Suspense>
                ),
                children: [
                  {
                    path: "account",
                    element: <SettingsAccount />,
                  },
                  {
                    path: "outlet",
                    element: <SettingsOutlet />,
                    children: [
                      {
                        path: "qr/:outletId",
                        element: <QRCode />,
                      },
                    ],
                  },
                  {
                    path: "auditlogs",
                    element: <AuditLogs />,
                  },
                ],
                //element: settings -- set the outlet settings, egs. how long the default estimated wait time is. add new outlets. pay monies to me yay.
                //To edit info such as default estimated wait time, name, address, location map links, waze links, hours open, etc. (So this should be an editable form)
              },
              {
                //* INDIVIDUAL OUTLET
                path: "outlet/:outletId",
                element: <IndividualOutlet />,
                children: [
                  {
                    path: "inactive",
                    element: <InactiveOutlet />,
                  },
                  {
                    path: "active/:queueId",
                    element: (
                      <SocketProvider>
                        <Suspense fallback={<div>Loading...</div>}>
                          <ActiveOutlet />
                        </Suspense>
                      </SocketProvider>
                    ),
                  },
                ],
              },
              {
                path: "customers",
                //element: customers -- displays all customers that agree to share their data here. but if the customer refuse to share data, automatically delete in 24 hours
              },
              {
                path: "staff",
                element: <StaffManagement />,
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
