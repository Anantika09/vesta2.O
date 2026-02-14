import React, { useState, useEffect } from 'react';
import './Event.css';

const sampleEvents = [
  {
    id: 1,
    name: "Friend's Wedding",
    type: "wedding",
    date: "2024-03-15",
    time: "afternoon",
    dressCode: "semi-formal",
    weather: "warm",
    budget: "medium",
    style: "romantic",
    status: "upcoming",
    outfits: [
      {
        id: 1,
        name: "Floral Midi Dress",
        image: "https://images.unsplash.com/photo-1566977744263-79e677bb4c57?auto=format&fit=crop&w=400",
        confidence: 92,
        items: ["Dress", "Wedges", "Clutch", "Pearl Earrings"]
      },
      {
        id: 2,
        name: "Pastel Suit Set",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400",
        confidence: 88,
        items: ["Blazer", "Pants", "Heels", "Statement Necklace"]
      }
    ]
  },
  {
    id: 2,
    name: "Job Interview",
    type: "interview",
    date: "2024-03-10",
    time: "morning",
    dressCode: "business-casual",
    weather: "cool",
    budget: "low",
    style: "classic",
    status: "upcoming",
    outfits: [
      {
        id: 1,
        name: "Professional Blazer Set",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400",
        items: ["Blazer", "White Blouse", "Trousers", "Loafers"]
      }
    ]
  },
  {
    id: 3,
    name: "Birthday Party",
    type: "party",
    date: "2024-02-20",
    time: "night",
    dressCode: "smart-casual",
    weather: "cool",
    budget: "medium",
    style: "modern",
    status: "past",
    outfits: [
      {
        id: 1,
        name: "Sequin Mini Dress",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400",
        items: ["Dress", "Heels", "Clutch", "Bold Earrings"]
      }
    ]
  }
];

const Event = () => {
  const [events, setEvents] = useState([...sampleEvents]);
  const [form, setForm] = useState({
    eventName: '',
    eventType: '',
    eventDate: '',
    eventTime: '',
    dressCode: '',
    weather: '',
    budget: '',
    stylePreference: ''
  });

  // Helpers
  const getEventTypeLabel = (type) => type.charAt(0).toUpperCase() + type.slice(1);
  const getTimeLabel = (time) => time.charAt(0).toUpperCase() + time.slice(1);
  const getWeatherLabel = (weather) => weather.charAt(0).toUpperCase() + weather.slice(1);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const planEventLook = () => {
    if (!form.eventName || !form.eventType || !form.eventDate || !form.eventTime || !form.dressCode) {
      alert('Please fill all required fields');
      return;
    }
    const newEvent = {
      id: Date.now(),
      name: form.eventName,
      type: form.eventType,
      date: form.eventDate,
      time: form.eventTime,
      dressCode: form.dressCode,
      weather: form.weather || 'warm',
      budget: form.budget || 'medium',
      style: form.stylePreference || 'modern',
      status: 'upcoming',
      outfits: [] // You can call generateOutfitsForEvent here if needed
    };
    setEvents([newEvent, ...events]);
    setForm({
      eventName: '',
      eventType: '',
      eventDate: '',
      eventTime: '',
      dressCode: '',
      weather: '',
      budget: '',
      stylePreference: ''
    });
  };

  const upcomingEvents = events.filter(e => e.status === 'upcoming');
  const pastEvents = events.filter(e => e.status === 'past');

  return (
    <main className="events-page">
      <div className="page-header-events">
        <h1 className="hero-title">Event <span className="gradient-text">Styling</span></h1>
        <p className="page-subtitle">Get perfect outfit recommendations for every occasion in your calendar</p>
      </div>

      <section className="event-planner">
        <div className="planner-header">
          <h2>Plan Your Event Look</h2>
          <p>Tell us about your event and get AI-powered styling recommendations</p>
        </div>

        <div className="planner-form">
          <div className="form-group-events">
            <label htmlFor="eventName">Event Name</label>
            <input type="text" id="eventName" value={form.eventName} onChange={handleInputChange} className="form-control-events" placeholder="e.g., Friend's Wedding"/>
          </div>

          <div className="form-group-events">
            <label htmlFor="eventType">Event Type</label>
            <select id="eventType" value={form.eventType} onChange={handleInputChange} className="form-control-events">
              <option value="">Select Event Type</option>
              <option value="wedding">Wedding</option>
              <option value="party">Party/Night Out</option>
              <option value="interview">Job Interview</option>
              <option value="office">Office Event</option>
              <option value="date">Date Night</option>
              <option value="festival">Festival/Concert</option>
              <option value="formal">Formal Dinner</option>
              <option value="casual">Casual Gathering</option>
              <option value="sports">Sports Event</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group-events">
            <label htmlFor="eventDate">Event Date</label>
            <input type="date" id="eventDate" value={form.eventDate} onChange={handleInputChange} className="form-control-events"/>
          </div>

          <div className="form-group-events">
            <label htmlFor="eventTime">Event Time</label>
            <select id="eventTime" value={form.eventTime} onChange={handleInputChange} className="form-control-events">
              <option value="">Select Time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
              <option value="all-day">All Day</option>
            </select>
          </div>

          <div className="form-group-events">
            <label htmlFor="dressCode">Dress Code</label>
            <select id="dressCode" value={form.dressCode} onChange={handleInputChange} className="form-control-events">
              <option value="">Select Dress Code</option>
              <option value="casual">Casual</option>
              <option value="smart-casual">Smart Casual</option>
              <option value="business-casual">Business Casual</option>
              <option value="semi-formal">Semi-Formal</option>
              <option value="formal">Formal</option>
              <option value="black-tie">Black Tie</option>
              <option value="costume">Costume/Themed</option>
            </select>
          </div>

          <button className="btn-plan-event" onClick={planEventLook}>
            <span>Plan My Event Look</span>
          </button>
        </div>
      </section>

      <section className="events-section">
        <h2>Upcoming Events</h2>
        <div className="events-grid">
          {upcomingEvents.length === 0 ? (
            <div className="events-empty">
              <i className="fas fa-calendar-plus"></i>
              <h3>No Upcoming Events</h3>
              <p>Plan your first event look using the event planner above</p>
            </div>
          ) : upcomingEvents.map(event => (
            <div className="event-card" key={event.id}>
              <div className="event-header">
                <div className="event-date">{new Date(event.date).getDate()}</div>
                <div className="event-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                <span className="event-type">{getEventTypeLabel(event.type)}</span>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="past-events">
        <h2>Past Events</h2>
        <div className="events-grid">
          {pastEvents.length === 0 && <p>No past events recorded yet</p>}
        </div>
      </section>
    </main>
  );
};

export default Event;
