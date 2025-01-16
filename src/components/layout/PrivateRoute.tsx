import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { getToken } from "../../storage/AuthStorage.ts";

const PrivateRoute = ({ children }: any) => {
    const token = getToken();
    console.log("PrivateRoute - Token:", token);

    const expirationDateString = secureLocalStorage.getItem("expirationDate");
    console.log("PrivateRoute - Expiration date (string):", expirationDateString);

    const expirationDateNumber = expirationDateString ? Number(expirationDateString) : 0;
    console.log("PrivateRoute - Expiration date (number):", expirationDateNumber);

    const now = new Date().getTime();
    console.log("PrivateRoute - Current time (ms):", now);

    if (!token || !expirationDateNumber || now > expirationDateNumber) {
        console.log("PrivateRoute - Warunek NIESPEŁNIONY (przekierowuję na '/')");
        return <Navigate to="/" />;
    }

    console.log("PrivateRoute - Warunek SPEŁNIONY (renderuję children)");
    return children;
};

export default PrivateRoute;
