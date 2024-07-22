import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Showtime from "./pages/Showtime";
import Book from "./pages/Book";
import Navbar from "./components/Boilerplate/Navbar";
import Footer from "./components/Boilerplate/Footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserManagement from "./pages/UserManagement";
import PageNotFound from "./pages/PageNotFound";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/Language/i18n";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Rooms from "./pages/Rooms";
import "./index.css"; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <div className="pageContainer">
              <Navbar />
              <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
              <main className="contentWrap">
                <Routes>
                  <Route index element={<Navigate replace to="home" />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/movies" element={<Movies />} />
                  <Route path="/movies/:movieId" element={<MovieDetails />} />
                  <Route path="/showtimes" element={<Showtime />} />
                  <Route path="/showtimes/:showtimeId" element={<Book />} />
                  <Route path="/profile/:userId/history" element={<UserProfile />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </Router>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
