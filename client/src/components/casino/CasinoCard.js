import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const CasinoCard = ({ casino }) => {
  // Function to render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="casino-card py-2 px-3 mb-3">
      <Row className="align-items-center justify-content-between g-0">
        {/* Logo Column */}
        <Col xs={12} md={1} className="text-center text-md-start mb-2 mb-md-0">
          <div className="casino-logo-container">
            <img 
              src={casino.logo} 
              alt={casino.name} 
              className="casino-logo" 
            />
          </div>
          <h5 className="casino-name mt-2 d-md-none">{casino.name}</h5>
          <div className="casino-rating d-md-none mt-1">
            {renderStarRating(casino.rating)}
          </div>
        </Col>
        
        {/* Divider Column */}
        <Col xs={12} md="auto" className="d-none d-md-flex justify-content-center px-0">
          <div className="vertical-divider"></div>
        </Col>
        
        {/* Name and Rating Column */}
        <Col xs={12} md={2} className="d-none d-md-block">
          <div>
            <h5 className="casino-name">{casino.name}</h5>
            <div className="casino-rating">
              {renderStarRating(casino.rating)}
            </div>
          </div>
        </Col>
        
        <Col xs={6} md={2} className="text-center">
          <div className="casino-bonus">{casino.depositBonus}</div>
          <div className="casino-spins">
            {casino.freeSpins > 0 && `${casino.freeSpins} Free Spins`}
          </div>
        </Col>
        
        <Col xs={6} md={2} className="text-center">
          <div className="casino-spins">
            {casino.signupSpins > 0 ? `${casino.signupSpins} Signup Spins` : '-'}
          </div>
        </Col>
        
        <Col xs={12} md={2} className="mt-2 mt-md-0">
          <div className="casino-features">
            {casino.features && casino.features.map((feature, index) => (
              <div key={index} className="casino-feature">
                <i className="fas fa-check"></i> {feature}
              </div>
            ))}
          </div>
        </Col>
        
        <Col xs={12} md={2} className="text-end mt-2 mt-md-0 button-column">
          <Button 
            className="btn-claim" 
            href={casino.playNowUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            CLAIM BONUS
          </Button>
          <div className="mt-1 text-center">
            <i className="fas fa-info-circle"></i> T&Cs Apply
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CasinoCard;
