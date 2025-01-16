import React, { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    FormControlLabel,
    Checkbox,
    Button,
    Tabs,
    Tab,
    Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { BookingApiAxios } from "../../api/booking/api/BookingApiAxios";
import { EmployeeApiAxios } from "../../api/workshop/api/EmployeeApiAxios";
import { TimeSlotApiAxios } from "../../api/workshop/api/TimeSlotApiAxios";
import { VehicleApiAxios } from "../../api/vehicle/api/VehicleApiAxios";
import { ServiceApiAxios } from "../../api/service/api/ServiceApiAxios";
import { getUserId } from "../../storage/AuthStorage";
import { EmployeeDto } from "../../api/workshop/response/EmployeeDto.ts";
import { TimeSlotDto } from "../../api/workshop/response/TimeSlotDto.ts";
import { VehicleDto } from "../../api/vehicle/response/VehicleDto.ts";
import { ServiceDto } from "../../api/service/response/ServiceDto.ts";
import {DateCalendar, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const { workshopId } = useParams<{ workshopId: string }>();
    const userId = getUserId();

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [employees, setEmployees] = useState<EmployeeDto[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(null);
    const [timeslots, setTimeslots] = useState<TimeSlotDto[]>([]);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotDto | null>(null);

    const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleDto | null>(null);

    const [services, setServices] = useState<ServiceDto[]>([]);
    const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
    const [faultDescription, setFaultDescription] = useState<string>("");

    const [currentTab, setCurrentTab] = useState<number>(0);

    const bookingApi = new BookingApiAxios();
    const employeeApi = new EmployeeApiAxios();
    const timeSlotApi = new TimeSlotApiAxios();
    const vehicleApi = new VehicleApiAxios();
    const serviceApi = new ServiceApiAxios();

    useEffect(() => {
        async function fetchData() {
            try {
                const [employees, vehicles, services] = await Promise.all([
                    employeeApi.listByWorkshop(workshopId!),
                    vehicleApi.getByOwnerId(userId!),
                    serviceApi.listServicesByWorkshopId(workshopId!),
                ]);

                setEmployees(employees);
                setVehicles(vehicles);
                setServices(services);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [workshopId, userId]);

    useEffect(() => {
        if (selectedDate) {
            async function fetchTimeslots() {
                try {
                    const employeeId = selectedEmployee ? selectedEmployee.id : undefined;
                    let slots = await timeSlotApi.getByWorkshopId(workshopId!, employeeId);
                    slots = slots.filter((slot) => {
                        const slotDate = new Date(slot.startDateTime).toISOString().split("T")[0];
                        return slotDate === selectedDate && slot.status === "AVAILABLE";
                    });
                    setTimeslots(slots);
                } catch (error) {
                    console.error("Error fetching timeslots:", error);
                }
            }
            fetchTimeslots();
        }
    }, [selectedDate, selectedEmployee, workshopId]);

    const handleBooking = async () => {
        if (!selectedTimeSlot || !selectedVehicle) {
            alert("Wybierz termin oraz pojazd");
            return;
        }

        const form = {
            workshopId: workshopId!,
            userId: userId!,
            vehicleId: selectedVehicle.id,
            serviceIds: selectedServiceIds,
            employeeId: selectedEmployee ? selectedEmployee.id : selectedTimeSlot!.employeeId,
            timeSlotId: selectedTimeSlot!.id,
            faultDescription,
        };

        try {
            await bookingApi.save(form);
            alert("Rezerwacja zakończona sukcesem!");
            navigate(`/services/${userId}`);
        } catch (error) {
            console.error("Error during booking:", error);
            alert("Wystąpił błąd podczas rezerwacji.");
        }
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const tabs = [
        {
            label: "Termin wizyty",
            content: (
                <Container maxWidth="sm" sx={{ mt: 4 }}>

                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                            <Box sx={{ mb: 3 }}>
                                <DateCalendar
                                    value={selectedDate ? dayjs(selectedDate) : null}
                                    onChange={(newValue) => {
                                        setSelectedDate(newValue?.format("YYYY-MM-DD") || "");
                                        setSelectedTimeSlot(null);
                                    }}
                                    slotProps={{
                                        day: {
                                            sx: {
                                                "&.Mui-selected": {
                                                    bgcolor: "#4caf50",
                                                    color: "#fff",
                                                    "&:hover": {
                                                        bgcolor: "#388e3c",
                                                    },
                                                },
                                                "&.Mui-selected.Mui-focusVisible": {
                                                    bgcolor: "#4caf50",
                                                },
                                                "&.Mui-selected:focus": {
                                                    bgcolor: "#4caf50",
                                                },
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="employee-select-label">Pracownik (opcjonalnie)</InputLabel>
                                <Select
                                    labelId="employee-select-label"
                                    value={selectedEmployee ? selectedEmployee.id : ""}
                                    onChange={(e) => {
                                        const emp = employees.find((emp) => emp.id === e.target.value) || null;
                                        setSelectedEmployee(emp);
                                        setSelectedTimeSlot(null);
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Dowolny</em>
                                    </MenuItem>
                                    {employees.map((emp) => (
                                        <MenuItem key={emp.id} value={emp.id}>
                                            {emp.firstName} {emp.lastName} - {emp.position}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Dostępne godziny:
                            </Typography>
                            {selectedDate ? (
                                timeslots.length > 0 ? (
                                    <List>
                                        {timeslots.map((slot) => (
                                            <ListItem key={slot.id} disablePadding>
                                                <ListItemButton
                                                    selected={selectedTimeSlot?.id === slot.id}
                                                    onClick={() => setSelectedTimeSlot(slot)}
                                                    sx={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: 1,
                                                        mb: 1,
                                                        "&.Mui-selected": {
                                                            bgcolor: "#4caf50",
                                                            color: "#fff",
                                                            "&:hover": {
                                                                bgcolor: "#388e3c",
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary={`${new Date(slot.startDateTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })} - ${new Date(slot.endDateTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}`}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography>Brak dostępnych terminów dla wybranej daty.</Typography>
                                )
                            ) : (
                                <Typography>Wybierz datę, aby wyświetlić terminy.</Typography>
                            )}
                        </Box>

                        {selectedTimeSlot && (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => setCurrentTab((prev) => prev + 1)}
                                sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                            >
                                Dalej: Wybierz pojazd
                            </Button>
                        )}
                </Container>
            ),
        },
        {
            label: "Wybierz pojazd",
            content: (
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Wybierz pojazd
                        </Typography>
                        <List>
                            {vehicles.map((vehicle) => (
                                <ListItem key={vehicle.id} disablePadding>
                                    <ListItemButton
                                        selected={selectedVehicle?.id === vehicle.id}
                                        onClick={() => setSelectedVehicle(vehicle)}
                                        sx={{
                                            border: "1px solid #ccc",
                                            borderRadius: 1,
                                            mb: 1,
                                            "&.Mui-selected": {
                                                bgcolor: "#4caf50",
                                                color: "#fff",
                                                "&:hover": {
                                                    bgcolor: "#388e3c",
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemText primary={`${vehicle.make} ${vehicle.model}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        {selectedVehicle && (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => setCurrentTab((prev) => prev + 1)}
                                sx={{ mt: 3, bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                            >
                                Dalej: Wybierz usługi
                            </Button>
                        )}
                </Container>
            ),
        },
        {
            label: "Wybierz usługi",
            content: (
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Wybierz usługi
                        </Typography>
                        <List>
                            {services.map((service) => (
                                <ListItem key={service.id} disablePadding>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedServiceIds.includes(service.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setSelectedServiceIds((prev) =>
                                                        checked
                                                            ? [...prev, service.id]
                                                            : prev.filter((id) => id !== service.id)
                                                    );
                                                }}
                                                sx={{
                                                    color: "#4caf50",
                                                    "&.Mui-checked": {
                                                        color: "#4caf50",
                                                    },
                                                }}
                                            />
                                        }
                                        label={`${service.name} (${service.price} zł)`}
                                        sx={{ pl: 2 }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <TextField
                            label="Opis usterki"
                            multiline
                            rows={3}
                            value={faultDescription}
                            onChange={(e) => setFaultDescription(e.target.value)}
                            fullWidth
                            sx={{ mt: 2 }}
                        />
                        {selectedServiceIds.length > 0 && (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={() => setCurrentTab((prev) => prev + 1)}
                                sx={{ mt: 3, bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                            >
                                Dalej: Podsumowanie
                            </Button>
                        )}
                </Container>
            ),
        },
        {
            label: "Podsumowanie",
            content: (
                <Container maxWidth="sm" sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom align="center">
                            Podsumowanie rezerwacji
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Data wizyty:
                            </Typography>
                            <Typography>
                                {selectedDate ? dayjs(selectedDate).format("DD-MM-YYYY") : "Nie wybrano"}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Pracownik:
                            </Typography>
                            <Typography>
                                {selectedEmployee
                                    ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                                    : "Dowolny"}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Godzina wizyty:
                            </Typography>
                            <Typography>
                                {selectedTimeSlot
                                    ? `${new Date(selectedTimeSlot.startDateTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })} - ${new Date(selectedTimeSlot.endDateTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}`
                                    : "Nie wybrano"}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Pojazd:
                            </Typography>
                            <Typography>
                                {selectedVehicle
                                    ? `${selectedVehicle.make} ${selectedVehicle.model}`
                                    : "Nie wybrano"}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Usługi:
                            </Typography>
                            <List>
                                {selectedServiceIds.length > 0
                                    ? selectedServiceIds.map((serviceId) => {
                                        const service = services.find((s) => s.id === serviceId);
                                        return (
                                            <ListItem key={serviceId}>
                                                {service ? `${service.name} (${service.price} zł)` : ""}
                                            </ListItem>
                                        );
                                    })
                                    : "Nie wybrano"}
                            </List>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Opis usterki:
                            </Typography>
                            <Typography>{faultDescription || "Brak opisu"}</Typography>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleBooking}
                            sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                        >
                            Zatwierdź rezerwację
                        </Button>
                </Container>
            ),
        },
    ];

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    centered
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        "& .MuiTabs-indicator": {
                            bgcolor: "#4caf50",
                        },
                        "& .Mui-selected": {
                            color: "#4caf50 !important",
                        },
                    }}
                >
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
                <Box sx={{ mt: 4 }}>{tabs[currentTab].content}</Box>
            </Paper>
        </Container>
    );
};
