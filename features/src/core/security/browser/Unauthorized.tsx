import { Typography } from "@mui/material";
import { GridHS } from "../../layout/browser/Grid";

export default function Unauthorized() {
    return (
        <GridHS container sx={{ justifyContent: "center", pt: 5 }}>
            <Typography variant="h5" color="#d32f2f">
                Unauthorized access
            </Typography>
        </GridHS>
    );
}