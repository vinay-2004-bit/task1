import React, { useState } from 'react';
import dayjs from 'dayjs';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    color: '#f6be23'
  });

  // Sample events data
  const [events, setEvents] = useState([
    {
      id: 1,
      date: dayjs().format('YYYY-MM-DD'),
      startTime: "10:00",
      endTime: "11:30",
      color: "#f6be23",
      title: "Daily Standup",
    },
    {
      id: 2,
      date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
      startTime: "14:30",
      endTime: "15:30",
      color: "#f6501e",
      title: "Weekly catchup",
    },
    {
      id: 3,
      date: dayjs().add(5, 'day').format('YYYY-MM-DD'),
      startTime: "16:00",
      endTime: "17:00",
      color: "#2ecc71",
      title: "Team Meeting",
    }
  ]);

  // Navigation functions
  const nextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const prevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
    setSelectedDate(dayjs().format('YYYY-MM-DD'));
  };

  // Add new event
  const addEvent = () => {
    if (newEvent.title.trim() === '') return;
    
    const event = {
      id: Date.now(),
      date: selectedDate,
      ...newEvent
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      color: '#f6be23'
    });
    setShowEventForm(false);
  };

  // Delete event
  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  // Check for overlapping events
  const hasOverlappingEvents = (date) => {
    const dayEvents = events.filter(event => event.date === date);
    return dayEvents.length > 2; // More than 2 events on same day
  };

  // Get days in month
  const getDaysInMonth = () => {
    const startDay = currentDate.startOf('month').day();
    const daysInMonth = currentDate.daysInMonth();
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Color options for events
  const colorOptions = [
    '#f6be23', '#f6501e', '#2ecc71', '#3498db', '#9b59b6', '#e74c3c', '#1abc9c'
  ];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt; Previous</button>
        <div className="calendar-title">
          <h2>{currentDate.format('MMMM YYYY')}</h2>
          <button onClick={goToToday} className="today-btn">Today</button>
        </div>
        <button onClick={nextMonth}>Next &gt;</button>
      </div>

      {/* Event Form */}
      {showEventForm && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h3>Add Event for {dayjs(selectedDate).format('MMM D, YYYY')}</h3>
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              className="event-input"
            />
            <div className="time-inputs">
              <label>
                Start Time:
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                />
              </label>
            </div>
            <div className="color-picker">
              <span>Color:</span>
              {colorOptions.map(color => (
                <button
                  key={color}
                  className={`color-option ${newEvent.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewEvent({...newEvent, color})}
                />
              ))}
            </div>
            <div className="form-buttons">
              <button onClick={addEvent} className="save-btn">Save Event</button>
              <button onClick={() => setShowEventForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="calendar-grid">
        {/* Week days header */}
        {weekDays.map(day => (
          <div key={day} className="week-day">{day}</div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty"></div>;
          }

          const dateString = currentDate.date(day).format('YYYY-MM-DD');
          const dayEvents = events.filter(event => event.date === dateString);
          const isToday = dateString === dayjs().format('YYYY-MM-DD');
          const isSelected = dateString === selectedDate;
          const hasOverlap = hasOverlappingEvents(dateString);

          return (
            <div 
              key={day} 
              className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(dateString)}
              onDoubleClick={() => setShowEventForm(true)}
            >
              <div className="day-header">
                <span className="day-number">{day}</span>
                {hasOverlap && <span className="overlap-indicator">⚡</span>}
              </div>
              <div className="events-list">
                {dayEvents.slice(0, 2).map((event, idx) => (
                  <div 
                    key={event.id}
                    className="event"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${event.title}"?`)) {
                        deleteEvent(event.id);
                      }
                    }}
                  >
                    <span className="event-time">{event.startTime}</span>
                    <span className="event-title">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="more-events">+{dayEvents.length - 2} more</div>
                )}
              </div>
              {dayEvents.length === 0 && (
                <div className="add-event-hint">Double click to add event</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="calendar-stats">
        <div className="stat">
          <span className="stat-number">{events.length}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {events.filter(event => event.date === dayjs().format('YYYY-MM-DD')).length}
          </span>
          <span className="stat-label">Today's Events</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {new Set(events.map(event => event.date)).size}
          </span>
          <span className="stat-label">Busy Days</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;