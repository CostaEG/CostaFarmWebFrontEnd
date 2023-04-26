import { Alert, Box } from "@mui/material";
import React from "react";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any)     {
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        //logError(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box flex={1}>
                    <Alert severity="error">
                        Oops, something went wrong
                    </Alert>                    
                </Box>
            );
        }

        return this.props.children;
    }
}