import React, { Component } from 'react';

function DefaultErrorFallback({ error, errorInfo }) {
    return (
      <div>
        <h2>Something went wrong!</h2>
        <p>{error?.message}</p>
        <details>
          {errorInfo?.componentStack}
        </details>
      </div>
    );
  }

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { ErrorFallback = DefaultErrorFallback } = this.props;

    if (hasError) {
      return <ErrorFallback error={error} errorInfo={errorInfo} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
