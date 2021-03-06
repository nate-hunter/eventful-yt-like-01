import React from "react";
import { ReactQueryConfigProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider } from "../context/auth-context";
import GlobalStyle from "../styles/GlobalStyle";
import { darkTheme } from "../styles/theme";
import SnackbarProvider from 'react-simple-snackbar';

const config = {
  queries: {
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.status === 404) return false;
      else if (failureCount < 2) return true;
      else return false;
    }
  }
}

function AppProviders({ children }) {
  return (
    <ReactQueryConfigProvider config={config}>
      <Router>
        <AuthProvider>
          <SnackbarProvider>
            <ThemeProvider theme={darkTheme}>
              <GlobalStyle />
              <ReactQueryDevtools />
              {children}
            </ThemeProvider>
          </SnackbarProvider>
        </AuthProvider>
      </Router>
    </ReactQueryConfigProvider>
  );
}

export default AppProviders;
