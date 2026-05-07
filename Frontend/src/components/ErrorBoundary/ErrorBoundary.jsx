import { Component } from "react";
import ErrorPage from "../../pages/Error.jsx";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "" };
  }

  componentDidCatch() {
    // Intentionally no console logging (assignment requirement)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title="App crashed"
          message={
            this.state.message ||
            "The application ran into an unexpected error."
          }
        />
      );
    }

    return this.props.children;
  }
}

