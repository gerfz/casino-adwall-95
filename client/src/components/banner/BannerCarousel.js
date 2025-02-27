import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Only fetch banners with pageType 'home'
        const { data } = await axios.get('/api/banners', {
          params: { pageType: 'home' }
        });
        setBanners(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load banners');
        setLoading(false);
        console.error('Error fetching banners:', err);
      }
    };

    fetchBanners();
  }, []);

  // Create and arrange banners for podium display (1 in middle, 2 on left, 3 on right)
  const getDisplayBanners = () => {
    const displayBanners = [...banners];
    
    // Add placeholder banners if needed
    while (displayBanners.length < 3) {
      displayBanners.push({
        _id: `placeholder-${displayBanners.length}`,
        isPlaceholder: true,
        position: displayBanners.length + 1,
        title: 'Coming Soon',
        welcomeBonus: 'Welcome bonus',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxODAiIGhlaWdodD0iODAiIGZpbGw9IiMyYTJmNDAiLz48dGV4dCB4PSI5MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29taW5nIFNvb248L3RleHQ+PC9zdmc+',
        playNowUrl: '#',
        rtp: '95.0%',
        payoutTime: 'Instant',
        paymentMethods: {
          bitcoin: true,
          visa: true,
          mastercard: true,
          ethereum: true
        }
      });
    }
    
    // Get top 3 banners
    const top3Banners = displayBanners.slice(0, 3);
    
    // Assign positions for podium layout (1 in middle, 2 on left, 3 on right)
    const podiumBanners = [];
    
    // Find banner with position 1 (or first banner if no position specified)
    const firstBanner = top3Banners.find(b => b.position === 1) || top3Banners[0];
    firstBanner.podiumPosition = 'first';
    podiumBanners.push(firstBanner);
    
    // Find banner with position 2 (or second banner if no position specified)
    const secondBanner = top3Banners.find(b => b.position === 2) || 
                         top3Banners.find(b => b !== firstBanner && b !== top3Banners.find(b => b.position === 3)) || 
                         top3Banners[1];
    secondBanner.podiumPosition = 'second';
    podiumBanners.push(secondBanner);
    
    // Find banner with position 3 (or third banner if no position specified)
    const thirdBanner = top3Banners.find(b => b.position === 3) || 
                        top3Banners.find(b => b !== firstBanner && b !== secondBanner) || 
                        top3Banners[2];
    thirdBanner.podiumPosition = 'third';
    podiumBanners.push(thirdBanner);
    
    return podiumBanners;
  };

  if (loading) {
    return <div className="text-center py-5">Loading banners...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  const displayBanners = getDisplayBanners();

  return (
    <section className="top-casinos-section">
      <Container fluid className="px-4">
        <h2 className="section-title text-center">CASINOS OF THE MONTH</h2>
        
        <div className="podium-container">
          {displayBanners.map((banner) => (
            <div key={banner._id} className={`podium-position ${banner.podiumPosition}`}>
              <div className={`top-casino-card ${banner.isPlaceholder ? 'placeholder' : ''}`}>
                {/* Info Icon */}
                <div className="info-icon">
                  <i className="fas fa-info-circle"></i>
                </div>
                
                {/* Casino Logo Section */}
                <div 
                  className="casino-logo-section"
                  style={{
                    backgroundColor: banner.backgroundColor || '#1a1e2c' // Use the banner's background color or default to dark blue
                  }}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="casino-logo"
                  />
                  
                </div>
                
                {/* Casino Details Section */}
                <div className="casino-details-section">
                  <div className="welcome-bonus">Welcome bonus</div>
                  <div className="bonus-amount">{banner.welcomeBonus || '100%/$1000'}</div>
                  
                  <div className="casino-metrics">
                    <div className="metric">
                      <div className="metric-label">RTP</div>
                      <div className="metric-value">{banner.rtp || '95.0%'}</div>
                    </div>
                    <div className="metric">
                      <div className="metric-label">Payout time</div>
                      <div className="metric-value">{banner.payoutTime || 'Instant'}</div>
                    </div>
                  </div>
                  
                  <Button
                    className="btn-play-now"
                    href={banner.playNowUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={banner.isPlaceholder}
                  >
                    PLAY NOW
                  </Button>
                  
                  <div className="payment-methods">
                    <div className="payment-label">Payment methods</div>
                    <div className="payment-icons">
                      {/* Bitcoin Icon */}
                      {banner.paymentMethods?.bitcoin && (
                        <svg className="payment-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#F7931A"/>
                          <path d="M16.5 10.2C16.8 8.7 15.7 7.9 14.2 7.4L14.7 5.3L13.4 5L12.9 7C12.6 6.9 12.3 6.9 12 6.8L12.5 4.8L11.2 4.5L10.7 6.6C10.4 6.5 10.2 6.5 10 6.4V6.4L8.2 6V7.4C8.2 7.4 9.2 7.4 9.1 7.4C9.7 7.5 9.8 7.9 9.8 8.2L9.2 10.6C9.3 10.6 9.3 10.6 9.3 10.6L9.2 10.6L8.4 13.8C8.3 14 8.1 14.3 7.7 14.2C7.7 14.2 6.8 14.2 6.8 14.2L6.3 15.7L8 16.1C8.3 16.2 8.6 16.3 8.8 16.3L8.3 18.5L9.6 18.8L10.1 16.7C10.4 16.8 10.7 16.9 11 17L10.5 19.1L11.8 19.4L12.3 17.2C14.4 17.6 16 17.5 16.7 15.5C17.3 13.9 16.7 13 15.5 12.4C16.4 12.2 17 11.7 16.5 10.2ZM14.2 14.4C13.8 16 11.3 15.2 10.5 15L11.2 12.2C12 12.4 14.7 12.8 14.2 14.4ZM14.6 10.2C14.2 11.6 12.1 10.9 11.4 10.7L12 8.2C12.7 8.4 15 8.7 14.6 10.2Z" fill="white"/>
                        </svg>
                      )}
                      
                      {/* Visa Icon */}
                      {banner.paymentMethods?.visa && (
                        <svg className="payment-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="white"/>
                          <path d="M9.5 15H7.5L6 9H8L9.5 15Z" fill="#1A1F71"/>
                          <path d="M13.5 9.2C13.1 9.1 12.6 9 12 9C10.3 9 9 10 9 11.5C9 12.7 10 13.3 10.8 13.7C11.5 14.1 11.8 14.3 11.8 14.6C11.8 15 11.3 15.2 10.9 15.2C10.3 15.2 9.9 15.1 9.3 14.9L9.1 14.8L8.9 16.5C9.3 16.7 10.1 16.8 10.9 16.8C12.7 16.8 14 15.8 14 14.2C14 13.3 13.4 12.6 12.3 12.1C11.6 11.8 11.2 11.5 11.2 11.2C11.2 10.9 11.5 10.6 12.2 10.6C12.7 10.6 13.1 10.7 13.4 10.8L13.6 10.9L13.8 9.3L13.5 9.2Z" fill="#1A1F71"/>
                          <path d="M18 9H16.5C16.1 9 15.8 9.1 15.6 9.5L13 15H14.8L15.2 13.9H17.3L17.5 15H19L18 9ZM15.7 12.5C15.7 12.5 16.3 10.9 16.4 10.6C16.4 10.6 16.5 10.3 16.6 10.1L16.7 10.5C16.7 10.5 17.1 12 17.2 12.5H15.7Z" fill="#1A1F71"/>
                          <path d="M6 9L4 15H5.7L7.7 9H6Z" fill="#1A1F71"/>
                        </svg>
                      )}
                      
                      {/* Mastercard Icon */}
                      {banner.paymentMethods?.mastercard && (
                        <svg className="payment-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="24" height="24" rx="4" fill="white"/>
                          <circle cx="9" cy="12" r="5" fill="#EB001B"/>
                          <circle cx="15" cy="12" r="5" fill="#F79E1B"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 15.98C13.3978 14.9988 14.2127 13.3844 14.2127 11.6566C14.2127 9.92886 13.3978 8.31446 12 7.33325C10.6022 8.31446 9.78735 9.92886 9.78735 11.6566C9.78735 13.3844 10.6022 14.9988 12 15.98Z" fill="#FF5F00"/>
                        </svg>
                      )}
                      
                      {/* Ethereum Icon */}
                      {banner.paymentMethods?.ethereum && (
                        <svg className="payment-icon" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#627EEA"/>
                          <path d="M12.3735 3V9.6525L17.9963 12.165L12.3735 3Z" fill="white" fillOpacity="0.6"/>
                          <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white"/>
                          <path d="M12.3735 16.476V20.9963L18 13.212L12.3735 16.476Z" fill="white" fillOpacity="0.6"/>
                          <path d="M12.3735 20.9963V16.4753L6.75 13.212L12.3735 20.9963Z" fill="white"/>
                          <path d="M12.3735 15.4298L17.9963 12.165L12.3735 9.6543V15.4298Z" fill="white" fillOpacity="0.2"/>
                          <path d="M6.75 12.165L12.3735 15.4298V9.6543L6.75 12.165Z" fill="white" fillOpacity="0.6"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BannerCarousel;
