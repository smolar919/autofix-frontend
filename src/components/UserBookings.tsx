import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Paper,
    Box,
    Typography,
    Divider,
    CircularProgress,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { BookingDto, BookingStatus } from "../api/booking/response/BookingDto";
import { BookingApiAxios } from "../api/booking/api/BookingApiAxios";
import { WorkshopApiAxios } from "../api/workshop/api/WorkshopApiAxios";
import { VehicleApiAxios } from "../api/vehicle/api/VehicleApiAxios";
import { EmployeeApiAxios } from "../api/workshop/api/EmployeeApiAxios";
import { ServiceApiAxios } from "../api/service/api/ServiceApiAxios";

const filterBookings = (bookings: BookingDto[], status: string): BookingDto[] => {
    switch (status) {
        case "active":
            return bookings.filter(
                (booking) =>
                    booking.status === BookingStatus.PENDING ||
                    booking.status === BookingStatus.CONFIRMED ||
                    booking.status === BookingStatus.IN_PROGRESS
            );
        case "canceled":
            return bookings.filter(
                (booking) =>
                    booking.status === BookingStatus.CANCELED ||
                    booking.status === BookingStatus.REJECTED ||
                    booking.status === BookingStatus.EXPIRED
            );
        case "completed":
            return bookings.filter(
                (booking) => booking.status === BookingStatus.COMPLETED
            );
        default:
            return bookings;
    }
};

const UserBookings: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [bookings, setBookings] = useState<BookingDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState("active");

    const [workshopNames, setWorkshopNames] = useState<Record<string, string>>({});
    const [vehicleDetails, setVehicleDetails] = useState<Record<string, string>>({});
    const [employeeNames, setEmployeeNames] = useState<Record<string, string>>({});
    const [serviceDetails, setServiceDetails] = useState<Record<string, string>>({});

    const bookingApi = new BookingApiAxios();
    const workshopApi = new WorkshopApiAxios();
    const vehicleApi = new VehicleApiAxios();
    const employeeApi = new EmployeeApiAxios();
    const serviceApi = new ServiceApiAxios();

    useEffect(() => {
        const fetchBookings = async () => {
            if (userId) {
                try {
                    setLoading(true);
                    const data = await bookingApi.getByUserId(userId);
                    setBookings(data || []);
                } catch (err) {
                    console.error("Błąd pobierania bookingów:", err);
                    setError("Błąd pobierania bookingów.");
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBookings();
    }, [userId]);

    useEffect(() => {
        const fetchAdditionalDetails = async () => {
            const workshopIds = new Set(bookings.map((b) => b.workshopId));
            const vehicleIds = new Set(bookings.map((b) => b.vehicleId));
            const employeeIds = new Set(bookings.map((b) => b.employeeId).filter(Boolean));
            const serviceIds = new Set(bookings.flatMap((b) => b.serviceIds));

            try {
                for (const id of workshopIds) {
                    if (!workshopNames[id]) {
                        const workshop = await workshopApi.get(id);
                        setWorkshopNames((prev) => ({ ...prev, [id]: workshop.name }));
                    }
                }

                for (const id of vehicleIds) {
                    if (!vehicleDetails[id]) {
                        const vehicle = await vehicleApi.getById(id);
                        setVehicleDetails((prev) => ({
                            ...prev,
                            [id]: `${vehicle.make} ${vehicle.model}`,
                        }));
                    }
                }

                for (const id of employeeIds) {
                    if (!employeeNames[id]) {
                        const employee = await employeeApi.get(id!);
                        setEmployeeNames((prev) => ({
                            ...prev,
                            [id]: `${employee.firstName} ${employee.lastName}`,
                        }));
                    }
                }

                for (const id of serviceIds) {
                    if (!serviceDetails[id]) {
                        const service = await serviceApi.get(id);
                        setServiceDetails((prev) => ({
                            ...prev,
                            [id]: `${service.name} (${service.price.toFixed(2)} zł)`,
                        }));
                    }
                }
            } catch (err) {
                console.error("Błąd pobierania szczegółowych danych:", err);
            }
        };

        if (bookings.length > 0) {
            fetchAdditionalDetails();
        }
    }, [bookings]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    const filteredBookings = filterBookings(bookings, selectedTab);

    return (
        <Container sx={{ py: 6 }}>
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Box mb={4} textAlign="center">
                    <Typography variant="h4" component="h1">
                        Twoje rezerwacje
                    </Typography>
                </Box>

                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        borderRight: 0,
                        borderColor: "divider",
                        "& .MuiTabs-indicator": {
                            bgcolor: "#4caf50",
                        },
                        "& .Mui-selected": {
                            color: "#4caf50 !important",
                        },
                    }}
                >
                    <Tab label="Aktualne" value="active" />
                    <Tab label="Anulowane" value="canceled" />
                    <Tab label="Zakończone" value="completed" />
                </Tabs>

                <Divider sx={{ my: 4 }} />

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography variant="body1" color="error">
                        {error}
                    </Typography>
                ) : filteredBookings.length === 0 ? (
                    <Typography variant="body1" align="center">
                        Brak rezerwacji w tej kategorii.
                    </Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell>Data zgłoszenia</TableCell>
                                <TableCell>Data zakończenia</TableCell>
                                <TableCell>Warsztat</TableCell>
                                <TableCell>Pojazd</TableCell>
                                <TableCell>Pracownik</TableCell>
                                <TableCell>Opis usterki</TableCell>
                                <TableCell>Opis pracy</TableCell>
                                <TableCell>Usługi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.status}</TableCell>
                                    <TableCell>
                                        {booking.submissionDate
                                            ? new Date(booking.submissionDate).toLocaleDateString()
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {booking.completionDate
                                            ? new Date(booking.completionDate).toLocaleDateString()
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{workshopNames[booking.workshopId] || booking.workshopId}</TableCell>
                                    <TableCell>{vehicleDetails[booking.vehicleId] || booking.vehicleId}</TableCell>
                                    <TableCell>
                                        {booking.employeeId
                                            ? employeeNames[booking.employeeId] || booking.employeeId
                                            : "Automatycznie przypisany"}
                                    </TableCell>
                                    <TableCell>{booking.faultDescription || "Brak"}</TableCell>
                                    <TableCell>{booking.workDescription || "Brak"}</TableCell>
                                    <TableCell>
                                        {booking.serviceIds
                                            .map((id) => serviceDetails[id] || id)
                                            .join(", ")}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </Container>
    );
};

export default UserBookings;



