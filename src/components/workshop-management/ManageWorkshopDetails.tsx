import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Grid, Divider } from "@mui/material";
import { WorkshopApiAxios } from "../../api/workshop/api/WorkshopApiAxios.ts";
import { WorkshopDto } from "../../api/workshop/response/WorkshopDto.ts";
import { EditWorkshopForm } from "../../api/workshop/form/EditWorkshopForm.ts";

interface ManageWorkshopDetailsProps {
    workshopId: string;
}

const ManageWorkshopDetails: React.FC<ManageWorkshopDetailsProps> = ({ workshopId }) => {
    const [workshop, setWorkshop] = useState<WorkshopDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedWorkshop, setUpdatedWorkshop] = useState<EditWorkshopForm | null>(null);

    useEffect(() => {
        const fetchWorkshop = async () => {
            const api = new WorkshopApiAxios();
            try {
                const data = await api.get(workshopId);
                setWorkshop(data);
                setUpdatedWorkshop({
                    name: data.name,
                    description: data.description,
                    street: data.address.street,
                    city: data.address.city,
                    postalCode: data.address.postalCode,
                    voivodeship: data.address.voivodeship,
                    country: data.address.country,
                    openingHours: data.openingHours,
                    serviceIds: data.serviceIds,
                });
            } catch (error) {
                console.error("Błąd podczas ładowania warsztatu:", error);
            }
        };
        fetchWorkshop();
    }, [workshopId]);

    const handleSave = async () => {
        if (updatedWorkshop) {
            try {
                const api = new WorkshopApiAxios();
                await api.edit(workshopId, updatedWorkshop);
                setWorkshop((prevWorkshop) =>
                    prevWorkshop
                        ? {
                            ...prevWorkshop,
                            name: updatedWorkshop.name,
                            description: updatedWorkshop.description,
                            address: {
                                ...prevWorkshop.address,
                                street: updatedWorkshop.street,
                                city: updatedWorkshop.city,
                                postalCode: updatedWorkshop.postalCode,
                                voivodeship: updatedWorkshop.voivodeship,
                                country: updatedWorkshop.country,
                            },
                            openingHours: updatedWorkshop.openingHours,
                            serviceIds: updatedWorkshop.serviceIds,
                        }
                        : null
                );
                setIsEditing(false);
                alert("Zmiany zapisane pomyślnie.");
            } catch (error) {
                console.error("Błąd podczas zapisywania zmian:", error);
                alert("Wystąpił problem podczas zapisywania zmian.");
            }
        }
    };

    const handleCancel = () => {
        if (workshop) {
            setUpdatedWorkshop({
                name: workshop.name,
                description: workshop.description,
                street: workshop.address.street,
                city: workshop.address.city,
                postalCode: workshop.address.postalCode,
                voivodeship: workshop.address.voivodeship,
                country: workshop.address.country,
                openingHours: workshop.openingHours,
                serviceIds: workshop.serviceIds,
            });
        }
        setIsEditing(false);
    };

    return workshop ? (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Szczegóły warsztatu</Typography>
                {!isEditing && (
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#4caf50",
                            color: "#fff",
                            "&:hover": {
                                bgcolor: "#388e3c",
                            },
                        }}
                        onClick={() => setIsEditing(true)}
                    >
                        Edytuj szczegóły
                    </Button>
                )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        <strong>Nazwa warsztatu:</strong>
                    </Typography>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            value={updatedWorkshop?.name || ""}
                            onChange={(e) =>
                                setUpdatedWorkshop((prev) => prev && { ...prev, name: e.target.value })
                            }
                        />
                    ) : (
                        <Typography variant="h6">{workshop.name}</Typography>
                    )}
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        <strong>Godziny otwarcia:</strong>
                    </Typography>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            value={updatedWorkshop?.openingHours || ""}
                            onChange={(e) =>
                                setUpdatedWorkshop((prev) => prev && { ...prev, openingHours: e.target.value })
                            }
                        />
                    ) : (
                        <Typography variant="h6">{workshop.openingHours}</Typography>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        <strong>Opis:</strong>
                    </Typography>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            value={updatedWorkshop?.description || ""}
                            onChange={(e) =>
                                setUpdatedWorkshop((prev) => prev && { ...prev, description: e.target.value })
                            }
                        />
                    ) : (
                        <Typography variant="body1">{workshop.description}</Typography>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                        <strong>Adres:</strong>
                    </Typography>
                    {isEditing ? (
                        <Box display="flex" gap={2}>
                            <TextField
                                fullWidth
                                value={updatedWorkshop?.street || ""}
                                onChange={(e) =>
                                    setUpdatedWorkshop((prev) => prev && { ...prev, street: e.target.value })
                                }
                                label="Ulica"
                            />
                            <TextField
                                fullWidth
                                value={updatedWorkshop?.city || ""}
                                onChange={(e) =>
                                    setUpdatedWorkshop((prev) => prev && { ...prev, city: e.target.value })
                                }
                                label="Miasto"
                            />
                        </Box>
                    ) : (
                        <Typography variant="body1">
                            {workshop.address.street}, {workshop.address.city}, {workshop.address.postalCode}
                        </Typography>
                    )}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {isEditing && (
                <Box display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#4caf50",
                            color: "#fff",
                            "&:hover": {
                                bgcolor: "#388e3c",
                            },
                        }}
                        onClick={handleSave}
                    >
                        Zapisz
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#f44336",
                            color: "#fff",
                            "&:hover": {
                                bgcolor: "#d32f2f",
                            },
                        }}
                        onClick={handleCancel}
                    >
                        Anuluj
                    </Button>
                </Box>
            )}
        </Box>
    ) : (
        <Typography>Ładowanie danych...</Typography>
    );
};

export default ManageWorkshopDetails;


