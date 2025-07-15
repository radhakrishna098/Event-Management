import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types/event';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: string) => void;
  onRegister: (eventId: string) => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onViewDetails,
  onRegister,
  isRegistered = false
}) => {
  const eventDate = new Date(event.datetime);
  const isUpcoming = eventDate > new Date();
  const registrationsCount = event.registrations.length;
  const availableSpots = event.capacity - registrationsCount;
  const capacityPercentage = (registrationsCount / event.capacity) * 100;

  const getCapacityColor = () => {
    if (capacityPercentage >= 90) return 'text-destructive';
    if (capacityPercentage >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 animate-fade-in bg-gradient-card border-0 hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </CardTitle>
          <Badge variant={isUpcoming ? "default" : "secondary"} className="ml-2">
            {isUpcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(eventDate, 'PPP')} at {format(eventDate, 'p')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className={getCapacityColor()}>
              {registrationsCount}/{event.capacity} registered
            </span>
          </div>

          {availableSpots <= 10 && availableSpots > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-warning font-medium">
                Only {availableSpots} spots left!
              </span>
            </div>
          )}

          {availableSpots === 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-destructive" />
              <span className="text-destructive font-medium">Event Full</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(event.id)}
            className="flex-1"
          >
            View Details
          </Button>
          
          {isUpcoming && !isRegistered && availableSpots > 0 && (
            <Button 
              variant="gradient" 
              size="sm" 
              onClick={() => onRegister(event.id)}
              className="flex-1"
            >
              Register
            </Button>
          )}

          {isRegistered && (
            <Badge variant="success" className="flex-1 justify-center py-2">
              Registered
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};