import MyButton from '@/ui-components/MyButton';
import React, { Component } from 'react';

function DefaultErrorFallback({ error, errorInfo, onReset }) {
    return (
      <div>
        <h2>Something went wrong!</h2>
        <p>{error?.message}</p>
        <details>{errorInfo?.componentStack}</details>

        <MyButton onClick={onReset}>Try Again</MyButton>
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
  
    handleReset = () => {
      this.setState({ hasError: false, error: null, errorInfo: null });
      if (this.props.onReset) {
        this.props.onReset();
      }
    };
  
    render() {
      const { hasError, error, errorInfo } = this.state;
      const  ErrorFallback  = this.props.ErrorFallback || DefaultErrorFallback;
  
      if (hasError) {
        return <ErrorFallback error={error} errorInfo={errorInfo} onReset={this.handleReset} />;
      }
  
      return this.props.children;
    }
  }
  
  export default ErrorBoundary;
  

