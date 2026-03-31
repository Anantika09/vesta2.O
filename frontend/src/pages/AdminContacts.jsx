import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminContacts.css';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setContacts(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/admin/contacts/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchContacts();
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  if (loading) return <div className="admin-loading">Loading messages...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-contacts">
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <p>{contacts.length} total messages</p>
      </div>
      
      <div className="contacts-list">
        {contacts.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          contacts.map(contact => (
            <div key={contact._id || contact.id} className={`contact-item ${contact.status === 'unread' ? 'unread' : ''}`}>
              <div className="contact-header">
                <div className="contact-info">
                  <strong>{contact.name}</strong>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
                <div className="contact-date">
                  {new Date(contact.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="contact-message">
                <p>{contact.message}</p>
              </div>
              {contact.status === 'unread' && (
                <button className="mark-read-btn" onClick={() => markAsRead(contact._id || contact.id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminContacts;