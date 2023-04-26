import { Box, CircularProgress } from "@mui/material";
import { GridHS } from "./Grid";

interface LoadingProps {
    floating?: boolean
}

export default function Loading({ floating }: LoadingProps) {
    if(floating) {
        return (
            <Box sx={{position: "relative", width: "100%"}}>
                <CircularProgress
                    size={60}
                    sx={{
                        position: 'absolute',
                        top: '50px',
                        left: 'calc(50% - 30px)'
                    }}
                />
            </Box>
        );
    }

    return (
        <GridHS container sx={{ justifyContent: "center", pt: 5 }}>
            <CircularProgress />
        </GridHS>
    );
}