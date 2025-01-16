import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
    Alert,
    Tabs,
    Tab,
    CircularProgress,
    Stack,
} from "@mui/material";
import { BookingApiAxios } from "../../api/booking/api/BookingApiAxios";
import { VehicleApiAxios } from "../../api/vehicle/api/VehicleApiAxios";
import { EmployeeApiAxios } from "../../api/workshop/api/EmployeeApiAxios";
import { ServiceApiAxios } from "../../api/service/api/ServiceApiAxios";
import { UserManagementApiAxios } from "../../api/user-management/api/UserManagementApiAxios";
import { BookingDto, BookingStatus } from "../../api/booking/response/BookingDto";
import { EditBookingForm } from "../../api/booking/form/EditBookingForm";
import {EmployeeDto} from "../../api/workshop/response/EmployeeDto.ts";

interface ExtendedBooking extends BookingDto {
    status: BookingStatus;
    vehicleDetails?: {
        make: string;
        model: string;
        registrationNumber: string;
        vin: string;
    };
    employeeDetails?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    serviceDetails?: { [id: string]: string };
    userDetails?: {
        firstName: string;
        lastName: string;
    };
}

interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
}

const getUserById = async (id: string): Promise<UserDto> => {
    const userApi = new UserManagementApiAxios();
    return await userApi.get(id);
};

interface ServiceDto {
    id: string;
    name: string;
}

const getServiceById = async (id: string): Promise<ServiceDto> => {
    const serviceApi = new ServiceApiAxios();
    return await serviceApi.get(id);
};

interface EditBookingDialogData {
    booking: ExtendedBooking;
    workDescription: string;
    status: BookingStatus;
}

type TabFilter = "active" | "canceled" | "completed";

const ManageBookings: React.FC<{ workshopId: string }> = ({ workshopId }) => {
    const [bookings, setBookings] = useState<ExtendedBooking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tabFilter, setTabFilter] = useState<TabFilter>("active");

    const [employees, setEmployees] = useState<EmployeeDto[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("all");

    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [editData, setEditData] = useState<EditBookingDialogData | null>(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState<boolean>(false);
    const [currentBooking, setCurrentBooking] = useState<ExtendedBooking | null>(null);
    const [newStatus, setNewStatus] = useState<BookingStatus | "">("");

    const [finishDialogOpen, setFinishDialogOpen] = useState<boolean>(false);
    const [finishDescription, setFinishDescription] = useState<string>("");
    const [currentFinishBooking, setCurrentFinishBooking] = useState<ExtendedBooking | null>(null);

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [tabIndex, setTabIndex] = useState<number>(0);

    const bookingApi = React.useMemo(() => new BookingApiAxios(), []);
    const vehicleApi = React.useMemo(() => new VehicleApiAxios(), []);
    const employeeApi = React.useMemo(() => new EmployeeApiAxios(), []);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            let data = await bookingApi.getByWorkshopId(workshopId);
            if (selectedEmployee !== "all") {
                data = data.filter((booking) => booking.employeeId === selectedEmployee);
            }
            const extendedData: ExtendedBooking[] = await Promise.all(
                data.map(async (booking) => {
                    const extendedBooking: ExtendedBooking = { ...booking, status: booking.status };

                    if (booking.vehicleId) {
                        try {
                            const vehicle = await vehicleApi.getById(booking.vehicleId);
                            extendedBooking.vehicleDetails = {
                                make: vehicle.make,
                                model: vehicle.model,
                                registrationNumber: vehicle.registrationNumber,
                                vin: (vehicle as any).vin || "brak VIN",
                            };
                        } catch (error) {
                            console.error("Błąd pobierania pojazdu:", error);
                        }
                    }

                    if (booking.employeeId) {
                        try {
                            const emp = await employeeApi.get(booking.employeeId);
                            extendedBooking.employeeDetails = {
                                firstName: emp.firstName,
                                lastName: emp.lastName,
                                email: emp.email,
                            };
                        } catch (error) {
                            console.error("Błąd pobierania pracownika:", error);
                        }
                    }

                    if (booking.userId) {
                        try {
                            const user = await getUserById(booking.userId);
                            extendedBooking.userDetails = {
                                firstName: user.firstName,
                                lastName: user.lastName,
                            };
                        } catch (error) {
                            console.error("Błąd pobierania klienta:", error);
                        }
                    }

                    if (booking.serviceIds && booking.serviceIds.length > 0) {
                        const serviceNamesArr = await Promise.all(
                            booking.serviceIds.map((serviceId) => getServiceById(serviceId))
                        );
                        extendedBooking.serviceDetails = serviceNamesArr.reduce((acc, service) => {
                            acc[service.id] = service.name;
                            return acc;
                        }, {} as { [id: string]: string });
                    }

                    return extendedBooking;
                })
            );
            setBookings(extendedData);
        } catch (error) {
            console.error("Błąd pobierania rezerwacji:", error);
            setSnackbar({ open: true, message: "Błąd pobierania rezerwacji", severity: "error" });
        } finally {
            setLoading(false);
        }
    }, [bookingApi, vehicleApi, employeeApi, workshopId, selectedEmployee]);

    const fetchEmployees = useCallback(async () => {
        try {
            const data = await employeeApi.listByWorkshop(workshopId);
            setEmployees(data);
        } catch (error) {
            console.error("Błąd pobierania pracowników:", error);
            setSnackbar({ open: true, message: "Błąd pobierania pracowników", severity: "error" });
        }
    }, [employeeApi, workshopId]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Obsługa dialogu zmiany statusu
    const handleOpenStatusDialog = (booking: ExtendedBooking) => {
        setCurrentBooking(booking);
        setNewStatus("");
        setStatusDialogOpen(true);
    };

    const handleSaveStatusChange = async () => {
        if (!currentBooking || !newStatus) return;
        try {
            await bookingApi.updateBookingStatus(currentBooking.id, newStatus);
            setSnackbar({ open: true, message: "Status rezerwacji zaktualizowany", severity: "success" });
            setStatusDialogOpen(false);
            setCurrentBooking(null);
            fetchBookings();
        } catch (error) {
            console.error("Błąd zmiany statusu:", error);
            setSnackbar({ open: true, message: "Błąd zmiany statusu", severity: "error" });
        }
    };

    const handleOpenFinishDialog = (booking: ExtendedBooking) => {
        setCurrentFinishBooking(booking);
        setFinishDescription("");
        setFinishDialogOpen(true);
    };

    const handleSaveFinish = async () => {
        if (!currentFinishBooking) return;
        try {
            const form: EditBookingForm = {
                bookingId: currentFinishBooking.id,
                workDescription: finishDescription,
                status: BookingStatus.COMPLETED,
            };
            await bookingApi.update(form);
            setSnackbar({ open: true, message: "Rezerwacja zakończona", severity: "success" });
            setFinishDialogOpen(false);
            setCurrentFinishBooking(null);
            fetchBookings();
        } catch (error) {
            console.error("Błąd zakończenia rezerwacji:", error);
            setSnackbar({ open: true, message: "Błąd zakończenia rezerwacji", severity: "error" });
        }
    };

    const handleCancelBooking = async (bookingId: string) => {
        try {
            await bookingApi.cancel(bookingId);
            setSnackbar({ open: true, message: "Rezerwacja anulowana", severity: "success" });
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        } catch (error) {
            console.error("Błąd anulowania rezerwacji:", error);
            setSnackbar({ open: true, message: "Błąd anulowania rezerwacji", severity: "error" });
        }
    };

    const handleSaveEdit = async () => {
        if (!editData) return;
        const { booking, workDescription, status } = editData;
        const form: EditBookingForm = {
            bookingId: booking.id,
            workDescription,
            status,
        };

        try {
            await bookingApi.update(form);
            setSnackbar({ open: true, message: "Rezerwacja zaktualizowana", severity: "success" });
            setEditDialogOpen(false);
            setEditData(null);
            fetchBookings();
        } catch (error) {
            console.error("Błąd aktualizacji rezerwacji:", error);
            setSnackbar({ open: true, message: "Błąd aktualizacji rezerwacji", severity: "error" });
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        switch (tabFilter) {
            case "active":
                return booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED;
            case "canceled":
                return (
                    booking.status === BookingStatus.CANCELED ||
                    booking.status === BookingStatus.REJECTED ||
                    booking.status === BookingStatus.EXPIRED
                );
            case "completed":
                return booking.status === BookingStatus.COMPLETED;
            default:
                return true;
        }
    });

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Zarządzanie rezerwacjami
            </Typography>

            {/* Select do wyboru pracownika */}
            <Box sx={{ mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Pracownik</InputLabel>
                    <Select
                        value={selectedEmployee}
                        label="Pracownik"
                        onChange={(e) => setSelectedEmployee(e.target.value as string)}
                    >
                        <MenuItem value="all">Wszystkie</MenuItem>
                        {employees.map((emp) => (
                            <MenuItem key={emp.id} value={emp.id}>
                                {emp.firstName} {emp.lastName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                <Tabs
                    value={tabIndex}
                    onChange={(_, newValue) => {
                        setTabIndex(newValue);
                        // Ustawiamy tabFilter według wybranej zakładki:
                        if (newValue === 0) setTabFilter("active");
                        if (newValue === 1) setTabFilter("canceled");
                        if (newValue === 2) setTabFilter("completed");
                    }}
                    sx={{
                        borderRight: 1,
                        borderColor: "divider",
                        "& .MuiTabs-indicator": {
                            bgcolor: "#4caf50",
                        },
                        "& .Mui-selected": {
                            color: "#4caf50 !important",
                        },
                    }}
                >
                    <Tab label="Aktualne" />
                    <Tab label="Anulowane" />
                    <Tab label="Zakończone" />
                </Tabs>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : filteredBookings.length === 0 ? (
                <Typography align="center" color="text.secondary">
                    Brak rezerwacji dla tego filtra.
                </Typography>
            ) : (
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Numer rezerwacji</TableCell>
                                <TableCell>Data zgłoszenia</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Pojazd (VIN)</TableCell>
                                <TableCell>Klient</TableCell>
                                <TableCell>Usługi</TableCell>
                                <TableCell>Opis usterki</TableCell>
                                <TableCell>Opis wykonanej pracy</TableCell>
                                <TableCell align="center">Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>
                                        {booking.submissionDate ? new Date(booking.submissionDate).toLocaleString() : "-"}
                                    </TableCell>
                                    <TableCell>{booking.status || "-"}</TableCell>
                                    <TableCell>
                                        {booking.vehicleDetails
                                            ? `${booking.vehicleDetails.make} ${booking.vehicleDetails.model} (VIN: ${booking.vehicleDetails.vin})`
                                            : booking.vehicleId}
                                    </TableCell>
                                    <TableCell>
                                        {booking.userDetails
                                            ? `${booking.userDetails.firstName} ${booking.userDetails.lastName}`
                                            : booking.userId}
                                    </TableCell>
                                    <TableCell>
                                        {booking.serviceDetails
                                            ? Object.values(booking.serviceDetails).join(", ")
                                            : booking.serviceIds.join(", ")}
                                    </TableCell>
                                    <TableCell>{booking.faultDescription || "-"}</TableCell>
                                    <TableCell>{booking.workDescription || "-"}</TableCell>
                                    <TableCell align="center">
                                        <Stack spacing={1} alignItems="center">
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="medium"
                                                color="primary"
                                                onClick={() => handleOpenStatusDialog(booking)}
                                            >
                                                Zmień status
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="medium"
                                                color="success"
                                                onClick={() => handleOpenFinishDialog(booking)}
                                            >
                                                Zakończ
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                size="medium"
                                                color="error"
                                                onClick={() => handleCancelBooking(booking.id)}
                                            >
                                                Anuluj
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edycja rezerwacji</DialogTitle>
                <DialogContent dividers>
                    {editData && (
                        <Box component="form" sx={{ mt: 1 }}>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                Numer rezerwacji: <strong>{editData.booking.id}</strong>
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>Status rezerwacji</InputLabel>
                                <Select
                                    value={editData.status}
                                    label="Status rezerwacji"
                                    onChange={(e) =>
                                        setEditData({ ...editData, status: e.target.value as BookingStatus })
                                    }
                                >
                                    {Object.values(BookingStatus).map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Opis wykonanej pracy"
                                fullWidth
                                multiline
                                minRows={3}
                                variant="outlined"
                                value={editData.workDescription}
                                onChange={(e) => setEditData({ ...editData, workDescription: e.target.value })}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary" variant="outlined">
                        Anuluj
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary" variant="contained">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog do zmiany statusu (bez opisu) */}
            <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Zmień status rezerwacji</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Wybierz status</InputLabel>
                        <Select
                            value={newStatus}
                            label="Wybierz status"
                            onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                        >
                            {Object.values(BookingStatus)
                                .filter((status) => status !== currentBooking?.status)
                                .map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)} color="secondary" variant="outlined">
                        Anuluj
                    </Button>
                    <Button onClick={handleSaveStatusChange} color="primary" variant="contained" disabled={!newStatus}>
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={finishDialogOpen} onClose={() => setFinishDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Zakończ rezerwację</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        label="Opis zakończenia"
                        fullWidth
                        multiline
                        minRows={3}
                        variant="outlined"
                        value={finishDescription}
                        onChange={(e) => setFinishDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFinishDialogOpen(false)} color="secondary" variant="outlined">
                        Anuluj
                    </Button>
                    <Button onClick={handleSaveFinish} color="primary" variant="contained">
                        Zakończ rezerwację
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ManageBookings;
