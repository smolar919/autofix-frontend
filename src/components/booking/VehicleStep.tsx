import React from 'react';
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
    Grid,
} from '@mui/material';
import { VehicleDto } from '../../api/vehicle/response/VehicleDto';

interface VehicleStepProps {
    vehicles: VehicleDto[];
    selectedVehicle: VehicleDto | null;
    setSelectedVehicle: (vehicle: VehicleDto) => void;
    onNext: () => void;
    onBack: () => void;
}

export const VehicleStep: React.FC<VehicleStepProps> = ({
                                                            vehicles,
                                                            selectedVehicle,
                                                            setSelectedVehicle,
                                                            onNext,
                                                            onBack,
                                                        }) => {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" gutterBottom align="center">
                    Wybierz pojazd
                </Typography>
                {vehicles.length > 0 ? (
                    <List sx={{ mb: 3 }}>
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
                                    <ListItemText
                                        primary={`${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>Brak dodanych pojazdów. Dodaj pojazd w swoim profilu.</Typography>
                )}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={onBack}
                            sx={{
                                borderColor: "#4caf50",
                                color: "#4caf50",
                                "&:hover": { borderColor: "#388e3c", color: "#388e3c" },
                            }}
                        >
                            Wstecz
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        {selectedVehicle && (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={onNext}
                                sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                            >
                                Dalej: Wybierz usługi
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};
