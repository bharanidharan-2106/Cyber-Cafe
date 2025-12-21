import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user details from localStorage
    const details = localStorage.getItem('userDetails');
    if (!details) {
      navigate('/login');
      return;
    }

    const parsedDetails = JSON.parse(details);
    setUserDetails(parsedDetails);
    setEditedDetails(parsedDetails);
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Update both local state and localStorage
    localStorage.setItem('userDetails', JSON.stringify(editedDetails));
    
    // Also update in registeredUsers if it exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = registeredUsers.map(user => 
      user.username === editedDetails.username ? editedDetails : user
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    setUserDetails(editedDetails);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDetails(userDetails);
    setIsEditing(false);
  };

  if (!userDetails) {
    return (
      <div className="layout-container">
        <main className="main-content">
          <div className="profile-container">
            <p className="no-data">No profile data available. Please register or login.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Special handling for admin profile
  if (userDetails.role === 'admin') {
    return (
      <div className="layout-container">
        <main className="main-content">
          <div className="profile-container">
            <div className="profile-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
            <h2>Admin Profile</h2>

            <div className="profile-details">
              <div className="profile-field">
                <i className="fas fa-envelope"></i>
                <div>
                  <label>Email</label>
                  <p>{userDetails.email}</p>
                </div>
              </div>

              <div className="profile-field">
                <i className="fas fa-user-cog"></i>
                <div>
                  <label>Role</label>
                  <p>Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="layout-container">
      <main className="main-content">
        <div className="profile-container">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <h2>{userDetails.username}'s Profile</h2>

          <div className="profile-details">
            <div className="profile-field">
              <i className="fas fa-envelope"></i>
              <div>
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedDetails.email || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{userDetails.email || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="profile-field">
              <i className="fas fa-phone"></i>
              <div>
                <label>Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editedDetails.phoneNumber || ''}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                  />
                ) : (
                  <p>{userDetails.phoneNumber || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="profile-field">
              <i className="fas fa-calendar"></i>
              <div>
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editedDetails.dateOfBirth || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{userDetails.dateOfBirth || 'Not provided'}</p>
                )}
              </div>
            </div>

            <div className="profile-field">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <label>Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editedDetails.address || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{userDetails.address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="save-button">
                  <i className="fas fa-save"></i> Save Changes
                </button>
                <button onClick={handleCancel} className="cancel-button">
                  <i className="fas fa-times"></i> Cancel
                </button>
              </>
            ) : (
              <button onClick={handleEdit} className="edit-profile-button">
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;