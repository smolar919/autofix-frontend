import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Typography,
    Alert,
    Container,
    Grid,
    Paper, Stack
} from "@mui/material";
import { CreateWorkshopForm } from "../api/workshop/form/CreateWorkshopForm.ts";
import { WorkshopApiAxios } from "../api/workshop/api/WorkshopApiAxios.ts";
import {getUserId} from "../storage/AuthStorage.ts";
import {useNavigate} from "react-router-dom";

const AddWorkshop: React.FC = () => {
    const [form, setForm] = useState<CreateWorkshopForm>({
        name: "",
        street: "",
        city: "",
        postalCode: "",
        voivodeship: "",
        country: "",
        ownerId: "",
        ownerPhoneNumber: "",
        description: "",
        openingHours: "",
        serviceIds: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const userId = getUserId();
    const navigate = useNavigate();


    if (!userId) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 2,
                        bgcolor: "#f9f9f9",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Nie jesteś zalogowany
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        Zaloguj się, aby dokonać rezerwacji i uzyskać dostęp do swojego konta.
                    </Typography>
                    <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/login")}
                            sx={{
                                bgcolor: "#4caf50",
                                "&:hover": { bgcolor: "#388e3c" },
                            }}
                        >
                            Przejdź do logowania
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    };


    useEffect(() => {
        const userId = getUserId(); // Fetch the current user's ID
        if (userId) {
            setForm((prev) => ({ ...prev, ownerId: userId }));
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const workshopApi = new WorkshopApiAxios();
            await workshopApi.create(form);
            setSuccess("Warsztat został pomyślnie dodany!");
        } catch (err: any) {
            setError("Wystąpił błąd podczas dodawania warsztatu.");
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Dodaj swój warsztat
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nazwa"
                                name="name"
                                value={form.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ulica"
                                name="street"
                                value={form.street}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Miasto"
                                name="city"
                                value={form.city}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kod pocztowy"
                                name="postalCode"
                                value={form.postalCode}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Województwo"
                                name="voivodeship"
                                value={form.voivodeship}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kraj"
                                name="country"
                                value={form.country}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Numer telefonu właściciela"
                                name="ownerPhoneNumber"
                                value={form.ownerPhoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Opis"
                                name="description"
                                value={form.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Godziny otwarcia"
                                name="openingHours"
                                value={form.openingHours}
                                onChange={handleInputChange}
                                placeholder="np. 9:00 - 18:00"
                            />
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}
                        {success && (
                            <Grid item xs={12}>
                                <Alert severity="success">{success}</Alert>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                            >
                                Dodaj warsztat
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AddWorkshop;
