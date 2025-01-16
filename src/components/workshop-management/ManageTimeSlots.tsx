import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Button,
    SelectChangeEvent,

} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import "dayjs/locale/pl";
import { TimeSlotApiAxios } from "../../api/workshop/api/TimeSlotApiAxios.ts";
import { TimeSlotDto } from "../../api/workshop/response/TimeSlotDto.ts";
import { EmployeeApiAxios } from "../../api/workshop/api/EmployeeApiAxios.ts";
import TimeSlotGenerator from "./TimeSlotGenerator.tsx";

const ManageWorkshopDetails: React.FC<{ workshopId: string }> = ({ workshopId }) => {
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [timeSlots, setTimeSlots] = useState<TimeSlotDto[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const api = new EmployeeApiAxios();
            try {
                const employeeList = await api.listByWorkshop(workshopId) || [];
                setEmployees(
                    employeeList.map((employee: any) => ({
                        id: employee.id,
                        name: `${employee.firstName} ${employee.lastName}`,
                    }))
                );
            } catch (error) {
                console.error("Błąd podczas pobierania pracowników:", error);
            }
        };
        fetchEmployees();
    }, [workshopId]);

    const fetchTimeSlots = async (date: Dayjs | null, employeeId: string) => {
        if (!date || !employeeId) return;
        const api = new TimeSlotApiAxios();
        try {
            const slots = await api.getByWorkshopId(workshopId, employeeId);
            const filteredSlots = slots.filter((slot) => date.isSame(slot.startDateTime, "day"));
            setTimeSlots(filteredSlots);
        } catch (error) {
            console.error("Błąd podczas pobierania terminów:", error);
        }
    };

    const handleEmployeeChange = (event: SelectChangeEvent<string>) => {
        const employeeId = event.target.value;
        setSelectedEmployeeId(employeeId);
        fetchTimeSlots(selectedDate, employeeId);
    };

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        fetchTimeSlots(date, selectedEmployeeId);
    };

    const handleDeleteSlot = async (slotId: string) => {
        const api = new TimeSlotApiAxios();
        try {
            await api.delete(workshopId, slotId);
            alert("Termin został pomyślnie usunięty.");
            fetchTimeSlots(selectedDate, selectedEmployeeId);
        } catch (error) {
            console.error("Błąd podczas usuwania terminu:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" mb={3}>
                Zarządzanie terminarzem warsztatu
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Wybierz pracownika</InputLabel>
                        <Select value={selectedEmployeeId} onChange={handleEmployeeChange} label="Wybierz pracownika">
                            {employees.map((employee) => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                        <DateCalendar
                            value={selectedDate}
                            onChange={handleDateChange}
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
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                    Terminy na {selectedDate?.format("DD-MM-YYYY") || "wybrany dzień"}:
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Godzina rozpoczęcia</TableCell>
                                <TableCell>Godzina zakończenia</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeSlots.length > 0 ? (
                                timeSlots.map((slot) => (
                                    <TableRow key={slot.id}>
                                        <TableCell>{slot.startDateTime}</TableCell>
                                        <TableCell>{slot.endDateTime}</TableCell>
                                        <TableCell>{slot.status}</TableCell>
                                        <TableCell>
                                            <Button color="error" onClick={() => handleDeleteSlot(slot.id)}>
                                                Usuń
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Brak terminów na wybrany dzień.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <TimeSlotGenerator
                    workshopId={workshopId}
                    onSlotsGenerated={() => fetchTimeSlots(selectedDate, selectedEmployeeId)}
                />
            </Paper>
        </Box>
    );
};

export default ManageWorkshopDetails;
