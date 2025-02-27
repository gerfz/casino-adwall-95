import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import CasinoCard from '../components/casino/CasinoCard';
import PageBanner from '../components/banner/PageBanner';

const AllCasinosPage = () => {
  const [casinos, setCasinos] = useState([]);
  const [filteredCasinos, setFilteredCasinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageBanner, setPageBanner] = useState(null);

  // Fetch page banner
  useEffect(() => {
    const fetchPageBanner = async () => {
      try {
        const { data } = await axios.get('/api/banners', {
          params: { pageType: 'allCasinos' }
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

  // Fetch all casinos from API
  useEffect(() => {
    const fetchCasinos = async () => {
      try {
        // Use the API's sorting capability by not specifying a category
        // This will return all casinos sorted by their creation date
        const { data } = await axios.get('/api/casinos');
        setCasinos(data);
        setFilteredCasinos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load casinos');
        setLoading(false);
        console.error('Error fetching casinos:', err);
      }
    };

    fetchCasinos();
  }, []);

  // Handle search input change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCasinos(casinos);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      setFilteredCasinos(
        casinos.filter(
          casino => 
            casino.name.toLowerCase().includes(searchTermLower) ||
            casino.features.some(feature => 
              feature.toLowerCase().includes(searchTermLower)
            )
        )
      );
    }
  }, [searchTerm, casinos]);

  return (
    <section className="all-casinos-section py-4">
      <h1 className="text-center mb-4">All Casinos</h1>
      
      {pageBanner && <PageBanner banner={pageBanner} />}
      
      <Row className="mb-4">
        <Col md={6} className="mx-auto">
          <Form.Group>
            <Form.Label>Search Casinos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by name or feature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      
      {loading ? (
        <div className="text-center py-5">Loading casinos...</div>
      ) : error ? (
        <div className="text-center py-5 text-danger">{error}</div>
      ) : filteredCasinos.length === 0 ? (
        <div className="text-center py-5">No casinos found matching your search</div>
      ) : (
        <>
          <p className="text-center mb-4">
            Showing {filteredCasinos.length} of {casinos.length} casinos
          </p>
          
          {filteredCasinos.map(casino => (
            <CasinoCard key={casino._id} casino={casino} />
          ))}
        </>
      )}
    </section>
  );
};

export default AllCasinosPage;
