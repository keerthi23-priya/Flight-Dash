import React, { useState } from "react";
import "./index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [users, setUsers] = useState([
    { username: "admin", password: "admin123", name: "Admin User" },
  ]);

  // Flight data stored in state
  const [flights] = useState([
    {
      id: 1,
      startTime: "08:30",
      totalDuration: "2h 15m",
      pilotName: "Captain Sarah Johnson",
      from: "New York",
      to: "Los Angeles",
      price: 299,
      availableSeats: 45,
    },
    {
      id: 2,
      startTime: "10:45",
      totalDuration: "1h 45m",
      pilotName: "Captain Michael Chen",
      from: "Los Angeles",
      to: "Chicago",
      price: 199,
      availableSeats: 32,
    },
    {
      id: 3,
      startTime: "14:20",
      totalDuration: "3h 30m",
      pilotName: "Captain Emily Rodriguez",
      from: "Chicago",
      to: "Miami",
      price: 349,
      availableSeats: 28,
    },
    {
      id: 4,
      startTime: "16:15",
      totalDuration: "2h 45m",
      pilotName: "Captain David Thompson",
      from: "Miami",
      to: "Seattle",
      price: 449,
      availableSeats: 15,
    },
    {
      id: 5,
      startTime: "19:30",
      totalDuration: "4h 10m",
      pilotName: "Captain Lisa Wang",
      from: "Seattle",
      to: "Boston",
      price: 399,
      availableSeats: 22,
    },
    {
      id: 6,
      startTime: "22:00",
      totalDuration: "1h 55m",
      pilotName: "Captain Robert Davis",
      from: "Boston",
      to: "New York",
      price: 179,
      availableSeats: 38,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("flights"); // "flights" or "bookings"

  // Get unique locations for filter dropdowns
  const locations = [
    ...new Set(
      flights
        .map((flight) => flight.from)
        .concat(flights.map((flight) => flight.to))
    ),
  ];
  const fromLocations = [...new Set(flights.map((flight) => flight.from))];
  const toLocations = [...new Set(flights.map((flight) => flight.to))];

  // Filter flights based on search and filters
  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.pilotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrom = fromFilter === "" || flight.from === fromFilter;
    const matchesTo = toFilter === "" || flight.to === toFilter;
    const matchesLocation =
      locationFilter === "" ||
      flight.from === locationFilter ||
      flight.to === locationFilter;
    return matchesSearch && matchesFrom && matchesTo && matchesLocation;
  });

  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleSignup = (username, password, name) => {
    if (users.find((u) => u.username === username)) {
      alert("Username already exists!");
      return;
    }
    const newUser = { username, password, name };
    setUsers([...users, newUser]);
    setIsLoggedIn(true);
    setCurrentUser(newUser);
    setShowSignup(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSearchTerm("");
    setLocationFilter("");
    setFromFilter("");
    setToFilter("");
    setShowBookingForm(false);
    setSelectedFlight(null);
    setActiveTab("flights");
  };

  const handleBookFlight = (flight) => {
    setSelectedFlight(flight);
    setShowBookingForm(true);
  };

  const handleConfirmBooking = (passengerName, passengerEmail) => {
    if (!selectedFlight) return;

    const newBooking = {
      id: Date.now(),
      flightId: selectedFlight.id,
      flight: selectedFlight,
      passengerName,
      passengerEmail,
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString(),
      status: "Confirmed",
    };

    setBookings([...bookings, newBooking]);

    console.log("bookings", bookings);
    setShowBookingForm(false);
    setSelectedFlight(null);
    alert("Booking confirmed successfully!");
  };

  const handleCancelBooking = (bookingId) => {
    setBookings(bookings.filter((booking) => booking.id !== bookingId));
    alert("Booking cancelled successfully!");
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>SkyView</h1>
          {showSignup ? (
            <SignupForm
              onSignup={handleSignup}
              onSwitchToLogin={() => setShowSignup(false)}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToSignup={() => setShowSignup(true)}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">SkyView Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {currentUser.name}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === "flights" ? "active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          Flights
        </button>
        <button
          className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings ({bookings.length})
        </button>
      </div>

      {activeTab === "flights" && (
        <>
          <div className="search-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by pilot name, from, or to..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filters">
            <div className="filter-box">
              <select
                value={fromFilter}
                onChange={(e) => setFromFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All From Locations</option>
                {fromLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-box">
              <select
                value={toFilter}
                onChange={(e) => setToFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All To Locations</option>
                {toLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
         </div>
          <div className="table-container">
            <table className="flights-table">
              <thead>
                <tr>
                  <th>Flight Start Time</th>
                  <th>Total Duration</th>
                  <th>Pilot Name</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Price</th>
                  <th>Available Seats</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.startTime}</td>
                    <td>{flight.totalDuration}</td>
                    <td>{flight.pilotName}</td>
                    <td>{flight.from}</td>
                    <td>{flight.to}</td>
                    <td>${flight.price}</td>
                    <td>{flight.availableSeats}</td>
                    <td>
                      <button
                        onClick={() => handleBookFlight(flight)}
                        className="book-btn"
                        disabled={flight.availableSeats === 0}
                      >
                        {flight.availableSeats === 0 ? "Full" : "Book"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredFlights.length === 0 && (
              <div className="no-results">
                <p>No flights found matching your search criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "bookings" && (
        <div className="table-container">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="no-results">
              <p>
                No bookings found. Book a flight to see your reservations here.
              </p>
            </div>
          ) : (
            <table className="flights-table">
              <thead>
                <tr>
                  <th>Booking Date</th>
                  <th>Flight</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Departure Time</th>
                  <th>Passenger</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.bookingDate}</td>
                    <td>Flight #{booking.flight.id}</td>
                    <td>{booking.flight.from}</td>
                    <td>{booking.flight.to}</td>
                    <td>{booking.flight.startTime}</td>
                    <td>{booking.passengerName}</td>
                    <td>
                      <span
                        className={`status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}ffer
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showBookingForm && selectedFlight && (
        <BookingForm
          flight={selectedFlight}
          onConfirm={handleConfirmBooking}
          onCancel={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}

// Login Form Component
function LoginForm({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="auth-input"
      />
      <button type="submit" className="auth-button">
        Login
      </button>
      <p className="auth-switch">
        Don't have an account?{" "}
        <button type="button" onClick={onSwitchToSignup} className="switch-btn">
          Sign up
        </button>
      </p>
    </form>
  );
}

// Signup Form Component
function SignupForm({ onSignup, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(username, password, name, "user details");
    onSignup(username, password, name);
  };

  const updateUserNameChange = (event) => {
    setUsername(event.target.value);
  };

  const updatePasswordChange = () => {
    setPassword(event.target.value);
  };

  const updatenameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Full Name"
        // value={name}
        onChange={updatenameChange}
        // required
        className="auth-input"
      />
      <input
        type="text"
        placeholder="Username"
        // value={username}
        onChange={updateUserNameChange}
        required
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        // value={password}
        onChange={updatePasswordChange}
        required
        className="auth-input"
      />
      <button type="submit" className="auth-button">
        Sign Up
      </button>
      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin} className="switch-btn">
          Login
        </button>
      </p>
    </form>
  );
}

// Booking Form Component
function BookingForm({ flight, onConfirm, onCancel }) {
  const [passengerName, setPassengerName] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passengerName.trim() && passengerEmail.trim()) {
      onConfirm(passengerName, passengerEmail);
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="booking-overlay">
      <div className="booking-modal">
        <h2>Book Flight</h2>
        <div className="flight-summary">
          <p>
            <strong>Flight:</strong> #{flight.id}
          </p>
          <p>
            <strong>From:</strong> {flight.from}
          </p>
          <p>
            <strong>To:</strong> {flight.to}
          </p>
          <p>
            <strong>Departure:</strong> {flight.startTime}
          </p>
          <p>
            <strong>Duration:</strong> {flight.totalDuration}
          </p>
          <p>
            <strong>Price:</strong> ${flight.price}
          </p>
          <p>
            <strong>Available Seats:</strong> {flight.availableSeats}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          <input
            type="text"
            placeholder="Passenger Name"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="email"
            placeholder="Passenger Email"
            value={passengerEmail}
            onChange={(e) => setPassengerEmail(e.target.value)}
            required
            className="auth-input"
          />
          <div className="booking-actions">
            <button type="submit" className="auth-button">
              Confirm Booking
            </button>
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

