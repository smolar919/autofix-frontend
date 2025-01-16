import React from "react";
import { Box, Typography, Link, Grid, Container } from "@mui/material";

const Footer: React.FC = () => {
    return (
        <Box
            sx={{
                bgcolor: "#4caf50",
                color: "white",
                py: 4,
                mt: 6,
            }}
        >
            <Container sx={{ maxWidth: "xl" }}>
                <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                >
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            Autofix
                        </Typography>
                        <Typography variant="body2">
                            Najlepsza platforma do wyszukiwania warsztatów samochodowych.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            Szybkie linki
                        </Typography>
                        <Box>
                            <Link href="/workshops" color="inherit" underline="hover" display="block">
                                Znajdź warsztat
                            </Link>
                            <Link href="/workshop/add" color="inherit" underline="hover" display="block">
                                Dodaj swój warsztat
                            </Link>
                            <Link href="/about" color="inherit" underline="hover" display="block">
                                O nas
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                            Kontakt
                        </Typography>
                        <Typography variant="body2">Email: kontakt@autofix.pl</Typography>
                        <Typography variant="body2">Telefon: +48 123 456 789</Typography>
                    </Grid>
                </Grid>
                <Box textAlign="center" mt={4}>
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Autofix. Wszystkie prawa zastrzeżone.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
