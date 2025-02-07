import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallbackUI from "./ErrorBoundaryFallbackUI";
const ErrorBoundaryWrapper = ({ children }) => {
  return (
    <ErrorBoundary fallback={<ErrorBoundaryFallbackUI />}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
