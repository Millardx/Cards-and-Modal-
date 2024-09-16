import React, { useEffect, useState } from 'react';
import axios from 'axios'; // To fetch data from the server
import Slider from 'react-slick'; // Import React Slick for the carousel
import './styles/Modal.scss';

const Modal = ({ onClose}) => {
  const [modalData, setModalData] = useState({
    images: [],
    title: '', 
    description: '',
  });

  // Fetch the modal data from the server when the component is mounted
  useEffect(() => {
    axios
      .get('http://localhost:5000/modal') // Fetch modal data from the server
      .then((response) => {
        const data = response.data;
        //console.log('Modal data fetched and displayed:', data);
        setModalData({
          images: data.modalImages.map(
            (image) => `http://localhost:5000/${image}`
          ),
          title: data.modalTitle || 'No title available.',
          description: data.modalDescription || 'No description available.',
        });
      })
      .catch((error) => {
        console.error('Error fetching modal data:', error);
      });
  }, []); // Empty dependency array ensures it runs once when modal opens

  // Slick settings for the carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <br />

        {/* Image Carousel */}
        {modalData.images.length > 0 ? (
          <Slider {...settings}>
            {modalData.images.map((image, index) => (
              <div key={index} className="carousel-slide">
                <img
                  src={image || '/path/to/fallback-image.jpg'}
                  alt="" //{`Image ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <p>No images available.</p>
        )}

        {/* Modal Text Content */}
        <div className="modal__content">
        <h2>{modalData.title || 'No Title Available'}</h2>   {/* Display title */}
        <p>{modalData.description || 'No Description Available'}</p>   {/* Display description */}
      </div>
    </div>
    </div>
  );
};

export default Modal;
