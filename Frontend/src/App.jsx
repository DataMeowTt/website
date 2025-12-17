import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import './styles/global.css';

import Centers from "./pages/Centers";
import News from './pages/News';

import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
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
          <Route path="/centers" element={<Centers />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;