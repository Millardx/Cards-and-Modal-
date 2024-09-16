import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './styles/Card.scss';

const Card = ({ isModalOpen, toggleModal }) => {
  const [cardData, setCardData] = useState({
    image: '',
    areaName: '',
    weather: '',
    weatherIcon: '',
    quickfacts: '',
  });

  // Fetch the card data from the server when the component is mounted
  useEffect(() => {
    axios
      .get('http://localhost:5000/card') // Fetch card data from the server
      .then((response) => {
        const data = response.data;
        //console.log('Card data fetched:', data);
        setCardData({
          image: data.image ? `http://localhost:5000${data.image}` : '',
          areaName: data.areaName || 'Unknown Area',
          weather: data.weather || 'Unknown Weather',
          weatherIcon: data.weatherIcon ? `http://localhost:5000${data.weatherIcon}` : '',
          quickfacts: data.quickfacts || 'No quick facts available',
        });
      })
      .catch((error) => {
        console.error('Error fetching card data:', error);
      });
  }, []);

  const { image, areaName, weather, weatherIcon, quickfacts } = cardData;

  return (
    <div className="card">
      {/* Card Image */}
      <div className="card__image">
        {image ? (
          <img src={image} alt={areaName} />
        ) : (
          <p>No Image Available</p>
        )}
      </div>

      <div className="card__content">
        {/* Card Header */}
        <div className="card__header">
          <h2>{areaName}</h2>
          <div className="card__weather">
            {weatherIcon ? (
              <img src={weatherIcon} alt="Weather Icon" />
            ) : (
              <p>No icon</p>
            )}
            <span>{weather}</span>
          </div>
        </div>

        <hr className="card__divider" />

        {/* Quick Facts */}
        <div className="card__quick-facts">
          <span>Quick Facts</span>
          <div className="card__icons">
            <i className="material-icons">place</i>
            <i className="material-icons">straighten</i>
            <i className="material-icons">volume_up</i>
          </div>
        </div>

        {/* Quick Facts Details */}
        <div className="card__details">
          <p>{quickfacts}</p>
        </div>

        {/* Footer */}
        <div className="card__footer">
          <a href="#" onClick={toggleModal}>View Full Details</a>
        </div>
      </div>

      {/* Modal component */}
      {isModalOpen && (
        <Modal
          onClose={toggleModal}
          
        />
      )}
    </div>
  );
};

export default Card;
