import React, { useEffect, useState, ChangeEvent } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Pagination,
    Paper,
    Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useNavigate, useLocation } from "react-router-dom";
import { WorkshopApiAxios } from "../api/workshop/api/WorkshopApiAxios";
import { WorkshopDto } from "../api/workshop/response/WorkshopDto";
import { SearchFormCriteria } from "../commons/search/SearchFormCriteria";
import { CriteriaOperator } from "../commons/search/CriteriaOperator";
import { SearchForm } from "../commons/search/SearchForm";
import { SearchSortOrder } from "../commons/search/SearchSortOrder";

const Workshops: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const workshopApi = new WorkshopApiAxios();
    const [workshops, setWorkshops] = useState<WorkshopDto[]>([]);
    const [searchCity, setSearchCity] = useState<string>(location.state?.city || "");
    const [searchName, setSearchName] = useState<string>(location.state?.name || "");
    const [sortField, setSortField] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<SearchSortOrder>(SearchSortOrder.ASC);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalWorkshops, setTotalWorkshops] = useState<number>(0);

    const handleSearch = async (page: number = 1) => {
        const criteria: SearchFormCriteria[] = [];
        if (searchCity.trim() !== "") {
            criteria.push({
                fieldName: "address.city",
                value: searchCity,
                operator: CriteriaOperator.LIKE,
            });
        }
        if (searchName.trim() !== "") {
            criteria.push({
                fieldName: "name",
                value: searchName,
                operator: CriteriaOperator.LIKE,
            });
        }

        const searchForm: SearchForm = {
            criteria: criteria,
            page: page,
            size: 5,
            sort: {
                by: sortField,
                order: sortOrder,
            },
        };

        try {
            const response = await workshopApi.search(searchForm);
            setWorkshops(response.items);
            setCurrentPage(page);
            setTotalWorkshops(response.total);
            setTotalPages(Math.ceil(response.total / 5));
        } catch (error) {
            console.error("Error during workshop search:", error);
        }
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchCity(event.target.value);
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
    };

    const handleSortToggle = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === SearchSortOrder.ASC ? SearchSortOrder.DSC : SearchSortOrder.ASC);
        } else {
            setSortField(field);
            setSortOrder(SearchSortOrder.ASC);
        }
        handleSearch(currentPage);
    };

    const handlePageChange = (_: unknown, page: number) => {
        handleSearch(page);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Box mb={4}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Znajdź warsztat samochodowy
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="Miasto"
                                variant="outlined"
                                value={searchCity}
                                onChange={handleCityChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                            <TextField
                                label="Nazwa warsztatu"
                                variant="outlined"
                                value={searchName}
                                onChange={handleNameChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <Button
                                variant="contained"
                                sx={{
                                    height: "100%",
                                    minWidth: "120px",
                                    bgcolor: "#4caf50",
                                    "&:hover": { bgcolor: "#388e3c" },
                                }}
                                startIcon={<SearchIcon />}
                                onClick={() => handleSearch(1)}
                            >
                                Szukaj
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Wyniki: {totalWorkshops}
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Typography
                            variant="body1"
                            onClick={() => handleSortToggle("name")}
                            sx={{
                                cursor: "pointer",
                                fontWeight: sortField === "name" ? "bold" : "normal",
                                textDecoration: sortField === "name" ? "underline" : "none",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Sortuj według nazwy{" "}
                            {sortField === "name" &&
                                (sortOrder === SearchSortOrder.ASC ? (
                                    <ArrowUpwardIcon fontSize="small" />
                                ) : (
                                    <ArrowDownwardIcon fontSize="small" />
                                ))}
                        </Typography>
                        <Typography
                            variant="body1"
                            onClick={() => handleSortToggle("address.city")}
                            sx={{
                                cursor: "pointer",
                                fontWeight: sortField === "address.city" ? "bold" : "normal",
                                textDecoration: sortField === "address.city" ? "underline" : "none",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Sortuj według miasta{" "}
                            {sortField === "address.city" &&
                                (sortOrder === SearchSortOrder.ASC ? (
                                    <ArrowUpwardIcon fontSize="small" />
                                ) : (
                                    <ArrowDownwardIcon fontSize="small" />
                                ))}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box mb={4}>
                        <Grid container spacing={4}>
                            {workshops.map((w) => (
                                <Grid item xs={12} sm={6} md={4} key={w.id}>
                                    <Card
                                        sx={{
                                            borderRadius: 2,
                                            boxShadow: 3,
                                            transition: "all 0.3s",
                                            "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                                        }}
                                        onClick={() => navigate(`/workshop/${w.id}`)}
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
                                            <Typography variant="body2" color="textSecondary">
                                                {w.address?.city || "Brak adresu"}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        sx={{
                            "& .MuiPaginationItem-root.Mui-selected": {
                                backgroundColor: "#4caf50 !important",
                                color: "#fff !important",
                                "&:hover": {
                                    backgroundColor: "#388e3c !important",
                                },
                            },
                        }}
                    />
                </Box>
            </Paper>
        </Container>
    );
};

export default Workshops;
