import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CasinoCard from '../components/casino/CasinoCard';
import PageBanner from '../components/banner/PageBanner';

const TopPaymentPage = () => {
  const [casinos, setCasinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageBanner, setPageBanner] = useState(null);

  // Fetch page banner
  useEffect(() => {
    const fetchPageBanner = async () => {
      try {
        const { data } = await axios.get('/api/banners', {
          params: { pageType: 'topPayment' }
        });
        
        if (data && data.length > 0) {
          setPageBanner(data[0]);
        }
      } catch (err) {
        console.error('Error fetching page banner:', err);
      }
    };

    fetchPageBanner();
  }, []);

  // Fetch Top P&P casinos from API
  useEffect(() => {
    const fetchTopPnPCasinos = async () => {
      try {
        const { data } = await axios.get('/api/casinos', {
          params: { category: 'Top P&P' }
        });
        setCasinos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load Top P&P casinos');
        setLoading(false);
        console.error('Error fetching Top P&P casinos:', err);
      }
    };

    fetchTopPnPCasinos();
  }, []);

  return (
    <section className="top-payment-section py-4">
      <h1 className="text-center mb-4">Top P&P Casinos</h1>
      
      {pageBanner && <PageBanner banner={pageBanner} />}
      
      {loading ? (
        <div className="text-center py-5">Loading Top P&P casinos...</div>
      ) : error ? (
        <div className="text-center py-5 text-danger">{error}</div>
      ) : casinos.length === 0 ? (
        <div className="text-center py-5">No Top P&P casinos available at the moment</div>
      ) : (
        casinos.map(casino => (
          <CasinoCard key={casino._id} casino={casino} />
        ))
      )}
    </section>
  );
};

export default TopPaymentPage;
