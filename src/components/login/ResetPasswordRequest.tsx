// src/components/login/ResetPasswordRequest.tsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import { LoginPassAuthApiAxios } from "../../api/login-pass-auth/api/LoginPassAuthApiAxios";

const ResetPasswordRequest: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const api = new LoginPassAuthApiAxios();
        try {
            await api.resetPasswordRequest({ email });
            setSuccess("Wysłano link do resetowania hasła. Sprawdź swoją skrzynkę e-mail.");
        } catch (err: any) {
            setError("Nie udało się wysłać żądania resetu hasła. Spróbuj ponownie.");
        }
    };

    return (
        <FormContainer>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Resetowanie hasła
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Wyślij link resetujący
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => navigate("/login")}
                    >
                        Powrót do logowania
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
};

export default ResetPasswordRequest;
