import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import BannerCarousel from '../components/banner/BannerCarousel';
import CasinoCard from '../components/casino/CasinoCard';

const HomePage = () => {
  const [casinos, setCasinos] = useState([]);
  const [filteredCasinos, setFilteredCasinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Featured');

  // Fetch casinos from API based on filter
  const fetchCasinos = async (category = 'Featured') => {
    try {
      setLoading(true);
      let url = '/api/casinos';
      
      // Add category parameter if not "All"
      if (category !== 'All') {
        url += `?category=${category}`;
      }
      
      const { data } = await axios.get(url);
      
      if (category === 'All') {
        setCasinos(data);
        setFilteredCasinos(data);
      } else {
        setCasinos(prevCasinos => {
          // Update the casinos array with the new data for this category
          const updatedCasinos = [...prevCasinos];
          
          // Remove casinos that are in this category
          const filteredCasinos = updatedCasinos.filter(
            casino => !casino.categories.includes(category)
          );
          
          // Add the new casinos for this category
          return [...filteredCasinos, ...data];
        });
        setFilteredCasinos(data);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load casinos');
      setLoading(false);
      console.error('Error fetching casinos:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCasinos('Featured');
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    fetchCasinos(selectedFilter);
  };

  return (
    <>
      <BannerCarousel />
      
      <section className="casino-list-section py-4">
        <h2 className="text-center mb-4">BEST ONLINE CASINOS</h2>
        
        {loading ? (
          <div className="text-center py-5">Loading casinos...</div>
        ) : error ? (
          <div className="text-center py-5 text-danger">{error}</div>
        ) : filteredCasinos.length === 0 ? (
          <div className="text-center py-5">No casinos found for this category</div>
        ) : (
          filteredCasinos.map(casino => (
            <CasinoCard key={casino._id} casino={casino} />
          ))
        )}
      </section>
    </>
  );
};

export default HomePage;
