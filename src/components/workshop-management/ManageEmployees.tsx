import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { EmployeeApiAxios } from "../../api/workshop/api/EmployeeApiAxios";
import { EmployeeDto } from "../../api/workshop/response/EmployeeDto";
import { CreateNewEmployeeForm } from "../../api/workshop/form/CreateNewEmployeeForm";
import { AddExistingEmployeeForm } from "../../api/workshop/form/AddExistingEmployeeForm";
import { EditEmployeeForm } from "../../api/workshop/form/EditEmployeeForm";

interface ManageEmployeesProps {
    workshopId: string;
}

const ManageEmployees: React.FC<ManageEmployeesProps> = ({ workshopId }) => {
    const [employees, setEmployees] = useState<EmployeeDto[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isAddingExisting, setIsAddingExisting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

    const [newEmployeeForm, setNewEmployeeForm] = useState<CreateNewEmployeeForm>({
        firstName: "",
        lastName: "",
        position: "",
        phoneNumber: "",
        email: "",
        workshopId: workshopId,
        password: "",
    });

    const [existingEmployeeForm, setExistingEmployeeForm] = useState<AddExistingEmployeeForm>({
        email: "",
        position: "",
        phoneNumber: "",
        workshopId: workshopId,
    });

    const [editEmployeeForm, setEditEmployeeForm] = useState<EditEmployeeForm>({
        position: "",
        phoneNumber: "",
        email: "",
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const api = new EmployeeApiAxios();
                const data = await api.listByWorkshop(workshopId);
                setEmployees(data);
            } catch (error) {
                console.error("Błąd podczas ładowania pracowników:", error);
            }
        };
        fetchEmployees();
    }, [workshopId]);

    const handleFormChange =
        <T extends object>(setter: React.Dispatch<React.SetStateAction<T>>) =>
            (field: keyof T) =>
                (e: React.ChangeEvent<HTMLInputElement>) => {
                    setter((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                    }));
                };

    const handleAddNewEmployee = async () => {
        try {
            const api = new EmployeeApiAxios();
            const newEmployee = await api.createNew(newEmployeeForm);
            setEmployees((prev) => [...prev, newEmployee]);
            setIsAddingNew(false);
        } catch (error) {
            console.error("Błąd podczas dodawania nowego pracownika:", error);
        }
    };

    const handleAddExistingEmployee = async () => {
        try {
            const api = new EmployeeApiAxios();
            const newEmployee = await api.addExisting(existingEmployeeForm);
            setEmployees((prev) => [...prev, newEmployee]);
            setIsAddingExisting(false);
        } catch (error) {
            console.error("Błąd podczas dodawania istniejącego pracownika:", error);
        }
    };

    const handleEditEmployee = async () => {
        if (editingEmployeeId) {
            try {
                const api = new EmployeeApiAxios();
                const updatedEmployee = await api.edit(editingEmployeeId, editEmployeeForm);
                setEmployees((prev) =>
                    prev.map((employee) =>
                        employee.id === editingEmployeeId ? { ...employee, ...updatedEmployee } : employee
                    )
                );
                setIsEditing(false);
                setEditingEmployeeId(null);
            } catch (error) {
                console.error("Błąd podczas edycji pracownika:", error);
            }
        }
    };

    const handleDeleteEmployee = async (id: string) => {
        try {
            const api = new EmployeeApiAxios();
            await api.delete(id);
            setEmployees((prev) => prev.filter((employee) => employee.id !== id));
        } catch (error) {
            console.error("Błąd podczas usuwania pracownika:", error);
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Zarządzanie pracownikami</Typography>
                <Box>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#4caf50", color: "#fff", mr: 2, '&:hover': { bgcolor: "#388e3c" } }}
                        onClick={() => setIsAddingNew(true)}
                    >
                        Dodaj Nowego Pracownika
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#4caf50", color: "#fff", '&:hover': { bgcolor: "#388e3c" } }}
                        onClick={() => setIsAddingExisting(true)}
                    >
                        Dodaj Istniejącego Pracownika
                    </Button>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Imię</TableCell>
                            <TableCell>Nazwisko</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefon</TableCell>
                            <TableCell>Stanowisko</TableCell>
                            <TableCell>Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.firstName}</TableCell>
                                <TableCell>{employee.lastName}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.phoneNumber}</TableCell>
                                <TableCell>{employee.position}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            setEditingEmployeeId(employee.id);
                                            setEditEmployeeForm({
                                                position: employee.position,
                                                phoneNumber: employee.phoneNumber,
                                                email: employee.email,
                                            });
                                            setIsEditing(true);
                                        }}
                                        sx={{
                                            bgcolor: "#4caf50",
                                            color: "#fff",
                                            "&:hover": {
                                                bgcolor: "#388e3c",
                                            },
                                        }}
                                    >
                                        Edytuj
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDeleteEmployee(employee.id)}
                                        sx={{
                                            bgcolor: "#f44336",
                                            color: "#fff",
                                            ml: 1,
                                            "&:hover": {
                                                bgcolor: "#d32f2f",
                                            },
                                        }}
                                    >
                                        Usuń
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isAddingNew} onClose={() => setIsAddingNew(false)}>
                <DialogTitle>Dodaj Nowego Pracownika</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Imię"
                        margin="normal"
                        onChange={handleFormChange(setNewEmployeeForm)("firstName")}
                    />
                    <TextField
                        fullWidth
                        label="Nazwisko"
                        margin="normal"
                        onChange={handleFormChange(setNewEmployeeForm)("lastName")}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        onChange={handleFormChange(setNewEmployeeForm)("email")}
                    />
                    <TextField
                        fullWidth
                        label="Telefon"
                        margin="normal"
                        onChange={handleFormChange(setNewEmployeeForm)("phoneNumber")}
                    />
                    <TextField
                        fullWidth
                        label="Stanowisko"
                        margin="normal"
                        onChange={handleFormChange(setNewEmployeeForm)("position")}
                    />
                    <TextField
                        fullWidth
                        label="Hasło"
                        margin="normal"
                        onChange={handleFormChange(setNewEmployeeForm)("password")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddingNew(false)} color="secondary">
                        Anuluj
                    </Button>
                    <Button onClick={handleAddNewEmployee} color="primary">
                        Dodaj
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isAddingExisting} onClose={() => setIsAddingExisting(false)}>
                <DialogTitle>Dodaj Istniejącego Pracownika</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        onChange={handleFormChange(setExistingEmployeeForm)("email")}
                    />
                    <TextField
                        fullWidth
                        label="Telefon"
                        margin="normal"
                        onChange={handleFormChange(setExistingEmployeeForm)("phoneNumber")}
                    />
                    <TextField
                        fullWidth
                        label="Stanowisko"
                        margin="normal"
                        onChange={handleFormChange(setExistingEmployeeForm)("position")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddingExisting(false)} color="secondary">
                        Anuluj
                    </Button>
                    <Button onClick={handleAddExistingEmployee} color="primary">
                        Dodaj
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
                <DialogTitle>Edytuj Pracownika</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        value={editEmployeeForm.email}
                        onChange={handleFormChange(setEditEmployeeForm)("email")}
                    />
                    <TextField
                        fullWidth
                        label="Telefon"
                        margin="normal"
                        value={editEmployeeForm.phoneNumber}
                        onChange={handleFormChange(setEditEmployeeForm)("phoneNumber")}
                    />
                    <TextField
                        fullWidth
                        label="Stanowisko"
                        margin="normal"
                        value={editEmployeeForm.position}
                        onChange={handleFormChange(setEditEmployeeForm)("position")}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditing(false)} color="secondary">
                        Anuluj
                    </Button>
                    <Button onClick={handleEditEmployee} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ManageEmployees;