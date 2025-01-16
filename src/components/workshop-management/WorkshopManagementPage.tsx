import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Divider, Paper, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import ManageWorkshopDetails from "./ManageWorkshopDetails";
import ManageEmployees from "./ManageEmployees";
import ManageServices from "./ManageServices";
import ManageTimeSlots from "./ManageTimeSlots";
import { WorkshopApiAxios } from "../../api/workshop/api/WorkshopApiAxios";
import ManageBookings from "./ManageBookings.tsx";

export enum ManagementTab {
    DETAILS = 0,
    EMPLOYEES = 1,
    SERVICES = 2,
    TIMESLOTS = 3,
    BOOKINGS = 4,
}

const WorkshopManagementPage: React.FC = () => {
    const { workshopId } = useParams<{ workshopId: string }>();
    const [tab, setTab] = useState<ManagementTab>(ManagementTab.DETAILS);
    const [workshopName, setWorkshopName] = useState<string>("");

    useEffect(() => {
        const fetchWorkshopName = async () => {
            if (workshopId) {
                try {
                    const api = new WorkshopApiAxios();
                    const workshop = await api.get(workshopId);
                    setWorkshopName(workshop.name);
                } catch (error) {
                    console.error("Error fetching workshop:", error);
                }
            }
        };

        fetchWorkshopName();
    }, [workshopId]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    if (!workshopId) {
        return (
            <Typography variant="h6" color="error">
                Nie podano ID warsztatu.
            </Typography>
        );
    }

    return (
        <Box p={4}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            {workshopName || "Ładowanie..."}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Tabs
                            orientation="vertical"
                            value={tab}
                            onChange={handleTabChange}
                            sx={{
                                borderRight: 1,
                                borderColor: "divider",
                                "& .MuiTabs-indicator": {
                                    bgcolor: "#4caf50",
                                },
                                "& .Mui-selected": {
                                    color: "#4caf50 !important",
                                },
                            }}
                        >
                            <Tab label="Szczegóły" />
                            <Tab label="Pracownicy" />
                            <Tab label="Usługi" />
                            <Tab label="Terminy" />
                            <Tab label="Bookingi" />
                        </Tabs>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        {tab === ManagementTab.DETAILS && (
                            <ManageWorkshopDetails workshopId={workshopId} />
                        )}
                        {tab === ManagementTab.EMPLOYEES && (
                            <ManageEmployees workshopId={workshopId} />
                        )}
                        {tab === ManagementTab.SERVICES && (
                            <ManageServices workshopId={workshopId} />
                        )}
                        {tab === ManagementTab.TIMESLOTS && (
                            <ManageTimeSlots workshopId={workshopId} />
                        )}
                        {tab === ManagementTab.BOOKINGS && (
                            <ManageBookings workshopId={workshopId} />
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WorkshopManagementPage;
