import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import './styles/global.css';

import UserProfile from "./pages/UserProfile";
import Service from "./pages/Service";
import Competition from "./pages/Competition"
import Contact from "./pages/Contact";
import Policy from './pages/Policy';
import News from './pages/News';
import Centers from "./pages/Centers";
import BookingSchedule from './pages/Booking';
import PaymentPage from './pages/Payment';
import ResetPasswordPage from "./pages/ResetPassword";

import WeatherDisplay from './components/WeatherDisplay'; 
import Scroll from './components/Scroll'; 

import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Scroll />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/service" element={<Service />} />
          <Route path="/competition" element={<Competition />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/news" element={<News />} />
          <Route path="/centers" element={<Centers />} />
          <Route path="/booking" element={<BookingSchedule />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/reset-password/:token/:userId" element={<ResetPasswordPage />} />
        </Routes>
        <WeatherDisplay />
      </Router>
    </AuthProvider>
  );
}

export default App;