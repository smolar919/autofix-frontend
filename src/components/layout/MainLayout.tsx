import React from "react";
import { Box } from "@mui/material";
import TopAppBar from "./TopAppBar.tsx";
import { Outlet } from "react-router-dom";
import Footer from "./Footer.tsx";

const MainLayout: React.FC = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100vw",
                height: "100vh",
                overflowX: "hidden",
            }}
        >
            <TopAppBar />

            <Box sx={{ flexGrow: 1, width: "100%", px: 0 }}>
                <Outlet />
            </Box>

            <Footer />
        </Box>
    );
};

export default MainLayout;

