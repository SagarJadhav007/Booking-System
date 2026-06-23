import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import SeatsPage from "../pages/booking/SeatsPage";
import PaymentPage from "../pages/booking/PaymentPage";
import EventsPage from "../pages/events/EventsPage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";

import ProtectedRoute from "../components/ProtectedRoute";

import BookingsPage from "../pages/booking/BookingsPage";
import DashboardPage from "@/pages/dashboard/DashboardPage.tsx";
import BookingSuccessPage from "@/pages/booking/BookingSuccessPage.tsx";
import AdminRoute from "@/components/AdminRoute.tsx";
import CreateEventPage from "@/pages/admin/CreateEventPage.tsx";

const AppRoutes = () => {
    return (
            <Routes>

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>

                            <AdminDashboardPage />

                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/create-event"
                    element={
                        <AdminRoute>
                            <CreateEventPage />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/booking-success"
                    element={
                        <ProtectedRoute>
                            <BookingSuccessPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/"
                    element={<Navigate to="/events" replace />}
                />

                <Route
                    path="/bookings"
                    element={
                        <ProtectedRoute>
                            <BookingsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <EventsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/events/:eventId/seats"
                    element={
                        <ProtectedRoute>
                            <SeatsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute>
                            <PaymentPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

    );
};

export default AppRoutes;