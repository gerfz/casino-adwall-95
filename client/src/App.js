import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import AllCasinosPage from './pages/AllCasinosPage';
import NewCasinosPage from './pages/NewCasinosPage';
import TopPaymentPage from './pages/TopPaymentPage';
import GiveawayPage from './pages/GiveawayPage';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CasinoList from './pages/admin/CasinoList';
import CasinoEdit from './pages/admin/CasinoEdit';
import BannerList from './pages/admin/BannerList';
import BannerEdit from './pages/admin/BannerEdit';
import GiveawayList from './pages/admin/GiveawayList';
import GiveawayEdit from './pages/admin/GiveawayEdit';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/casinos" element={<AllCasinosPage />} />
            <Route path="/new-casinos" element={<NewCasinosPage />} />
            <Route path="/top-payment" element={<TopPaymentPage />} />
            <Route path="/giveaways" element={<GiveawayPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/casinos" element={<CasinoList />} />
            <Route path="/admin/casinos/create" element={<CasinoEdit />} />
            <Route path="/admin/casinos/:id" element={<CasinoEdit />} />
            <Route path="/admin/banners" element={<BannerList />} />
            <Route path="/admin/banners/create" element={<BannerEdit />} />
            <Route path="/admin/banners/:id" element={<BannerEdit />} />
            <Route path="/admin/giveaways" element={<GiveawayList />} />
            <Route path="/admin/giveaways/create" element={<GiveawayEdit />} />
            <Route path="/admin/giveaways/:id" element={<GiveawayEdit />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
