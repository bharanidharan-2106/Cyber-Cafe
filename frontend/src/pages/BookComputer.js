import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

const BookComputer = () => {
  const [terminals, setTerminals] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [duration, setDuration] = useState('1');
  const [requestDetails, setRequestDetails] = useState({
    type: '',
    requirements: ''
  });

  useEffect(() => {
    loadTerminals();
    // Check for expired sessions every second
    const interval = setInterval(() => {
      checkExpiredSessions();
      setTerminals(prevTerminals => [...prevTerminals]); // Force re-render to update times
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadTerminals = () => {
    const savedTerminals = localStorage.getItem('terminals');
    if (savedTerminals) {
      const allTerminals = JSON.parse(savedTerminals);
      // Check for expired sessions when loading
      const currentTime = new Date().getTime();
      const updatedTerminals = allTerminals.map(terminal => {
        if (terminal.status === 'occupied' && terminal.sessionEndTime) {
          const endTime = new Date(terminal.sessionEndTime).getTime();
          if (currentTime >= endTime) {
            return {
              ...terminal,
              status: 'available',
              currentUser: null,
              sessionStart: null,
              sessionEndTime: null,
              sessionDuration: null
            };
          }
        }
        return terminal;
      });
      setTerminals(updatedTerminals);
      localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
    }
  };

  // Function to check and release expired terminals
  const checkExpiredSessions = () => {
    const currentTime = new Date().getTime();
    let hasChanges = false;

    const updatedTerminals = terminals.map(terminal => {
      if (terminal.status === 'occupied' && terminal.sessionEndTime) {
        const endTime = new Date(terminal.sessionEndTime).getTime();
        if (currentTime >= endTime) {
          hasChanges = true;
          // Add to history before releasing
          const history = JSON.parse(localStorage.getItem('userHistory') || '[]');
          history.push({
            username: terminal.currentUser,
            service: `${terminal.name} (${terminal.type})`,
            duration: terminal.sessionDuration,
            price: terminal.price * parseInt(terminal.sessionDuration),
            date: new Date(terminal.sessionStart).toISOString().split('T')[0],
            endTime: new Date(terminal.sessionEndTime).toISOString()
          });
          localStorage.setItem('userHistory', JSON.stringify(history));
          
          // Release the terminal
          return {
            ...terminal,
            status: 'available',
            currentUser: null,
            sessionStart: null,
            sessionEndTime: null,
            sessionDuration: null
          };
        }
      }
      return terminal;
    });

    if (hasChanges) {
      setTerminals(updatedTerminals);
      localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
    }
  };

  // Function to get remaining time for a terminal
  const getRemainingTime = (terminal) => {
    if (terminal.status === 'occupied' && terminal.sessionEndTime) {
      const endTime = new Date(terminal.sessionEndTime).getTime();
      const currentTime = new Date().getTime();
      const remainingMs = endTime - currentTime;
      
      if (remainingMs > 0) {
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
      return "00:00:00";
    }
    return null;
  };

  const getNextAvailableTime = (terminal) => {
    if (terminal.status === 'occupied' && terminal.sessionEndTime) {
      const endTime = new Date(terminal.sessionEndTime);
      return endTime.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return null;
  };

  const handleRequest = (e) => {
    e.preventDefault();
    
    const username = JSON.parse(localStorage.getItem('userDetails'))?.username;
    
    // Check if user already has an active session
    const userHasActiveSession = terminals.some(t => 
      t.status === 'occupied' && t.currentUser === username
    );

    if (userHasActiveSession) {
      alert('You already have an active session. Please complete your current session before booking another terminal.');
      return;
    }

    // Find available terminal of requested type
    const availableTerminal = terminals.find(t => 
      t.type === requestDetails.type && t.status === 'available'
    );

    if (availableTerminal) {
      // Calculate session end time
      const startTime = new Date();
      const durationInHours = parseFloat(duration);
      const endTime = new Date(startTime.getTime() + (durationInHours * 60 * 60 * 1000));

      // Calculate price (half price for 30 minutes)
      const price = durationInHours === 0.5 ? availableTerminal.price / 2 : availableTerminal.price * durationInHours;

      const updatedTerminals = terminals.map(t => 
        t.id === availableTerminal.id ? {
          ...t,
          status: 'occupied',
          currentUser: username,
          sessionStart: startTime.toISOString(),
          sessionEndTime: endTime.toISOString(),
          sessionDuration: `${duration} hour(s)`
        } : t
      );

      // Update terminals in localStorage and state
      localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
      setTerminals(updatedTerminals);

      // Add to user history
      const bookingDetails = {
        username: username,
        service: `${availableTerminal.name} (${availableTerminal.type})`,
        duration: `${duration} hour(s)`,
        price: price,
        date: startTime.toISOString().split('T')[0],
        endTime: endTime.toISOString()
      };

      const history = JSON.parse(localStorage.getItem('userHistory') || '[]');
      history.push(bookingDetails);
      localStorage.setItem('userHistory', JSON.stringify(history));

      // Update user's last activity
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = registeredUsers.map(user => 
        user.username === username 
          ? { ...user, lastActivity: new Date().toISOString() }
          : user
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

      alert(`Terminal allocated successfully!\nAllocated system: ${availableTerminal.name}\nYour bill is: ₹${price}\nYour session will end at: ${endTime.toLocaleTimeString()}`);
      setRequestDetails({ type: '', requirements: '' });
      setDuration('1');
    } else {
      // Find occupied terminals of the requested type to show their availability time
      const occupiedTerminals = terminals.filter(t => 
        t.type === requestDetails.type && t.status === 'occupied'
      );

      if (occupiedTerminals.length > 0) {
        const nextAvailableTime = occupiedTerminals.map(t => 
          new Date(t.sessionEndTime).toLocaleTimeString()
        ).join(', ');
        alert(`No terminals available of the selected type.\nNext available time(s): ${nextAvailableTime}`);
      } else {
        alert('No terminals available of the selected type.');
      }
    }
  };

  return (
    <div className="layout-container">
      <main className="main-content">
        <div className="booking-container">
          <h2>Book a Terminal</h2>

          <div className="request-terminal">
            <form onSubmit={handleRequest} className="request-form">
              <div className="form-group">
                <label>Terminal Type</label>
                <select 
                  value={requestDetails.type}
                  onChange={(e) => setRequestDetails(prev => ({ ...prev, type: e.target.value }))}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="gaming">Gaming</option>
                  <option value="academic">Academic</option>
                  <option value="browsing">Browsing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                >
                  <option value="0.5">30 Minutes</option>
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                </select>
              </div>
              <div className="form-group">
                <label>Additional Requirements (Optional)</label>
                <textarea 
                  value={requestDetails.requirements}
                  onChange={(e) => setRequestDetails(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Any specific requirements?"
                />
              </div>
              <button type="submit" className="submit-button">
                Request Terminal
              </button>
            </form>
          </div>

          <div className="terminals-status">
            <h3>Available Terminals</h3>
            <div className="terminals-grid">
              {terminals.map(terminal => (
                <div key={terminal.id} className="terminal-card">
                  <div className="terminal-header">
                    <h4>{terminal.name}</h4>
                    <span className={`status ${terminal.status}`}>
                      {terminal.status === 'occupied' ? 'Occupied' : 'Available'}
                    </span>
                  </div>
                  <p className="terminal-type">{terminal.type}</p>
                  <p className="terminal-specs">{terminal.specs}</p>
                  <p className="terminal-price">₹{terminal.price} per hour</p>
                  {terminal.status === 'occupied' && (
                    <div className="terminal-timing">
                      <p className="remaining-time">
                        <i className="fas fa-clock"></i> Remaining Time: {getRemainingTime(terminal)}
                      </p>
                      <p className="next-available">
                        <i className="fas fa-calendar-check"></i> Available at: {getNextAvailableTime(terminal)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookComputer;
