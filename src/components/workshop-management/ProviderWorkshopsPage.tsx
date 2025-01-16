import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Tabs,
    Tab,
    Card,
    CardMedia,
    CardContent,
    Container,
    CircularProgress, Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WorkshopApiAxios } from "../../api/workshop/api/WorkshopApiAxios.ts";
import { WorkshopDto } from "../../api/workshop/response/WorkshopDto.ts";
import { getUserId } from "../../storage/AuthStorage.ts";
import { SearchForm } from "../../commons/search/SearchForm.ts";
import { CriteriaOperator } from "../../commons/search/CriteriaOperator.ts";
import { SearchSortOrder } from "../../commons/search/SearchSortOrder.ts";
import AddIcon from "@mui/icons-material/Add";

const ProviderWorkshopsPage: React.FC = () => {
    const [ownedWorkshops, setOwnedWorkshops] = useState<WorkshopDto[]>([]);
    const [employeeWorkshops, setEmployeeWorkshops] = useState<WorkshopDto[]>([]);
    const [selectedTab, setSelectedTab] = useState("owned");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const userId = getUserId();

    const handleAddWorkshop = () => {
        navigate("/workshop/add");
    };
    useEffect(() => {
        const fetchWorkshops = async () => {
            if (!userId) {
                console.error("Nie udało się pobrać ID użytkownika.");
                return;
            }

            const workshopApi = new WorkshopApiAxios();

            try {
                setLoading(true);

                const ownerSearchForm: SearchForm = {
                    criteria: [
                        {
                            fieldName: "ownerId",
                            value: userId,
                            operator: CriteriaOperator.EQUALS,
                        },
                    ],
                    page: 1,
                    size: 100,
                    sort: {
                        by: "name",
                        order: SearchSortOrder.ASC,
                    },
                };

                const employeeSearchForm: SearchForm = {
                    criteria: [
                        {
                            fieldName: "employees.userId",
                            value: userId,
                            operator: CriteriaOperator.EQUALS,
                        },
                    ],
                    page: 1,
                    size: 100,
                    sort: {
                        by: "name",
                        order: SearchSortOrder.ASC,
                    },
                };

                const [ownerResponse, employeeResponse] = await Promise.all([
                    workshopApi.search(ownerSearchForm),
                    workshopApi.search(employeeSearchForm),
                ]);

                const employeeOnlyWorkshops = employeeResponse.items.filter(
                    (employeeWorkshop) =>
                        !ownerResponse.items.some(
                            (ownerWorkshop) => ownerWorkshop.id === employeeWorkshop.id
                        )
                );

                setOwnedWorkshops(ownerResponse.items);
                setEmployeeWorkshops(employeeOnlyWorkshops);
            } catch (error) {
                console.error("Błąd podczas ładowania warsztatów:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshops();
    }, [userId]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    const handleWorkshopClick = (id: string) => {
        navigate(`/workshop-management/${id}`);
    };

    const renderWorkshopList = (workshops: WorkshopDto[]) => (
        <Grid container spacing={4}>
            {workshops.map((w) => (
                <Grid item xs={12} sm={6} md={4} key={w.id}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            transition: "all 0.3s",
                            "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                            cursor: "pointer",
                        }}
                        onClick={() => handleWorkshopClick(w.id)}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            image="/src/assets/workshop_photo.png"
                            alt="Warsztat"
                        />
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {w.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {w.address?.city || "Brak adresu"}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Paper sx={{ p: 4}}>
                <Box
                    mb={4}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                <Typography
                    variant="h4"
                    component="h1"
                >
                    Twoje warsztaty
                </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: "#4caf50",
                            "&:hover": { bgcolor: "#388e3c" },
                            textTransform: "none",
                        }}
                        onClick={handleAddWorkshop}
                    >
                        Dodaj swój warsztat
                    </Button>
                </Box>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        borderRight: 0,
                        borderColor: "divider",
                        "& .MuiTabs-indicator": {
                            bgcolor: "#4caf50",
                        },
                        "& .Mui-selected": {
                            color: "#4caf50 !important",
                        },
                        my: 4,
                    }}
                >
                    <Tab label="Właściciel" value="owned" />
                    <Tab label="Pracownik" value="employee" />
                </Tabs>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : selectedTab === "owned" ? (
                    ownedWorkshops.length > 0 ? (
                        renderWorkshopList(ownedWorkshops)
                    ) : (
                        <Typography align="center" color="text.secondary">
                            Nie posiadasz warsztatów.
                        </Typography>
                    )
                ) : (
                    employeeWorkshops.length > 0 ? (
                        renderWorkshopList(employeeWorkshops)
                    ) : (
                        <Typography align="center" color="text.secondary">
                            Nie pracujesz w żadnym warsztacie.
                        </Typography>
                    )
                )}
            </Paper>
        </Container>
    );
};

export default ProviderWorkshopsPage;

