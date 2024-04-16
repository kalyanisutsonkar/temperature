import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
    const [city, setCity] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch(city); // Pass the search query to the parent component
      setCity(''); // Clear the input field after submission
    };
  
    return (
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search weather in your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </li>
        </ul>
      </nav>
    );
  };
  

export default Navbar