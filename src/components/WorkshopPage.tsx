import React, { useEffect, useState, useCallback } from "react";
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    Avatar,
    ListItemText,
    Divider,
    Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { WorkshopApiAxios } from "../api/workshop/api/WorkshopApiAxios.ts";
import { EmployeeApiAxios } from "../api/workshop/api/EmployeeApiAxios.ts";
import { ServiceApiAxios } from "../api/service/api/ServiceApiAxios.ts";
import { WorkshopDto } from "../api/workshop/response/WorkshopDto.ts";

const workshopApi = new WorkshopApiAxios();
const employeeApi = new EmployeeApiAxios();
const serviceApi = new ServiceApiAxios();

const WorkshopPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [workshop, setWorkshop] = useState<WorkshopDto | null>(null);
    const [employees, setEmployees] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    const fetchWorkshop = useCallback(async () => {
        if (!id) return;
        try {
            const data = await workshopApi.get(id);
            setWorkshop(data);
        } catch (error) {
            console.error("Error fetching workshop details:", error);
        }
    }, [id]);

    const fetchEmployees = useCallback(async () => {
        if (!id) return;
        try {
            const data = await employeeApi.listByWorkshop(id);
            setEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    }, [id]);

    const fetchServices = useCallback(async () => {
        if (!id) return;
        try {
            const data = await serviceApi.listServicesByWorkshopId(id);
            setServices(data);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    }, [id]);

    useEffect(() => {
        fetchWorkshop();
        fetchEmployees();
        fetchServices();
    }, [fetchWorkshop, fetchEmployees, fetchServices]);

    const handleBack = () => navigate(-1);

    const handleMakeReservation = () => navigate(`/workshop/${id}/reserve`);

    if (!workshop) {
        return (
            <Container>
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                    Ładowanie szczegółów warsztatu...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Card elevation={3} sx={{ mb: 4 }}>
                <CardHeader
                    title={
                        <Typography variant="h4" sx={{ml:2, mt:2}}>
                            {workshop.name}
                        </Typography>
                    }
                />
                <Divider variant="middle" sx={{ my: 3 }} />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="h6" gutterBottom>
                                Pracownicy
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {employees.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" mt={2}>
                                    Brak przypisanych pracowników.
                                </Typography>
                            ) : (
                                <List>
                                    {employees.map((employee) => (
                                        <ListItem key={employee.id} sx={{ mb: 1, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                                            <Avatar sx={{ bgcolor: "#4caf50", mr: 2 }}>
                                                <PersonIcon />
                                            </Avatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                        {employee.firstName} {employee.lastName}
                                                    </Typography>
                                                }
                                                secondary={`${employee.position} • ${employee.phoneNumber}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}

                            <Box mt={3}>
                                <Typography variant="h6" gutterBottom>
                                    Oferowane usługi
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {services.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                        Brak dostępnych usług.
                                    </Typography>
                                ) : (
                                    <List>
                                        {services.map((service) => (
                                            <ListItem key={service.id}>
                                                <ListItemText
                                                    primary={service.name}
                                                    secondary={`Cena: ${service.price} zł`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1" gutterBottom>
                                Adres warsztatu:
                            </Typography>
                            {workshop.address ? (
                                <Box>
                                    <Typography variant="body2">{workshop.address.street}</Typography>
                                    <Typography variant="body2">
                                        {workshop.address.city}, {workshop.address.postalCode}
                                    </Typography>
                                    <Typography variant="body2">
                                        {workshop.address.voivodeship}, {workshop.address.country}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Brak danych adresowych
                                </Typography>
                            )}

                            <Box mt={2}>
                                <Typography variant="subtitle1">Opis warsztatu:</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {workshop.description || "Brak opisu warsztatu"}
                                </Typography>
                            </Box>

                            <Box mt={2}>
                                <Typography variant="subtitle1">Godziny otwarcia:</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {workshop.openingHours || "Brak informacji o godzinach otwarcia"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 3,
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#4caf50",
                            "&:hover": { bgcolor: "#388e3c" },
                        }}
                        onClick={handleMakeReservation}
                    >
                        Zarezerwuj wizytę
                    </Button>
                </Box>
            </Card>
            <Button
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                onClick={handleBack}
                sx={{ mt: 3 }}
            >
                Wróć
            </Button>
        </Container>
    );
};

export default WorkshopPage;
