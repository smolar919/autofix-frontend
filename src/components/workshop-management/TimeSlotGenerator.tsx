import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { EmployeeApiAxios } from "../../api/workshop/api/EmployeeApiAxios.ts";
import { TimeSlotApiAxios } from "../../api/workshop/api/TimeSlotApiAxios.ts";
import { daysOfWeek } from "../../commons/daysOfWeek.ts";

interface TimeSlotGeneratorProps {
    workshopId: string;
    onSlotsGenerated: () => void;
}

const TimeSlotGenerator: React.FC<TimeSlotGeneratorProps> = ({
                                                                 workshopId,
                                                                 onSlotsGenerated,
                                                             }) => {
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [generationMode, setGenerationMode] = useState<string>("weekly");
    const [weeklySchedule, setWeeklySchedule] = useState<Record<string, { start: string; end: string }>>({});
    const [slotDuration, setSlotDuration] = useState<number>(30);
    const [singleSlot, setSingleSlot] = useState({ start: "", end: "" });

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

    const handleDateChange = (date: Dayjs | null) => {
        if (generationMode === "weekly" && date) {
            const startOfWeek = date.startOf("week");
            setSelectedDate(startOfWeek);
        } else {
            setSelectedDate(date);
        }
    };

    const handleDayToggle = (day: string) => {
        setWeeklySchedule((prev) => {
            const newSchedule = { ...prev };
            if (newSchedule[day]) {
                delete newSchedule[day];
            } else {
                newSchedule[day] = { start: "08:00", end: "16:00" };
            }
            return newSchedule;
        });
    };

    const handleTimeChange = (day: string, field: "start" | "end", value: string) => {
        setWeeklySchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], [field]: value },
        }));
    };

    const handleGenerateSlots = async () => {
        if (!selectedEmployeeId || !selectedDate) {
            alert("Proszę wybrać pracownika i datę.");
            return;
        }

        const api = new TimeSlotApiAxios();
        const slotsToGenerate = [];

        if (generationMode === "weekly") {
            for (const [day, times] of Object.entries(weeklySchedule)) {
                if (!times) continue;
                let currentDate = selectedDate.startOf("week").add(
                    daysOfWeek.findIndex((d) => d.value === day),
                    "day"
                );

                if (!currentDate) continue;

                let startTime = currentDate
                    .set("hour", parseInt(times.start.split(":")[0]))
                    .set("minute", parseInt(times.start.split(":")[1]));
                let endTime = currentDate
                    .set("hour", parseInt(times.end.split(":")[0]))
                    .set("minute", parseInt(times.end.split(":")[1]));

                while (startTime.isBefore(endTime)) {
                    const slotStart = startTime.toISOString();
                    startTime = startTime.add(slotDuration, "minutes");
                    const slotEnd = startTime.toISOString();

                    slotsToGenerate.push({
                        workshopId,
                        startDateTime: slotStart,
                        endDateTime: slotEnd,
                        employeeId: selectedEmployeeId,
                    });
                }
            }
        } else if (generationMode === "single") {
            if (!singleSlot.start || !singleSlot.end) {
                alert("Proszę podać godzinę rozpoczęcia i zakończenia.");
                return;
            }
            slotsToGenerate.push({
                workshopId,
                startDateTime: `${selectedDate.format("YYYY-MM-DD")}T${singleSlot.start}`,
                endDateTime: `${selectedDate.format("YYYY-MM-DD")}T${singleSlot.end}`,
                employeeId: selectedEmployeeId,
            });
        }

        try {
            for (const slot of slotsToGenerate) {
                await api.create(slot);
            }
            alert("Terminy zostały wygenerowane pomyślnie.");
            onSlotsGenerated();
        } catch (error) {
            console.error("Błąd podczas generowania terminów:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h6" mb={3}>
                Generowanie nowych terminów
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Wybierz pracownika</InputLabel>
                        <Select
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            label="Wybierz pracownika"
                        >
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
                    {generationMode === "weekly" && selectedDate && (
                        <Typography variant="body2" color="textSecondary" mt={1}>
                            Wybrano tydzień zaczynający się od {selectedDate.format("DD-MM-YYYY")}
                        </Typography>
                    )}
                </Grid>
            </Grid>

            <Box mt={3}>
                <Button
                    variant="contained"
                    onClick={() => setGenerationMode("weekly")}
                    sx={{
                        bgcolor: generationMode === "weekly" ? "#388e3c" : "#4caf50",
                        color: "#fff",
                        mr: 2,
                        "&:hover": { bgcolor: "#388e3c" },
                    }}
                >
                    Tygodniowo
                </Button>
                <Button
                    variant="contained"
                    onClick={() => setGenerationMode("single")}
                    sx={{
                        bgcolor: generationMode === "single" ? "#388e3c" : "#4caf50",
                        color: "#fff",
                        "&:hover": { bgcolor: "#388e3c" },
                    }}
                >
                    Pojedynczy termin
                </Button>
            </Box>


            <Box mt={3}>
                {generationMode === "weekly" && (
                    <Grid container spacing={2}>
                        {daysOfWeek.map((day) => (
                            <Grid item xs={12} sm={6} md={4} key={day.value}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!!weeklySchedule[day.value]}
                                            onChange={() => handleDayToggle(day.value)}
                                        />
                                    }
                                    label={day.label}
                                />
                                {weeklySchedule[day.value] && (
                                    <Box display="flex" gap={2} mt={1}>
                                        <TextField
                                            label="Start"
                                            type="time"
                                            value={weeklySchedule[day.value]?.start || ""}
                                            onChange={(e) => handleTimeChange(day.value, "start", e.target.value)}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Koniec"
                                            type="time"
                                            value={weeklySchedule[day.value]?.end || ""}
                                            onChange={(e) => handleTimeChange(day.value, "end", e.target.value)}
                                            fullWidth
                                        />
                                    </Box>
                                )}
                            </Grid>
                        ))}
                        <TextField
                            label="Czas trwania (minuty)"
                            type="number"
                            value={slotDuration}
                            onChange={(e) => setSlotDuration(parseInt(e.target.value, 10))}
                            fullWidth
                            sx={{ mt: 3 }}
                        />
                    </Grid>
                )}

                {generationMode === "single" && (
                    <Box>
                        <TextField
                            label="Godzina początkowa"
                            type="time"
                            value={singleSlot.start}
                            onChange={(e) => setSingleSlot({ ...singleSlot, start: e.target.value })}
                            fullWidth
                            sx={{ mt: 3 }}
                        />
                        <TextField
                            label="Godzina końcowa"
                            type="time"
                            value={singleSlot.end}
                            onChange={(e) => setSingleSlot({ ...singleSlot, end: e.target.value })}
                            fullWidth
                            sx={{ mt: 3 }}
                        />
                    </Box>
                )}
            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateSlots}
                    sx={{
                        bgcolor: "#4caf50",
                        color: "#fff",
                        "&:hover": { bgcolor: "#388e3c" },
                    }}
                >
                    Generuj terminy
                </Button>
            </Box>
        </Box>
    );
};

export default TimeSlotGenerator;
