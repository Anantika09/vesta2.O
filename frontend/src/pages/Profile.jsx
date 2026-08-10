import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  //const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    skinTone: 'medium',
    bodyType: 'hourglass',
    gender: 'female',
    bio: '',
    stylePreferences: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Load user data from localStorage or API
      const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        skinTone: savedProfile.skinTone || user.profile?.skinTone || 'medium',
        bodyType: savedProfile.bodyType || user.profile?.bodyType || 'hourglass',
        gender: savedProfile.gender || user.profile?.gender || 'female',
        bio: savedProfile.bio || '',
        stylePreferences: savedProfile.stylePreferences || ['casual', 'elegant']
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleStyleToggle = (style) => {
    const updated = profileData.stylePreferences.includes(style)
      ? profileData.stylePreferences.filter(s => s !== style)
      : [...profileData.stylePreferences, style];
    setProfileData({ ...profileData, stylePreferences: updated });
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Update in backend if needed
      // await api.updateProfile(profileData);
      
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const styleOptions = [
    { id: 'casual', label: 'Casual', icon: '👕' },
    { id: 'elegant', label: 'Elegant', icon: '👗' },
    { id: 'bohemian', label: 'Bohemian', icon: '🌿' },
    { id: 'streetwear', label: 'Streetwear', icon: '👟' },
    { id: 'minimalist', label: 'Minimalist', icon: '⚪' },
    { id: 'vintage', label: 'Vintage', icon: '🕰️' },
    { id: 'glam', label: 'Glam', icon: '✨' },
    { id: 'athleisure', label: 'Athleisure', icon: '🏃' }
  ];

  const skinTones = [
    { id: 'fair', label: 'Fair', color: '#FDE7D9' },
    { id: 'medium', label: 'Medium', color: '#E0B586' },
    { id: 'olive', label: 'Olive', color: '#C9A87C' },
    { id: 'dark', label: 'Dark', color: '#8B5A2B' }
  ];

  const bodyTypes = [
    { id: 'hourglass', label: 'Hourglass', description: 'Balanced bust and hips with defined waist' },
    { id: 'pear', label: 'Pear', description: 'Hips wider than bust' },
    { id: 'apple', label: 'Apple', description: 'Broader shoulders and bust' },
    { id: 'rectangle', label: 'Rectangle', description: 'Straight silhouette' },
    { id: 'inverted-triangle', label: 'Inverted Triangle', description: 'Broad shoulders, narrow hips' }
  ];

  const genderOptions = [
    { id: 'female', label: 'Female', icon: '👩' },
    { id: 'male', label: 'Male', icon: '👨' },
    { id: 'non-binary', label: 'Non-binary', icon: '🌟' },
    { id: 'prefer-not-to-say', label: 'Prefer not to say', icon: '🤍' }
  ];

  return (
    <div className="profile-page">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal style preferences and account settings" 
      />

      <div className="profile-container">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-initial">
                {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="profile-header-info">
              <h2>{profileData.name || 'User'}</h2>
              <p className="profile-email">{profileData.email}</p>
              <button 
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {message && (
            <div className="profile-message success">
              {message}
            </div>
          )}

          <div className="profile-content">
            {/* Basic Information */}
            <div className="profile-section">
              <h3>Basic Information</h3>
              <div className="info-grid">
                <div className="info-field">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  ) : (
                    <p>{profileData.name || 'Not set'}</p>
                  )}
                </div>
                <div className="info-field">
                  <label>Email</label>
                  <p className="disabled-field">{profileData.email}</p>
                </div>
                <div className="info-field">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your style journey..."
                      rows="3"
                    />
                  ) : (
                    <p>{profileData.bio || 'No bio added yet'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Style Preferences */}
            <div className="profile-section">
              <h3>Style Preferences</h3>
              <p className="section-hint">Select styles that match your aesthetic</p>
              <div className="style-grid">
                {styleOptions.map(style => (
                  <div
                    key={style.id}
                    className={`style-chip ${profileData.stylePreferences.includes(style.id) ? 'active' : ''}`}
                    onClick={() => isEditing && handleStyleToggle(style.id)}
                    style={{ cursor: isEditing ? 'pointer' : 'default' }}
                  >
                    <span className="style-icon">{style.icon}</span>
                    <span className="style-label">{style.label}</span>
                    {profileData.stylePreferences.includes(style.id) && (
                      <span className="style-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="profile-section">
              <h3>Physical Attributes</h3>
              <p className="section-hint">Helps us personalize recommendations</p>
              <div className="attributes-grid">
                <div className="attribute-field">
                  <label>Skin Tone</label>
                  {isEditing ? (
                    <div className="skin-tone-options">
                      {skinTones.map(tone => (
                        <button
                          key={tone.id}
                          className={`tone-option ${profileData.skinTone === tone.id ? 'active' : ''}`}
                          onClick={() => setProfileData({...profileData, skinTone: tone.id})}
                          style={{ backgroundColor: tone.color }}
                        >
                          <span>{tone.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p>{skinTones.find(t => t.id === profileData.skinTone)?.label || 'Not set'}</p>
                  )}
                </div>

                <div className="attribute-field">
                  <label>Body Type</label>
                  {isEditing ? (
                    <select
                      name="bodyType"
                      value={profileData.bodyType}
                      onChange={handleChange}
                    >
                      {bodyTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  ) : (
                    <p>{bodyTypes.find(t => t.id === profileData.bodyType)?.label || 'Not set'}</p>
                  )}
                </div>

                <div className="attribute-field">
                  <label>Gender</label>
                  {isEditing ? (
                    <div className="gender-options">
                      {genderOptions.map(gender => (
                        <button
                          key={gender.id}
                          className={`gender-option ${profileData.gender === gender.id ? 'active' : ''}`}
                          onClick={() => setProfileData({...profileData, gender: gender.id})}
                        >
                          <span className="gender-icon">{gender.icon}</span>
                          <span>{gender.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p>{genderOptions.find(g => g.id === profileData.gender)?.label || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="profile-section">
              <h3>Account Statistics</h3>
              <div className="stats-row">
                <div className="stat-box">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Items in Wardrobe</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Looks Created</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Trips Planned</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Style Notes</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="profile-actions">
                <button 
                  className="save-btn" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;