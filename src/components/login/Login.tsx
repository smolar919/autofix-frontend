import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
} from "@mui/material";
import FormContainer from "../FormContainer";
import { setToken, getUserId } from "../../storage/AuthStorage";
import { axiosInstance } from "../../AxiosClient.ts";
import { UserManagementApiAxios } from "../../api/user-management/api/UserManagementApiAxios";

const Login: React.FC = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/auth/login", form);
            const { token } = response.data;

            setToken(token);

            const userId = getUserId();
            if (userId) {
                const userApi = new UserManagementApiAxios();
                const user = await userApi.get(userId);

                if (user.role) {
                    localStorage.setItem("role", user.role.toString());
                }
            }

            setError(null);
            navigate(`/`);
        } catch (err: any) {
            console.error("Błąd podczas logowania:", err.response?.data?.message);
            setError("Niepoprawne dane logowania. Spróbuj ponownie.");

            if (err.response?.data?.message === "User is blocked") {
                setError("Twoje konto jest zablokowane.");
            }
        }
    };

    return (
        <FormContainer>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Logowanie
            </Typography>
            <form onSubmit={handleLogin}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Hasło"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}>
                        Zaloguj
                    </Button>
                </Box>
            </form>
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    Nie masz konta?{" "}
                    <Link onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
                        Zarejestruj się
                    </Link>
                </Typography>
                <Typography variant="body2">
                    Zapomniałeś hasła?{" "}
                    <Link onClick={() => navigate("/reset-password")} style={{ cursor: "pointer" }}>
                        Zresetuj hasło
                    </Link>
                </Typography>
            </Box>
        </FormContainer>
    );
};

export default Login;
