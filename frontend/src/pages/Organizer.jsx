import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import './Organizer.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('general');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editNote, setEditNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('vestaNotes') || '[]');
    setNotes(savedNotes);
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('vestaNotes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        content: newNote,
        category: newNoteCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const updateNote = () => {
    if (editNote && editNote.content.trim()) {
      const updatedNotes = notes.map(note =>
        note.id === editNote.id
          ? { ...note, content: editNote.content, updatedAt: new Date().toISOString() }
          : note
      );
      setNotes(updatedNotes);
      setEditNote(null);
    }
  };

  const deleteNote = (id) => {
    if (window.confirm('Delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const toggleCategory = (id) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, category: note.category === 'shopping' ? 'general' : 'shopping', updatedAt: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const shoppingCount = notes.filter(n => n.category === 'shopping').length;
  const generalCount = notes.filter(n => n.category === 'general').length;

  if (loading) {
    return (
      <div className="notes-page">
        <PageHeader title="Style Notes" subtitle="Save your style ideas, shopping lists, and reminders" />
        <div className="container"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <PageHeader 
        title="Style Notes" 
        subtitle="Capture your style inspiration, shopping lists, and fashion ideas" 
      />

      <div className="notes-container">
        {/* Search & Stats Row */}
        <div className="search-stats-row">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="stats-badge">
            <span className="stats-count">{notes.length}</span>
            <span className="stats-label">notes</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          <button
            className={`pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <span className="pill-icon">📋</span>
            <span>All Notes</span>
            <span className="pill-count">{notes.length}</span>
          </button>
          <button
            className={`pill ${selectedCategory === 'shopping' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('shopping')}
          >
            <span className="pill-icon">🛍️</span>
            <span>Shopping</span>
            <span className="pill-count">{shoppingCount}</span>
          </button>
          <button
            className={`pill ${selectedCategory === 'general' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('general')}
          >
            <span className="pill-icon">💡</span>
            <span>Ideas</span>
            <span className="pill-count">{generalCount}</span>
          </button>
        </div>

        {/* Add Note Card */}
        <div className="add-note-card">
          <div className="add-note-header">
            <span className="add-note-icon">✍️</span>
            <h3>Create New Note</h3>
          </div>
          <div className="category-toggle">
            <button
              className={`toggle-btn ${newNoteCategory === 'shopping' ? 'active' : ''}`}
              onClick={() => setNewNoteCategory('shopping')}
            >
              🛍️ Shopping List
            </button>
            <button
              className={`toggle-btn ${newNoteCategory === 'general' ? 'active' : ''}`}
              onClick={() => setNewNoteCategory('general')}
            >
              💡 Style Idea
            </button>
          </div>
          <textarea
            placeholder={newNoteCategory === 'shopping' ? "What do you need to buy? (e.g., Black heels for wedding)" : "What's your style idea? (e.g., Try monochrome with white blazer)"}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows="4"
          />
          <button className="add-btn" onClick={addNote}>
            <span>Add Note</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>

        {/* Notes Grid */}
        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">
                <span>📝</span>
                <span>✨</span>
                <span>💭</span>
              </div>
              <h3>Your notes will appear here</h3>
              <p>Start capturing your style ideas and shopping lists</p>
              <button className="empty-btn" onClick={() => document.querySelector('textarea').focus()}>
                Create your first note
              </button>
            </div>
          ) : (
            filteredNotes.map((note, index) => (
              <div key={note.id} className={`note-card ${note.category}`} style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="note-card-header">
                  <div className="note-category-badge">
                    <span className="badge-icon">{note.category === 'shopping' ? '🛍️' : '💡'}</span>
                    <span className="badge-text">{note.category === 'shopping' ? 'Shopping' : 'Idea'}</span>
                  </div>
                  <button className="category-switch" onClick={() => toggleCategory(note.id)} title="Switch category">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-4.5L15 4H9L8.5 7H4v2h16V7z" />
                      <rect x="4" y="9" width="16" height="10" rx="1" />
                    </svg>
                  </button>
                </div>
                <div className="note-content">
                  <p>{note.content}</p>
                </div>
                <div className="note-card-footer">
                  <div className="note-meta">
                    <span className="note-date">{formatDate(note.updatedAt)}</span>
                  </div>
                  <div className="note-actions">
                    <button className="action-edit" onClick={() => setEditNote(note)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                        <path d="M4 20h16" />
                      </svg>
                    </button>
                    <button className="action-delete" onClick={() => deleteNote(note.id)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editNote && (
        <div className="modal-overlay" onClick={() => setEditNote(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-icon">✏️</div>
              <h3>Edit Note</h3>
              <button className="close-modal" onClick={() => setEditNote(null)}>×</button>
            </div>
            <div className="modal-body">
              <textarea
                value={editNote.content}
                onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                rows="6"
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setEditNote(null)}>Cancel</button>
              <button className="save-btn" onClick={updateNote}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;