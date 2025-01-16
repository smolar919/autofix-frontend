import React from "react";
import {
    Container,
    Paper,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { EmployeeDto } from "../../api/workshop/response/EmployeeDto";
import { TimeSlotDto } from "../../api/workshop/response/TimeSlotDto";
import {Dayjs} from "dayjs";
import {DateCalendar} from "@mui/x-date-pickers";

interface DateEmployeeStepProps {
    selectedDate: Dayjs | null;
    setSelectedDate: (date: Dayjs | null) => void;
    employees: EmployeeDto[];
    selectedEmployee: EmployeeDto | null;
    setSelectedEmployee: (employee: EmployeeDto | null) => void;
    timeslots: TimeSlotDto[];
    selectedTimeSlot: TimeSlotDto | null;
    setSelectedTimeSlot: (slot: TimeSlotDto | null) => void;
    onNext: () => void;
}

export const DateEmployeeStep: React.FC<DateEmployeeStepProps> = ({
                                                                      selectedDate,
                                                                      setSelectedDate,
                                                                      employees,
                                                                      selectedEmployee,
                                                                      setSelectedEmployee,
                                                                      timeslots,
                                                                      selectedTimeSlot,
                                                                      setSelectedTimeSlot,
                                                                      onNext,
                                                                  }) => {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Wybierz termin wizyty
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                    <Box sx={{ mb: 3 }}>
                        <DateCalendar
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                                setSelectedTimeSlot(null);
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
                        onClick={onNext}
                        sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                    >
                        Dalej: Wybierz pojazd
                    </Button>
                )}
            </Paper>
        </Container>
    );
};
