import React from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    List,
    ListItem,
    FormControlLabel,
    Checkbox,
    TextField,
    Button,
    Grid,
} from '@mui/material';
import { ServiceDto } from '../../api/service/response/ServiceDto';

interface ServiceStepProps {
    services: ServiceDto[];
    selectedServiceIds: string[];
    setSelectedServiceIds: (ids: string[]) => void;
    faultDescription: string;
    setFaultDescription: (desc: string) => void;
    onConfirm: () => void;
    onBack: () => void;
}

export const ServiceStep: React.FC<ServiceStepProps> = ({
                                                            services,
                                                            selectedServiceIds,
                                                            setSelectedServiceIds,
                                                            faultDescription,
                                                            setFaultDescription,
                                                            onConfirm,
                                                            onBack,
                                                        }) => {
    const handleCheckboxChange = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedServiceIds([...selectedServiceIds, id]);
        } else {
            setSelectedServiceIds(selectedServiceIds.filter((serviceId) => serviceId !== id));
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Wybierz usługi
                </Typography>
                {services.length > 0 ? (
                    <List>
                        {services.map((service) => (
                            <ListItem key={service.id} disablePadding>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedServiceIds.includes(service.id)}
                                            onChange={(e) => handleCheckboxChange(service.id, e.target.checked)}
                                        />
                                    }
                                    label={`${service.name} - ${service.price.toFixed(2)} zł`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>Brak usług w ofercie warsztatu.</Typography>
                )}
                <Box sx={{ mt: 2, mb: 2 }}>
                    <TextField
                        label="Opis usterki (jeśli usługa nie występuje na liście)"
                        multiline
                        rows={4}
                        value={faultDescription}
                        onChange={(e) => setFaultDescription(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button variant="outlined" fullWidth onClick={onBack}>
                            Wstecz
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" fullWidth onClick={onConfirm}>
                            Zatwierdź rezerwację
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

