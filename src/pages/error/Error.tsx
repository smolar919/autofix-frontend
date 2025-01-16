import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <Container>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8 }}
            >
                <Typography variant="h4" gutterBottom>
                    Coś poszło nie tak
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoHome}
                    sx={{ mt: 2 }}
                >
                    Wróć do strony głównej
                </Button>
            </Box>
        </Container>
    );
};

export default Error;
