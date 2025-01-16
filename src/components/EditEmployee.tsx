import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Alert, Container } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {EditEmployeeForm} from "../api/workshop/form/EditEmployeeForm.ts";
import {EmployeeApiAxios} from "../api/workshop/api/EmployeeApiAxios.ts";

const EditEmployee: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<EditEmployeeForm>({
        position: "",
        phoneNumber: "",
        email: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const employeeApi = new EmployeeApiAxios();
                const employee = await employeeApi.edit(id!, form);
                setForm({
                    position: employee.position,
                    phoneNumber: employee.phoneNumber,
                    email: employee.email,
                });
            } catch (err: any) {
                setError("Nie udało się pobrać danych pracownika.");
            }
        };
        fetchEmployee();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const employeeApi = new EmployeeApiAxios();
            await employeeApi.edit(id!, form);
            setSuccess("Dane pracownika zostały zaktualizowane!");
            setTimeout(() => navigate("/workshop/"), 2000);
        } catch (err: any) {
            setError("Wystąpił błąd podczas aktualizacji danych pracownika.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Edytuj dane pracownika
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField label="Stanowisko" name="position" value={form.position} onChange={handleInputChange} required />
                    <TextField label="Numer telefonu" name="phoneNumber" value={form.phoneNumber} onChange={handleInputChange} required />
                    <TextField label="Email" name="email" value={form.email} onChange={handleInputChange} required />
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                    <Button type="submit" variant="contained" color="primary">
                        Zaktualizuj dane
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default EditEmployee;
