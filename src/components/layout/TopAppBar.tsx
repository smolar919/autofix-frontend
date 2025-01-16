import React, { useEffect, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Divider,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";
import { getToken, getUserId, removeToken } from "../../storage/AuthStorage.ts";
import { UserManagementApiAxios } from "../../api/user-management/api/UserManagementApiAxios.ts";

const TopAppBar: React.FC = () => {
    const [userRole, setUserRole] = useState<string | null>(null);
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        const fetchUserRole = async () => {
            const userId = getUserId();
            if (userId) {
                try {
                    const userApi = new UserManagementApiAxios();
                    const user = await userApi.get(userId);
                    setUserRole(user.role.toString() || null); // Pobieranie roli użytkownika
                } catch (error) {
                    console.error("Błąd podczas pobierania danych użytkownika:", error);
                }
            }
        };

        if (token) {
            fetchUserRole();
        }
    }, [token]);

    const handleDashboard = () => navigate("/");
    const handleHome = () => navigate("/");
    const handleHistory = () => {
        const userId = getUserId();
        if (userId) {
            navigate(`/services/${userId}`);
        }
    };
    const handleVehicles = () => {
        const userId = getUserId();
        if (userId) {
            navigate(`/vehicles/${userId}`);
        }
    };
    const handleWorkshops = () => navigate("/workshops");
    const handleProviderWorkshops = () => navigate("/provider-workshops");
    const handleLogin = () => navigate("/login");
    const handleRegister = () => navigate("/register");
    const handleProfile = () => {
        const userId = getUserId();
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };
    const handleLogout = () => {
        removeToken();
        navigate("/");
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: "#4caf50",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <Box
                        display="flex"
                        alignItems="center"
                        sx={{ cursor: "pointer", flexGrow: 1 }}
                        onClick={handleDashboard}
                    >
                        <DirectionsCarIcon sx={{ mr: 1, fontSize: 40 }} />
                        <Typography
                            variant="h5"
                            sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: "bold" }}
                        >
                            Autofix
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Button
                            color="inherit"
                            startIcon={<HomeIcon />}
                            onClick={handleHome}
                            sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                        >
                            Strona Główna
                        </Button>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                        <Button
                            color="inherit"
                            startIcon={<WorkIcon />}
                            onClick={handleWorkshops}
                            sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                        >
                            Warsztaty
                        </Button>
                        {token ? (
                            <>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                                <Button
                                    color="inherit"
                                    startIcon={<HistoryIcon />}
                                    onClick={handleHistory}
                                    sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                                >
                                    Rezerwacje
                                </Button>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                                <Button
                                    color="inherit"
                                    startIcon={<DirectionsCarFilledIcon />}
                                    onClick={handleVehicles}
                                    sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                                >
                                    Pojazdy
                                </Button>
                                {userRole === "PROVIDER" && (
                                    <>
                                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                                        <Button
                                            color="inherit"
                                            startIcon={<WorkIcon />}
                                            onClick={handleProviderWorkshops}
                                            sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                                        >
                                            Twoje Warsztaty
                                        </Button>
                                    </>
                                )}
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                                <Button
                                    color="inherit"
                                    startIcon={<AccountCircleIcon />}
                                    onClick={handleProfile}
                                    sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                                >
                                    Profil
                                </Button>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                                <Button
                                    color="inherit"
                                    startIcon={<LogoutIcon />}
                                    onClick={handleLogout}
                                    sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                                >
                                    Wyloguj
                                </Button>
                            </>
                        ) : (
                            <>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                                <Button
                                    color="inherit"
                                    startIcon={<LoginIcon />}
                                    onClick={handleLogin}
                                    sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                                >
                                    Zaloguj
                                </Button>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: "white", mx: 1 }} />
                                <Button
                                    color="inherit"
                                    startIcon={<AppRegistrationIcon />}
                                    onClick={handleRegister}
                                    sx={{ mx: 1, "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" } }}
                                >
                                    Zarejestruj się
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
};

export default TopAppBar;
