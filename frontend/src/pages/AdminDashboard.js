import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showAddTerminalForm, setShowAddTerminalForm] = useState(false);
  const [showEditTerminalForm, setShowEditTerminalForm] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [terminals, setTerminals] = useState([]);
  const [users, setUsers] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [revenue, setRevenue] = useState({ today: 0, monthly: 0 });
  const [editingTerminal, setEditingTerminal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  
  useEffect(() => {
    // Check admin authentication
    const userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userDetails);
    if (user.role !== 'admin') {
      navigate('/user-dashboard');
      return;
    }

    // Load data from localStorage
    loadData();

    // Set up interval to refresh data
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const loadData = () => {
    // Load terminals
    const savedTerminals = localStorage.getItem('terminals');
    if (savedTerminals) {
      const allTerminals = JSON.parse(savedTerminals);
      // Check for expired sessions
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

    // Load registered users and sort by last activity (newest first)
    const registeredUsers = localStorage.getItem('registeredUsers');
    if (registeredUsers) {
      const parsedUsers = JSON.parse(registeredUsers);
      // Sort users by registration date (newest first)
      const sortedUsers = parsedUsers.sort((a, b) => {
        const dateA = new Date(a.registrationDate || a.dateOfBirth || 0);
        const dateB = new Date(b.registrationDate || b.dateOfBirth || 0);
        return dateB - dateA; // This ensures newest users appear first
      });
      setUsers(sortedUsers);
    }

    // Load user history
    const savedHistory = localStorage.getItem('userHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setUserHistory(history);
      
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().getMonth();
      
      const todayRevenue = history
        .filter(h => h.date.startsWith(today))
        .reduce((sum, h) => sum + h.price, 0);
        
      const monthlyRevenue = history
        .filter(h => new Date(h.date).getMonth() === thisMonth)
        .reduce((sum, h) => sum + h.price, 0);
        
      setRevenue({ today: todayRevenue, monthly: monthlyRevenue });
    }
  };

  const handleAddTerminal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTerminal = {
      id: terminals.length + 1,
      type: formData.get('type'),
      name: formData.get('name'),
      specs: formData.get('specs'),
      status: 'available',
      price: Number(formData.get('price')),
      currentUser: null
    };
    const updatedTerminals = [...terminals, newTerminal];
    setTerminals(updatedTerminals);
    localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
    setShowAddTerminalForm(false);
  };

  const handleEditTerminal = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedTerminals = terminals.map(terminal => 
      terminal.id === editingTerminal.id ? {
        ...terminal,
        type: formData.get('type'),
        name: formData.get('name'),
        specs: formData.get('specs'),
        price: Number(formData.get('price'))
      } : terminal
    );
    setTerminals(updatedTerminals);
    localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
    setShowEditTerminalForm(false);
    setEditingTerminal(null);
  };

  const handleDeleteTerminal = (id) => {
    // Filter out the terminal to be deleted
    const updatedTerminals = terminals.filter(terminal => terminal.id !== id);
    
    // Update localStorage with the new terminals array
    localStorage.setItem('terminals', JSON.stringify(updatedTerminals));
    
    // Update the state with the new terminals array
    setTerminals(updatedTerminals);
  };

  const startEdit = (terminal) => {
    setEditingTerminal(terminal);
    setShowEditTerminalForm(true);
  };

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

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.includes(searchQuery)
  );

  const getUserHistory = (username) => {
    return userHistory.filter(history => history.username === username);
  };

  const toggleUserDetails = (username) => {
    setExpandedUser(expandedUser === username ? null : username);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteUserModal(true);
  };

  const confirmDeleteUser = () => {
    // Get all storage items that might contain user data
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userHistory = JSON.parse(localStorage.getItem('userHistory') || '[]');
    const terminals = JSON.parse(localStorage.getItem('terminals') || '[]');

    // Remove user from registeredUsers
    const updatedUsers = registeredUsers.filter(u => u.username !== userToDelete.username);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    // Remove user's history
    const updatedHistory = userHistory.filter(h => h.username !== userToDelete.username);
    localStorage.setItem('userHistory', JSON.stringify(updatedHistory));

    // Free up any terminals occupied by the user
    const updatedTerminals = terminals.map(terminal => {
      if (terminal.currentUser === userToDelete.username) {
        return {
          ...terminal,
          status: 'available',
          currentUser: null,
          sessionStart: null,
          sessionEndTime: null,
          sessionDuration: null
        };
      }
      return terminal;
    });
    localStorage.setItem('terminals', JSON.stringify(updatedTerminals));

    // Update state
    setUsers(updatedUsers);
    setUserHistory(updatedHistory);
    setTerminals(updatedTerminals);
    setShowDeleteUserModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="layout-container">
      <main className="main-content">
        <div className="admin-dashboard">
          <div className="dashboard-header">
      <h2>Admin Dashboard</h2>
          </div>
          
          {/* Quick Stats */}
          <div className="admin-stats">
            <div className="stat-card">
              <i className="fas fa-desktop"></i>
              <h3>Total Terminals</h3>
              <p className="stat-number">{terminals.length}</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-users"></i>
              <h3>Active Users</h3>
              <p className="stat-number">
                {terminals.filter(t => t.status === 'occupied').length}
              </p>
            </div>
            <div className="stat-card">
              <i className="fas fa-rupee-sign"></i>
              <h3>Today's Revenue</h3>
              <p className="stat-number">₹{revenue.today}</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-chart-line"></i>
              <h3>Monthly Revenue</h3>
              <p className="stat-number">₹{revenue.monthly}</p>
            </div>
          </div>

          {/* Terminal Management */}
          <div className="admin-section">
            <div className="section-header">
              <h3>Terminal Management</h3>
              <button 
                className="add-button"
                onClick={() => setShowAddTerminalForm(true)}
              >
                <i className="fas fa-plus"></i> Add Terminal
              </button>
            </div>

            {showAddTerminalForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Add New Terminal</h3>
                  <form onSubmit={handleAddTerminal}>
                    <div className="form-group">
                      <label>Terminal Type</label>
                      <select name="type" required>
                        <option value="gaming">Gaming</option>
                        <option value="academic">Academic</option>
                        <option value="browsing">Browsing</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Terminal Name</label>
                      <input type="text" name="name" required placeholder="e.g., Gaming Terminal 1" />
                    </div>
                    <div className="form-group">
                      <label>Specifications</label>
                      <textarea name="specs" required placeholder="Enter terminal specifications"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Price per Hour (₹)</label>
                      <input type="number" name="price" required min="1" placeholder="e.g., 50" />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="confirm-button">Add Terminal</button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => setShowAddTerminalForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showEditTerminalForm && editingTerminal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Edit Terminal</h3>
                  <form onSubmit={handleEditTerminal}>
                    <div className="form-group">
                      <label>Terminal Type</label>
                      <select name="type" required defaultValue={editingTerminal.type}>
                        <option value="gaming">Gaming</option>
                        <option value="academic">Academic</option>
                        <option value="browsing">Browsing</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Terminal Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        defaultValue={editingTerminal.name}
                        placeholder="e.g., Gaming Terminal 1" 
                      />
                    </div>
                    <div className="form-group">
                      <label>Specifications</label>
                      <textarea 
                        name="specs" 
                        required 
                        defaultValue={editingTerminal.specs}
                        placeholder="Enter terminal specifications"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label>Price per Hour (₹)</label>
                      <input 
                        type="number" 
                        name="price" 
                        required 
                        min="1" 
                        defaultValue={editingTerminal.price}
                        placeholder="e.g., 50" 
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="confirm-button">Save Changes</button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => {
                          setShowEditTerminalForm(false);
                          setEditingTerminal(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="terminals-grid">
              {terminals.map(terminal => (
                <div key={terminal.id} className="terminal-card">
                  <div className="terminal-header">
                    <h4>{terminal.name}</h4>
                    <span className={`status ${terminal.status}`}>{terminal.status}</span>
                  </div>
                  <p className="terminal-type">{terminal.type}</p>
                  <p className="terminal-specs">{terminal.specs}</p>
                  <p className="terminal-price">₹{terminal.price} per hour</p>
                  {terminal.currentUser && (
                    <p className="current-user">
                      <i className="fas fa-user"></i> {terminal.currentUser}
                    </p>
                  )}
                  <div className="terminal-actions">
                    <button 
                      className="edit-button"
                      onClick={() => startEdit(terminal)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteTerminal(terminal.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="admin-section">
            <h3>Active Sessions</h3>
            <div className="table-container scrollable">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Terminal</th>
                    <th>User</th>
                    <th>Start Time</th>
                    <th>Duration</th>
                    <th>Remaining Time</th>
                  </tr>
                </thead>
                <tbody>
                  {terminals
                    .filter(t => t.status === 'occupied')
                    .map(terminal => (
                      <tr key={terminal.id}>
                        <td>{terminal.name}</td>
                        <td>{terminal.currentUser}</td>
                        <td>{new Date(terminal.sessionStart).toLocaleString('en-IN', { 
                          timeZone: 'Asia/Kolkata',
                          hour12: true,
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}</td>
                        <td>{terminal.sessionDuration}</td>
                        <td className={getRemainingTime(terminal) === "00:00:00" ? "time-expired" : "time-remaining"}>
                          {getRemainingTime(terminal)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Combined Users and History Section */}
          <div className="admin-section">
            <h3>Registered Users</h3>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users by username, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="table-container scrollable">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <React.Fragment key={index}>
                      <tr className={expandedUser === user.username ? 'expanded' : ''}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.phoneNumber}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="view-details-button"
                              onClick={() => toggleUserDetails(user.username)}
                            >
                              {expandedUser === user.username ? 'Hide Details' : 'View Details'}
                            </button>
                            {user.role !== 'admin' && (
                              <button 
                                className="delete-button"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <i className="fas fa-trash"></i> Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {expandedUser === user.username && (
                        <tr className="details-row">
                          <td colSpan="4">
                            <div className="user-details">
                              <div className="profile-section">
                                <h4>Profile Details</h4>
                                <p><strong>Date of Birth:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
                                <p><strong>Address:</strong> {user.address}</p>
                              </div>
                              <div className="history-section">
                                <h4>Usage History</h4>
                                <div className="history-table-container">
                                  <table className="history-table">
                                    <thead>
                                      <tr>
                                        <th>Service</th>
                                        <th>Duration</th>
                                        <th>Price</th>
                                        <th>Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {getUserHistory(user.username).map((history, idx) => (
                                        <tr key={idx}>
                                          <td>{history.service}</td>
                                          <td>{history.duration}</td>
                                          <td>₹{history.price}</td>
                                          <td>{history.date}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete User Confirmation Modal */}
      {showDeleteUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete User</h3>
            <p>Are you sure you want to delete user "{userToDelete?.username}"?</p>
            <p>This action cannot be undone. The user will need to create a new account to access the system.</p>
            <div className="form-actions">
              <button 
                className="delete-button"
                onClick={confirmDeleteUser}
              >
                Delete User
              </button>
              <button 
                className="cancel-button"
                onClick={() => {
                  setShowDeleteUserModal(false);
                  setUserToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
