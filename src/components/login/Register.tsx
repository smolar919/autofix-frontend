import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import FormContainer from "../FormContainer";
import { LoginPassAuthApiAxios } from "../../api/login-pass-auth/api/LoginPassAuthApiAxios";

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordRepeated: string;
}

const MIN_PASSWORD_LENGTH = 8;

const Register: React.FC = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterForm>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordRepeated: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password.length < MIN_PASSWORD_LENGTH) {
            setError(`Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`);
            return;
        }

        if (form.password !== form.passwordRepeated) {
            setError("Hasła nie są identyczne.");
            return;
        }

        setError(null);
        setSuccess(null);

        const api = new LoginPassAuthApiAxios();
        try {
            await api.register({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                password: form.password,
            });

            setSuccess("Rejestracja powiodła się! Przekierowanie na stronę logowania...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            console.error("Błąd rejestracji:", err);

            if (err.response && err.response.data) {
                const { message } = err.response.data;
                setError(message || "Wystąpił nieznany błąd.");
            } else {
                setError("Nie udało się połączyć z serwerem.");
            }
        }
    };

    return (
        <FormContainer>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Rejestracja
            </Typography>
            <form onSubmit={handleRegister}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Imię"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Nazwisko"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Hasło"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Powtórz hasło"
                        name="passwordRepeated"
                        type="password"
                        value={form.passwordRepeated}
                        onChange={handleInputChange}
                        required
                        fullWidth
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                    >
                        Zarejestruj
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate("/login")}
                        sx={{
                            color: "#4caf50",
                            borderColor: "#4caf50",
                            "&:hover": {
                                bgcolor: "rgba(76, 175, 80, 0.08)",
                                borderColor: "#388e3c",
                                color: "#388e3c",
                            },
                        }}
                    >
                        Powrót do logowania
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
};

export default Register;
