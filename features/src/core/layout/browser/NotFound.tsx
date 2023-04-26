import { Typography } from "@mui/material";
import { GridHS } from "./Grid";

export default function NotFound() {
    return (
        <GridHS container sx={{ justifyContent: "center", pt: 5 }}>
            <Typography variant="h5">
                Not found
            </Typography>
        </GridHS>
    );
}