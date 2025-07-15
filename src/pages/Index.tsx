import React, { useState } from 'react';
import { Plus, Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/components/EventCard';
import { CreateEventForm } from '@/components/CreateEventForm';
import { RegisterUserForm } from '@/components/RegisterUserForm';
import { EventDetails } from '@/components/EventDetails';
import { useEventStore } from '@/hooks/useEventStore';
import { CreateEventData, RegisterUserData } from '@/types/event';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-events.jpg';

const Index = () => {
  const {
    events,
    createEvent,
    getEvent,
    registerUserForEvent,
    cancelRegistration,
    getUpcomingEvents,
    getEventStats
  } = useEventStore();

  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [registerFormOpen, setRegisterFormOpen] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const upcomingEvents = getUpcomingEvents();
  
  const filteredEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRegistrations = events.reduce((sum, event) => sum + event.registrations.length, 0);
  const totalUpcoming = upcomingEvents.length;

  const handleCreateEvent = (data: CreateEventData) => {
    try {
      createEvent(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleRegisterUser = (eventId: string) => {
    setSelectedEventId(eventId);
    setRegisterFormOpen(true);
  };

  const handleRegisterSubmit = (data: RegisterUserData) => {
    try {
      registerUserForEvent(selectedEventId, data);
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (eventId: string) => {
    setSelectedEventId(eventId);
    setEventDetailsOpen(true);
  };

  const handleCancelRegistration = (userId: string) => {
    try {
      cancelRegistration(selectedEventId, userId);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel registration",
        variant: "destructive",
      });
    }
  };

  const selectedEvent = selectedEventId ? getEvent(selectedEventId) : null;
  const selectedEventStats = selectedEventId ? getEventStats(selectedEventId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-hero text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-slide-up">
            Manage Events Like a Pro
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-fade-in">
            Create, organize, and manage events with powerful tools designed for success
          </p>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => setCreateEventOpen(true)}
            className="bg-white text-primary hover:bg-white/90 shadow-glow"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Event
          </Button>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button onClick={() => setCreateEventOpen(true)} variant="gradient">
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          </div>

          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                  onRegister={() => handleRegisterUser(event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-4">No events found</h3>
              <Button onClick={() => setCreateEventOpen(true)} variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Event
              </Button>
            </div>
          )}
        </div>
      </section>

      <CreateEventForm
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onSubmit={handleCreateEvent}
      />

      <RegisterUserForm
        open={registerFormOpen}
        onOpenChange={setRegisterFormOpen}
        onSubmit={handleRegisterSubmit}
        eventTitle={selectedEvent?.title || ''}
      />

      <EventDetails
        open={eventDetailsOpen}
        onOpenChange={setEventDetailsOpen}
        event={selectedEvent}
        stats={selectedEventStats}
        onRegister={() => {
          setEventDetailsOpen(false);
          handleRegisterUser(selectedEventId);
        }}
        onCancelRegistration={handleCancelRegistration}
      />
    </div>
  );
};

export default Index;
