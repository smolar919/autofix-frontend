import React from "react";
import { Paper, Box, Container } from "@mui/material";

interface FormContainerProps {
    children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
    return (
        <Container maxWidth="xs">
            <Paper
                elevation={3}
                sx={{ p: 4, mt: 8, border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
                <Box>{children}</Box>
            </Paper>
        </Container>
    );
};

export default FormContainer;