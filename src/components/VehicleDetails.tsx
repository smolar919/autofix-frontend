import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Paper,
    Grid,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
} from "@mui/material";
import { green } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import { VehicleDto } from "../api/vehicle/response/VehicleDto";
import { VehicleApiAxios } from "../api/vehicle/api/VehicleApiAxios";
import { BookingDto } from "../api/booking/response/BookingDto";
import { BookingApiAxios } from "../api/booking/api/BookingApiAxios";
import { ServiceApiAxios } from "../api/service/api/ServiceApiAxios";
import { WorkshopApiAxios } from "../api/workshop/api/WorkshopApiAxios";
import { TimeSlotApiAxios } from "../api/workshop/api/TimeSlotApiAxios";

const VehicleDetails: React.FC = () => {
    const { userId, vehicleId } = useParams<{ userId: string; vehicleId: string }>();
    const navigate = useNavigate();

    const [vehicle, setVehicle] = useState<VehicleDto | null>(null);
    const [vehicleLoading, setVehicleLoading] = useState(false);
    const [vehicleError, setVehicleError] = useState<string | null>(null);

    const [bookings, setBookings] = useState<any[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState<string | null>(null);

    const vehicleApi = new VehicleApiAxios();
    const bookingApi = new BookingApiAxios();
    const serviceApi = new ServiceApiAxios();
    const workshopApi = new WorkshopApiAxios();
    const timeSlotApi = new TimeSlotApiAxios();

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (vehicleId) {
                try {
                    setVehicleLoading(true);
                    const data = await vehicleApi.getById(vehicleId);
                    setVehicle(data);
                } catch (err) {
                    console.error("Błąd pobierania szczegółów pojazdu:", err);
                    setVehicleError("Błąd pobierania szczegółów pojazdu.");
                } finally {
                    setVehicleLoading(false);
                }
            }
        };
        fetchVehicleDetails();
    }, [vehicleId]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (vehicleId) {
                try {
                    setBookingsLoading(true);
                    const bookingData = await bookingApi.getByVehicleId(vehicleId);

                    const detailedBookings = await Promise.all(
                        bookingData.map(async (booking: BookingDto) => {
                            const workshop = await workshopApi.get(booking.workshopId);
                            const services = await Promise.all(
                                booking.serviceIds.map((serviceId) => serviceApi.get(serviceId))
                            );
                            const timeSlot = await timeSlotApi.get(booking.timeSlotId, workshop.id);

                            return {
                                ...booking,
                                workshopName: workshop.name,
                                serviceNames: services.map((service) => service.name),
                                timeSlotDetails: timeSlot,
                            };
                        })
                    );

                    setBookings(detailedBookings);
                } catch (err) {
                    console.error("Błąd pobierania historii serwisowej:", err);
                    setBookingsError("Błąd pobierania historii serwisowej.");
                } finally {
                    setBookingsLoading(false);
                }
            }
        };
        fetchBookings();
    }, [vehicleId]);

    const handleEditClick = () => {
        navigate(`/vehicles/${userId}/${vehicleId}/edit`);
    };

    if (vehicleLoading) {
        return (
            <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (vehicleError) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h6" color="error">
                    {vehicleError}
                </Typography>
            </Container>
        );
    }

    if (!vehicle) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography variant="h6">Brak szczegółów pojazdu.</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h4">
                        {vehicle.make} {vehicle.model}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditClick}
                        sx={{ backgroundColor: green[600], "&:hover": { backgroundColor: green[700] }, color: "#fff" }}
                    >
                        Edytuj
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1">
                            <strong>Rok:</strong> {vehicle.year}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>VIN:</strong> {vehicle.vin}
                        </Typography>
                        <Typography variant="subtitle1">
                            <strong>Numer rejestracyjny:</strong> {vehicle.registrationNumber}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Historia serwisowa
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {bookingsLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : bookingsError ? (
                    <Typography variant="body1" color="error">
                        {bookingsError}
                    </Typography>
                ) : bookings.length === 0 ? (
                    <Typography variant="body1">Brak historii serwisowej.</Typography>
                ) : (
                    <List>
                        {bookings.map((booking) => (
                            <ListItem key={booking.id} divider>
                                <ListItemText
                                    primary={`${new Date(
                                        booking.timeSlotDetails.startDateTime
                                    ).toLocaleString()} - Status: ${booking.status}`}
                                    secondary={
                                        <>
                                            <Typography variant="body2">
                                                <strong>Warsztat:</strong> {booking.workshopName}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Usługi:</strong> {booking.serviceNames.join(", ")}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Opis usterki:</strong> {booking.faultDescription}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Opis pracy:</strong> {booking.workDescription || "Brak"}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default VehicleDetails;
