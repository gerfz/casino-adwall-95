import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CasinoCard from '../components/casino/CasinoCard';
import PageBanner from '../components/banner/PageBanner';

const NewCasinosPage = () => {
  const [casinos, setCasinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageBanner, setPageBanner] = useState(null);

  // Fetch page banner
  useEffect(() => {
    const fetchPageBanner = async () => {
      try {
        const { data } = await axios.get('/api/banners', {
          params: { pageType: 'newCasinos' }
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

  // Fetch new casinos from API
  useEffect(() => {
    const fetchNewCasinos = async () => {
      try {
        const { data } = await axios.get('/api/casinos', {
          params: { category: 'New' }
        });
        setCasinos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load new casinos');
        setLoading(false);
        console.error('Error fetching new casinos:', err);
      }
    };

    fetchNewCasinos();
  }, []);

  return (
    <section className="new-casinos-section py-4">
      <h1 className="text-center mb-4">New Casinos</h1>
      
      {pageBanner && <PageBanner banner={pageBanner} />}
      
      <p className="text-center mb-4">
        Discover the latest and most exciting new online casinos. Be among the first to
        experience innovative features, fresh bonuses, and cutting-edge gaming platforms.
      </p>
      
      {loading ? (
        <div className="text-center py-5">Loading new casinos...</div>
      ) : error ? (
        <div className="text-center py-5 text-danger">{error}</div>
      ) : casinos.length === 0 ? (
        <div className="text-center py-5">No new casinos available at the moment</div>
      ) : (
        casinos.map(casino => (
          <CasinoCard key={casino._id} casino={casino} />
        ))
      )}
    </section>
  );
};

export default NewCasinosPage;
