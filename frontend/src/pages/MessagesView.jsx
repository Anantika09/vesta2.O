import React, { useState, useEffect } from 'react';

const MessagesView = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading messages...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '100px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Contact Messages ({messages.length})</h1>
      {messages.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        messages.map(msg => (
          <div key={msg._id} style={{
            border: '1px solid #eee',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '16px',
            background: msg.status === 'unread' ? '#fff5f0' : 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>{msg.name}</strong>
              <span style={{ color: '#666', fontSize: '12px' }}>
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <a href={`mailto:${msg.email}`} style={{ color: '#CD2C58' }}>{msg.email}</a>
            </div>
            <p style={{ marginTop: '10px', lineHeight: '1.5' }}>{msg.message}</p>
            {msg.status === 'unread' && (
              <span style={{
                display: 'inline-block',
                background: '#CD2C58',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                marginTop: '10px'
              }}>New</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesView;