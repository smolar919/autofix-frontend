import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    Avatar,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { green } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { UserDto } from "../api/user-management/response/UserDto.ts";
import { EditUserForm } from "../api/user-management/form/EditUserForm.ts";
import { UserManagementApiAxios } from "../api/user-management/api/UserManagementApiAxios.ts";

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<UserDto | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<EditUserForm>({ id: "", firstName: "", lastName: "", email: "" });

    const userApi = new UserManagementApiAxios();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userApi.get(id!);
                setUser(userData);
                setEditForm({
                    id: userData.id,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUser();
    }, [id]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleSave = async () => {
        try {
            const updatedUser = await userApi.update(editForm);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ textAlign: "center", py: 5 }}>
                <Typography variant="h6">Wczytywanie profilu użytkownika...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box mt={4}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    <Box display="flex" alignItems="center" mb={3}>
                        <Avatar
                            sx={{
                                width: 60,
                                height: 60,
                                mr: 3,
                                bgcolor: green[500],
                                fontSize: 24,
                            }}
                        >
                            {user.firstName[0]}
                        </Avatar>
                        <Typography variant="h5">
                            {user.firstName} {user.lastName}
                        </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Imię"
                                variant="outlined"
                                fullWidth
                                name="firstName"
                                value={isEditing ? editForm.firstName : user.firstName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nazwisko"
                                variant="outlined"
                                fullWidth
                                name="lastName"
                                value={isEditing ? editForm.lastName : user.lastName}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                name="email"
                                value={isEditing ? editForm.email : user.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                sx={{ mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                            onClick={isEditing ? handleSave : handleEditToggle}
                            sx={{
                                bgcolor: green[600],
                                color: "#fff",
                                "&:hover": { bgcolor: green[700] },
                            }}
                        >
                            {isEditing ? "Zapisz" : "Edytuj"}
                        </Button>
                        {isEditing && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => setIsEditing(false)}
                                sx={{
                                    borderColor: green[600],
                                    color: green[600],
                                    "&:hover": { borderColor: green[700], color: green[700] },
                                }}
                            >
                                Anuluj
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default UserProfile;
