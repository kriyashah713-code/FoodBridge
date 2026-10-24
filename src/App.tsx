import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// 13 Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { DonateFood } from './pages/DonateFood';
import { AvailableFood } from './pages/AvailableFood';
import { FoodDetails } from './pages/FoodDetails';
import { PickupRequestPage } from './pages/PickupRequestPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { DonationHistory } from './pages/DonationHistory';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* 1. Home */}
              <Route path="/" element={<Home />} />

              {/* 2. Login */}
              <Route path="/login" element={<Login />} />

              {/* 3. Sign Up */}
              <Route path="/signup" element={<SignUp />} />

              {/* 4. Donate Food (Protected: Donors & Admins) */}
              <Route
                path="/donate-food"
                element={
                  <ProtectedRoute allowedRoles={['donor', 'admin']}>
                    <DonateFood />
                  </ProtectedRoute>
                }
              />

              {/* 5. Available Food */}
              <Route path="/available-food" element={<AvailableFood />} />

              {/* 6. Food Details */}
              <Route path="/food/:id" element={<FoodDetails />} />

              {/* 7. Pickup Request (Protected: NGOs & Admins) */}
              <Route
                path="/pickup-request/:id"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <PickupRequestPage />
                  </ProtectedRoute>
                }
              />

              {/* 8. Donor Dashboard (Protected: Donors & Admins) */}
              <Route
                path="/donor-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['donor', 'admin']}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 9. NGO Dashboard (Protected: NGOs & Admins) */}
              <Route
                path="/ngo-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <NGODashboard />
                  </ProtectedRoute>
                }
              />

              {/* 10. Admin Dashboard (Protected: Admins only) */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 11. Donation History */}
              <Route path="/donation-history" element={<DonationHistory />} />

              {/* 12. About Us */}
              <Route path="/about" element={<AboutUs />} />

              {/* 13. Contact Us */}
              <Route path="/contact" element={<ContactUs />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
