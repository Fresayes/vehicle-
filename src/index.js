import React from "react";
import { createRoot } from "react-dom/client";
import VehicleDataDashboard from "./VehicleDataDashboard";
import "./styles.css";

// Error boundary component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '5px',
              border: 'none',
              marginTop: '10px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <VehicleDataDashboard />
    </ErrorBoundary>
  </React.StrictMode>
);
