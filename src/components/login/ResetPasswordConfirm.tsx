// src/components/login/ResetPasswordConfirm.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import FormContainer from "../FormContainer";
import { LoginPassAuthApiAxios } from "../../api/login-pass-auth/api/LoginPassAuthApiAxios";

interface ResetPasswordForm {
    password: string;
    passwordRepeated: string;
    requestId: string;
}

const ResetPasswordConfirm: React.FC = () => {
    const navigate = useNavigate();
    const { requestId } = useParams();
    const [form, setForm] = useState<ResetPasswordForm>({
        password: "",
        passwordRepeated: "",
        requestId: requestId ?? "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.passwordRepeated) {
            setError("Hasła nie są identyczne.");
            return;
        }

        setError(null);
        setSuccess(null);

        const api = new LoginPassAuthApiAxios();
        try {
            await api.resetPassword({
                password: form.password,
                passwordRepeated: form.passwordRepeated,
                requestId: form.requestId,
            });
            setSuccess("Hasło zostało zresetowane. Możesz się zalogować.");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            setError("Nie udało się zresetować hasła. Spróbuj ponownie.");
        }
    };

    return (
        <FormContainer>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Ustaw nowe hasło
            </Typography>
            <form onSubmit={handleReset}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Nowe hasło"
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
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Zresetuj hasło
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

export default ResetPasswordConfirm;
