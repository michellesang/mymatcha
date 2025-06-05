import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AuthPage from './components/auth/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import MatchaCollection from './components/MatchaCollection';
import AddMatchaForm from './components/AddMatchaForm';
import { MatchaProvider } from "./context/MatchaContext.jsx";
import Dashboard from './components/Dashboard';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <MatchaProvider>
                    <div className="app">
                        <Navbar />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/auth" element={<AuthPage />} />

                            {/* Protected Routes */}
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/collection"
                                element={
                                    <ProtectedRoute>
                                        <MatchaCollection />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/add"
                                element={
                                    <ProtectedRoute>
                                        <AddMatchaForm />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </MatchaProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;