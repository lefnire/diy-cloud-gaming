import React from "react";
import { logError } from "lib/errors";
import Alert from "@mui/material/Alert"
import Typography from "@mui/material/Typography";

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    logError(error, errorInfo);
  }

  render() {
    // @ts-ignore
    const children = this.props.children
    return this.state.hasError ? (
      <Alert color="error">
        <Typography variant="h3">Sorry there was a problem loading this page</Typography>
      </Alert>
    ) : (
      children
    );
  }
}
