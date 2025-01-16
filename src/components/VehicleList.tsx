import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Paper,
    List,
    ListItemText,
    Divider,
    ListItemButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { VehicleDto } from "../api/vehicle/response/VehicleDto";
import { CreateVehicleForm } from "../api/vehicle/form/CreateVehicleForm";
import { VehicleApiAxios } from "../api/vehicle/api/VehicleApiAxios";

const VehicleList: React.FC = () => {
    const { id: userId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState<CreateVehicleForm>({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        registrationNumber: "",
        ownerId: userId!,
    });

    const vehicleApi = new VehicleApiAxios();

    useEffect(() => {
        if (userId) {
            fetchVehicles();
        }
    }, [userId]);

    const fetchVehicles = async () => {
        try {
            const data = await vehicleApi.getByOwnerId(userId!);
            setVehicles(data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    const handleAddClick = () => {
        setForm({
            make: "",
            model: "",
            year: new Date().getFullYear(),
            vin: "",
            registrationNumber: "",
            ownerId: userId!,
        });
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDialogSave = async () => {
        try {
            await vehicleApi.save(form);
            fetchVehicles();
            handleDialogClose();
        } catch (error) {
            console.error("Error saving vehicle:", error);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleVehicleDetails = (vehicleId: string) => {
        navigate(`/vehicles/${userId}/${vehicleId}`);
    };

    return (
        <Container sx={{ py: 4 }}>
            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Box
                    mb={4}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h4" component="h1">
                        Twoje pojazdy
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        sx={{
                            bgcolor: "#4caf50",
                            "&:hover": { bgcolor: "#388e3c" },
                            textTransform: "none",
                        }}
                    >
                        Dodaj Pojazd
                    </Button>
                </Box>

                {vehicles.length === 0 ? (
                    <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                        Nie dodano jeszcze pojazdów.
                    </Typography>
                ) : (
                    <List>
                        <Divider variant={"middle"}/>
                        {vehicles.map((vehicle, index) => (
                            <React.Fragment key={vehicle.id}>
                                <ListItemButton
                                    onClick={() => handleVehicleDetails(vehicle.id)}
                                    sx={{
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            bgcolor: "#f5f5f5",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={`${vehicle.make} ${vehicle.model}`}
                                        secondary={`Rok: ${vehicle.year} | Rejestracja: ${vehicle.registrationNumber}`}
                                    />
                                </ListItemButton>
                                {index < vehicles.length - 1 && <Divider variant={"middle"}/>}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>

            <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
                <DialogTitle>Dodaj Pojazd</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Marka"
                        name="make"
                        value={form.make}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Model"
                        name="model"
                        value={form.model}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Rok"
                        name="year"
                        type="number"
                        value={form.year}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="VIN"
                        name="vin"
                        value={form.vin}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Numer Rejestracyjny"
                        name="registrationNumber"
                        value={form.registrationNumber}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="secondary">
                        Anuluj
                    </Button>
                    <Button onClick={handleDialogSave} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VehicleList;

