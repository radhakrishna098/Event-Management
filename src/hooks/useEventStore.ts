import { useState, useCallback } from 'react';
import { Event, User, Registration, CreateEventData, RegisterUserData, EventStats } from '@/types/event';
import { toast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Web Development Conference 2024',
    datetime: '2024-03-15T09:00:00.000Z',
    location: 'San Francisco Convention Center',
    capacity: 500,
    description: 'Join us for the biggest web development conference of the year!',
    registrations: [],
    createdAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'AI & Machine Learning Summit',
    datetime: '2024-04-20T08:30:00.000Z',
    location: 'Tech Hub, New York',
    capacity: 300,
    description: 'Explore the latest in AI and machine learning technologies.',
    registrations: [],
    createdAt: '2024-01-20T14:30:00.000Z'
  }
];

const mockUsers: User[] = [];

export const useEventStore = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createEvent = useCallback((eventData: CreateEventData): Event => {
    // Validation
    if (eventData.capacity < 1 || eventData.capacity > 1000) {
      throw new Error('Event capacity must be between 1 and 1000');
    }

    if (new Date(eventData.datetime) < new Date()) {
      throw new Error('Event date must be in the future');
    }

    const newEvent: Event = {
      id: generateId(),
      ...eventData,
      registrations: [],
      createdAt: new Date().toISOString()
    };

    setEvents(prev => [...prev, newEvent]);
    toast({
      title: "Event Created",
      description: `${eventData.title} has been successfully created.`,
    });

    return newEvent;
  }, []);

  const getEvent = useCallback((eventId: string): Event | undefined => {
    return events.find(event => event.id === eventId);
  }, [events]);

  const registerUserForEvent = useCallback((eventId: string, userData: RegisterUserData): Registration => {
    const event = events.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Check if event is in the past
    if (new Date(event.datetime) < new Date()) {
      throw new Error('Cannot register for past events');
    }

    // Check if event is full
    if (event.registrations.length >= event.capacity) {
      throw new Error('Event is at full capacity');
    }

    // Find or create user
    let user = users.find(u => u.email === userData.email);
    if (!user) {
      user = {
        id: generateId(),
        ...userData
      };
      setUsers(prev => [...prev, user!]);
    }

    // Check for duplicate registration
    const existingRegistration = event.registrations.find(r => r.userId === user!.id);
    if (existingRegistration) {
      throw new Error('User is already registered for this event');
    }

    const registration: Registration = {
      id: generateId(),
      userId: user.id,
      eventId: eventId,
      user: user,
      registeredAt: new Date().toISOString()
    };

    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, registrations: [...e.registrations, registration] }
        : e
    ));

    toast({
      title: "Registration Successful",
      description: `${userData.name} has been registered for ${event.title}.`,
    });

    return registration;
  }, [events, users]);

  const cancelRegistration = useCallback((eventId: string, userId: string): void => {
    const event = events.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const registration = event.registrations.find(r => r.userId === userId);
    if (!registration) {
      throw new Error('User is not registered for this event');
    }

    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { 
            ...e, 
            registrations: e.registrations.filter(r => r.userId !== userId) 
          }
        : e
    ));

    toast({
      title: "Registration Cancelled",
      description: `Registration for ${event.title} has been cancelled.`,
      variant: "destructive"
    });
  }, [events]);

  const getUpcomingEvents = useCallback((): Event[] => {
    const now = new Date();
    return events
      .filter(event => new Date(event.datetime) > now)
      .sort((a, b) => {
        const dateComparison = new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
        if (dateComparison === 0) {
          return a.location.localeCompare(b.location);
        }
        return dateComparison;
      });
  }, [events]);

  const getEventStats = useCallback((eventId: string): EventStats => {
    const event = events.find(e => e.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const totalRegistrations = event.registrations.length;
    const remainingCapacity = event.capacity - totalRegistrations;
    const capacityUsedPercentage = Math.round((totalRegistrations / event.capacity) * 100);

    return {
      totalRegistrations,
      remainingCapacity,
      capacityUsedPercentage
    };
  }, [events]);

  return {
    events,
    users,
    createEvent,
    getEvent,
    registerUserForEvent,
    cancelRegistration,
    getUpcomingEvents,
    getEventStats
  };
};