import React from 'react';
import { Container, Paper, Box, Typography, Button } from '@mui/material';
import { BookingDto } from '../../api/booking/response/BookingDto';
import { VehicleDto } from '../../api/vehicle/response/VehicleDto';
import { EmployeeDto } from '../../api/workshop/response/EmployeeDto';
import { TimeSlotDto } from '../../api/workshop/response/TimeSlotDto';

interface ConfirmationStepProps {
    bookingResult: BookingDto;
    selectedTimeSlot: TimeSlotDto;
    selectedVehicle: VehicleDto;
    selectedEmployee: EmployeeDto | null;
    onNewBooking: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
                                                                      bookingResult,
                                                                      selectedTimeSlot,
                                                                      selectedVehicle,
                                                                      selectedEmployee,
                                                                      onNewBooking,
                                                                  }) => {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Rezerwacja potwierdzona!
                </Typography>
                <Box mb={2}>
                    <Typography>
                        <strong>Numer rezerwacji:</strong> {bookingResult.id}
                    </Typography>
                    <Typography>
                        <strong>Data wizyty:</strong> {new Date(selectedTimeSlot.startDateTime).toLocaleString()}
                    </Typography>
                    <Typography>
                        <strong>Pojazd:</strong> {selectedVehicle.make} {selectedVehicle.model} (
                        {selectedVehicle.registrationNumber})
                    </Typography>
                    <Typography>
                        <strong>Pracownik:</strong>{" "}
                        {selectedEmployee
                            ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                            : "Przydzielony automatycznie"}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={onNewBooking}
                    sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                >
                    Nowa rezerwacja
                </Button>
            </Paper>
        </Container>
    );
};
