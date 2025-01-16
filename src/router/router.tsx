import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.tsx";
import Error from "../pages/error/Error";
import Login from "../components/login/Login";
import Register from "../components/login/Register";
import ResetPasswordRequest from "../components/login/ResetPasswordRequest";
import ResetPasswordConfirm from "../components/login/ResetPasswordConfirm";
import Dashboard from "../components/Dashboard";
import WorkshopPage from "../components/WorkshopPage.tsx";
import AddWorkshop from "../components/AddWorkshop.tsx";
import UserProfile from "../components/UserProfile.tsx";
import VehicleList from "../components/VehicleList.tsx";
import Workshops from "../components/Workshops.tsx";
import VehicleDetails from "../components/VehicleDetails.tsx";
import UserBookings from "../components/UserBookings.tsx";
import ProviderWorkshopsPage from "../components/workshop-management/ProviderWorkshopsPage.tsx";
import WorkshopManagementPage from "../components/workshop-management/WorkshopManagementPage.tsx";
import {BookingPage} from "../components/booking/BookingPage.tsx";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/workshop/:id",
                element: <WorkshopPage />,
            },
            {
                path: "/login",
                element: <Login />,
                errorElement: <Error />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/reset-password",
                element: <ResetPasswordRequest />,
            },
            {
                path: "/reset-password-confirm/:requestId",
                element: <ResetPasswordConfirm />,
            },
            {
                path: "/workshop/add",
                element: <AddWorkshop />,
            },
            {
              path: "/profile/:id",
              element: <UserProfile/>
            },
            {
                path: "/vehicles/:id",
                element: <VehicleList/>
            },
            {
                path: "/vehicles/:userId/:vehicleId",
                element: <VehicleDetails />,
            },
            {
                path: "/services/:userId",
                element: <UserBookings/>
            },
            {
                path: "/workshops",
                element: <Workshops/>
            },
            {
                path: "/provider-workshops",
                element: <ProviderWorkshopsPage />,
            },
            {
                path: "/workshop-management/:workshopId",
                element: <WorkshopManagementPage/>
            },
            {
                path: "/workshop/:workshopId/reserve",
                element: <BookingPage/>
            }
        ],
    },
]);
