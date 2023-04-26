import React from "react";
import { Panel, PanelHeader } from "./Panel";
import { Alert } from "native-base";
import { useLocation } from "react-router-native";

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    return (
        <ErrorBoundaryHanlder key={location.pathname}>
            {children}
        </ErrorBoundaryHanlder>
    );
}

interface ErrorBoundaryHanlderProps {
    children: React.ReactNode;
}

interface ErrorBoundaryHanlderState {
    hasError: boolean;
}

class ErrorBoundaryHanlder extends React.Component<ErrorBoundaryHanlderProps, ErrorBoundaryHanlderState> {
    constructor(props: ErrorBoundaryHanlderProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        //logError(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Panel>
                    <PanelHeader title="Error" />
                    <Alert status="error">
                        Oops, something went wrong
                    </Alert>
                </Panel>
            );
        }

        return this.props.children;
    }
}