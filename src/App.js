import AuthProvider from './contexts/auth';
import RoutesApp from './Routes/routes';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material';
import { theme } from './components/Theme';
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <ToastContainer autoClose={3000} />
          <RoutesApp />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
