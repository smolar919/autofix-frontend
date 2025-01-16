import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { ServiceApiAxios } from "../../api/service/api/ServiceApiAxios";
import { CreateServiceForm } from "../../api/service/form/CreateServiceForm";
import { EditServiceForm } from "../../api/service/form/EditServiceForm";
import { ServiceDto } from "../../api/service/response/ServiceDto";

interface ManageServicesProps {
    workshopId: string;
}

const ManageServices: React.FC<ManageServicesProps> = ({ workshopId }) => {
    const [services, setServices] = useState<ServiceDto[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [serviceForm, setServiceForm] = useState<CreateServiceForm | EditServiceForm>({
        name: "",
        description: "",
        price: 0,
        workshopId: workshopId,
    });
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            const api = new ServiceApiAxios();
            try {
                const servicesList = await api.listServicesByWorkshopId(workshopId);
                setServices(servicesList);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchServices();
    }, [workshopId]);

    const handleOpenDialog = (service?: ServiceDto) => {
        if (service) {
            setIsEditing(true);
            setEditingServiceId(service.id);
            setServiceForm({
                name: service.name,
                description: service.description,
                price: service.price,
            });
        } else {
            setIsEditing(false);
            setServiceForm({
                name: "",
                description: "",
                price: 0,
                workshopId: workshopId,
            });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setServiceForm({
            name: "",
            description: "",
            price: 0,
            workshopId: workshopId,
        });
        setEditingServiceId(null);
    };

    const handleSaveService = async () => {
        const api = new ServiceApiAxios();
        try {
            if (isEditing && editingServiceId) {
                const updatedService = await api.edit(serviceForm as EditServiceForm, editingServiceId);
                setServices((prev) =>
                    prev.map((service) => (service.id === editingServiceId ? updatedService : service))
                );
            } else {
                const newService = await api.save(serviceForm as CreateServiceForm);
                setServices((prev) => [...prev, newService]);
            }
            handleCloseDialog();
        } catch (error) {
            console.error("Error saving service:", error);
        }
    };

    const handleDeleteService = async (id: string) => {
        const api = new ServiceApiAxios();
        try {
            await api.delete(id);
            setServices((prev) => prev.filter((service) => service.id !== id));
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    const handleFormChange = (
        field: keyof CreateServiceForm | keyof EditServiceForm
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setServiceForm((prev) => ({
            ...prev,
            [field]: field === "price" ? parseFloat(e.target.value) : e.target.value,
        }));
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Zarządzanie usługami</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
                >
                    Dodaj Usługę
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nazwa</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Cena</TableCell>
                            <TableCell align="right">Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>{service.price.toFixed(2)} PLN</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenDialog(service)}
                                        sx={{
                                            bgcolor: "#4caf50",
                                            color: "#fff",
                                            mr: 1,
                                            "&:hover": {
                                                bgcolor: "#388e3c",
                                            },
                                        }}
                                    >
                                        EDYTUJ
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteService(service.id)}
                                        sx={{
                                            bgcolor: "#f44336",
                                            color: "#fff",
                                            "&:hover": {
                                                bgcolor: "#d32f2f",
                                            },
                                        }}
                                    >
                                        USUŃ
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>{isEditing ? "Edytuj Usługę" : "Dodaj Nową Usługę"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Nazwa"
                        margin="normal"
                        value={serviceForm.name}
                        onChange={handleFormChange("name")}
                    />
                    <TextField
                        fullWidth
                        label="Opis"
                        margin="normal"
                        value={serviceForm.description}
                        onChange={handleFormChange("description")}
                    />
                    <TextField
                        fullWidth
                        label="Cena"
                        type="number"
                        margin="normal"
                        value={serviceForm.price}
                        onChange={handleFormChange("price")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSaveService} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageServices;


