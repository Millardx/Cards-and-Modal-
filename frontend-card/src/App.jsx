import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.scss';
import Card from './components/Card';
import AreaButton from './components/Areabutton';
import AdminPage from './components/AdminPage';

const App = () => {
  const [cardData, setCardData] = useState({
    areaName: '',
    weather: '',
    quickfacts: '',
    image: '',
    weatherIcon: '',
  });

  const [selectedArea, setSelectedArea] = useState(null); // Selected area state
  const [isCardVisible, setIsCardVisible] = useState(false); // Card visibility state
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility here

  const navigate = useNavigate();

  // Fetch card data when the app loads
  useEffect(() => {
    axios.get('http://localhost:5000/card')
      .then(response => {
        if (response.data) {
          setCardData(response.data);
        }
      })
      .catch(error => console.error('Error fetching card data:', error));
  }, []);

  // Function to toggle visibility of the card
  const handleAreaClick = (area) => {
    if (selectedArea === area && isCardVisible) {
      setIsCardVisible(false);  // Hide the card if it's visible and clicked again
    } else {
      setSelectedArea(area);
      setIsCardVisible(true);   // Show the card for the clicked area
    }
  };

  const handleAdminSave = (data) => {
    setCardData(data); // Update the card data when saved in AdminPage
  };

  const handleEditClick = () => {
    navigate('/admin'); // Navigate to the AdminPage
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle the modal
  };

  return (
    <div className="app">
      {/* Routes for different pages */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="map">
                <h1>Interactive Map</h1>
                <AreaButton label="Fish Pond" onClick={() => handleAreaClick('Fish Pond')} />
              </div>
              <button onClick={handleEditClick} className="edit-button">
                Admin Page
              </button>
              {isCardVisible && selectedArea && (
                <Card
                  image={cardData.image}
                  areaName={cardData.areaName}
                  weather={cardData.weather}
                  quickfacts={cardData.quickfacts}
                  weatherIcon={cardData.weatherIcon} 
                  isModalOpen={isModalOpen} // Pass modal state to the Card
                  toggleModal={toggleModal} // Pass the function to toggle the modal
                />
              )}
            </>
          }
        />
        {/* Route for Admin Page */}
        <Route
          path="/admin"
          element={<AdminPage cardData={cardData} onSave={handleAdminSave} />}
        />
      </Routes>
    </div>
  );
};

// Wrapping the App with Router
const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
