import React, { useState, ChangeEvent } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import StarIcon from "@mui/icons-material/Star";
import CampaignIcon from "@mui/icons-material/Campaign";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [searchCity, setSearchCity] = useState<string>("");
    const [searchName, setSearchName] = useState<string>("");

    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchCity(event.target.value);
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
    };

    const handleSearch = () => {
        navigate("/workshops", { state: { city: searchCity, name: searchName } });
    };

    const handleAddWorkshop = () => {
        navigate("/workshop/add");
    };

    return (
        <Container disableGutters>
            <Paper sx={{ mb: 2, mx: 2 , mt: 3}}>
                <Box
                    sx={{
                        backgroundImage: "url('/src/assets/workshop.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "400px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        textAlign: "center",
                    }}
                ></Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", px: 3, py: 6 }}>
                    <Box sx={{ maxWidth: 1000, width: "100%" }}>
                        <Typography variant="h4" gutterBottom>
                            Znajdź najlepsze warsztaty samochodowe
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Wyszukaj warsztaty w swojej okolicy i wybierz najlepsze usługi.
                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    label="Miasto"
                                    variant="outlined"
                                    value={searchCity}
                                    onChange={handleCityChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <TextField
                                    label="Nazwa warsztatu"
                                    variant="outlined"
                                    value={searchName}
                                    onChange={handleNameChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        height: "100%",
                                        minWidth: "120px",
                                        bgcolor: "#4caf50",
                                        "&:hover": { bgcolor: "#388e3c" },
                                    }}
                                    startIcon={<SearchIcon />}
                                    onClick={() => handleSearch()}
                                >
                                    Szukaj
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Paper>

            <Paper sx={{m:2}}>
            <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Dlaczego Autofix?
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 800, mx: "auto" }}>
                    Autofix to platforma, która łączy klientów z najlepszymi warsztatami samochodowymi. Niezależnie od tego, czy
                    jesteś klientem szukającym serwisu, czy właścicielem warsztatu chcącym zwiększyć swoją widoczność, Autofix
                    jest dla Ciebie.
                </Typography>
            </Box>
                <Divider orientation="horizontal" variant="middle" flexItem sx={{ bgcolor: "#e0e0e0" }} />

                <Box sx={{ px: 3, py: 3, textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                        Dla klientów
                    </Typography>
                    <Grid container spacing={4} justifyContent="space-around" alignItems="center">
                        <Grid item md={3} sm={12}>
                            <Box>
                                <SearchIcon fontSize="large" sx={{ mb: 2, color: "#4caf50" }} />
                                <Typography variant="h6" gutterBottom>
                                    Szybkie wyszukiwanie
                                </Typography>
                                <Typography variant="body1">
                                    Autofix umożliwia szybkie znalezienie warsztatu w Twojej okolicy.
                                </Typography>
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "#e0e0e0" }} />
                        <Grid item md={3} sm={12}>
                            <Box>
                                <EventAvailableIcon fontSize="large" sx={{ mb: 2, color: "#4caf50" }} />
                                <Typography variant="h6" gutterBottom>
                                    Rezerwacje online
                                </Typography>
                                <Typography variant="body1">
                                    Zarezerwuj wizytę w warsztacie w kilka minut, bez wychodzenia z domu.
                                </Typography>
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "#e0e0e0" }} />
                        <Grid item md={3} sm={12}>
                            <Box>
                                <StarIcon fontSize="large" sx={{ mb: 2, color: "#4caf50" }} />
                                <Typography variant="h6" gutterBottom>
                                    Opinie i oceny
                                </Typography>
                                <Typography variant="body1">
                                    Sprawdź opinie innych użytkowników i wybierz najlepszy warsztat.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Divider orientation="horizontal" variant="middle" flexItem sx={{ bgcolor: "#e0e0e0" }} />
                <Box sx={{ px: 3, py:3, textAlign: "center" }}>
                    <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                        Dla właścicieli warsztatów
                    </Typography>
                    <Grid container spacing={4} justifyContent="space-around" alignItems="center">
                        <Grid item md={3} sm={12}>
                            <Box>
                                <CampaignIcon fontSize="large" sx={{ mb: 2, color: "#4caf50" }} />
                                <Typography variant="h6" gutterBottom>
                                    Promuj swój warsztat
                                </Typography>
                                <Typography variant="body1">
                                    Dołącz do naszej platformy i pozwól klientom znaleźć Twój warsztat szybciej niż kiedykolwiek.
                                </Typography>
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "#e0e0e0" }} />
                        <Grid item md={3} sm={12}>
                            <Box>
                                <AssignmentIcon fontSize="large" sx={{ mb: 2, color: "#4caf50" }} />
                                <Typography variant="h6" gutterBottom>
                                    Zarządzaj wizytami
                                </Typography>
                                <Typography variant="body1">
                                    Ułatw sobie zarządzanie rezerwacjami i kontakt z klientami dzięki naszej aplikacji.
                                </Typography>
                            </Box>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "#e0e0e0" }} />
                        <Grid item md={3} sm={12}>
                            <Box>
                                <TrendingUpIcon fontSize="large" sx={{ mb: 2, color: "#4caf50" }} />
                                <Typography variant="h6" gutterBottom>
                                    Rozwijaj swój biznes
                                </Typography>
                                <Typography variant="body1">
                                    Zdobądź więcej klientów i rozwijaj swój warsztat dzięki widoczności na naszej platformie.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Box mt={4} textAlign="center">
                    <Button
                        variant="contained"
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: "1rem",
                            bgcolor: "#4caf50",
                            mb: 4,
                            "&:hover": { bgcolor: "#388e3c" },
                        }}
                        onClick={handleAddWorkshop}
                    >
                        Dodaj swój warsztat
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Dashboard;



