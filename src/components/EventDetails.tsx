import React from 'react';
import { Calendar, MapPin, Users, Clock, UserCheck, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Event, EventStats } from '@/types/event';

interface EventDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  stats: EventStats | null;
  onRegister: () => void;
  onCancelRegistration: (userId: string) => void;
  currentUserRegistration?: string; // userId if registered
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  open,
  onOpenChange,
  event,
  stats,
  onRegister,
  onCancelRegistration,
  currentUserRegistration,
}) => {
  if (!event || !stats) return null;

  const eventDate = new Date(event.datetime);
  const isUpcoming = eventDate > new Date();
  const isFull = stats.remainingCapacity === 0;
  const isRegistered = !!currentUserRegistration;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {event.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{format(eventDate, 'PPPP')}</p>
                  <p className="text-sm text-muted-foreground">{format(eventDate, 'p')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <p>{event.location}</p>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <p>{stats.totalRegistrations}/{event.capacity} registered</p>
                <Badge variant={stats.capacityUsedPercentage >= 90 ? "destructive" : "default"}>
                  {stats.capacityUsedPercentage}% full
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <p>
                  {isUpcoming ? (
                    <span className="text-success">Upcoming Event</span>
                  ) : (
                    <span className="text-muted-foreground">Past Event</span>
                  )}
                </p>
              </div>
            </div>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Event Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Registrations:</span>
                  <span className="font-semibold">{stats.totalRegistrations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining Spots:</span>
                  <span className="font-semibold">{stats.remainingCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity Used:</span>
                  <span className="font-semibold">{stats.capacityUsedPercentage}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About This Event</h3>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          )}

          <Separator />

          {/* Registration Actions */}
          <div className="space-y-4">
            {isRegistered ? (
              <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-success" />
                  <span className="text-success font-medium">You are registered for this event</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancelRegistration(currentUserRegistration)}
                  className="text-destructive hover:text-destructive"
                >
                  Cancel Registration
                </Button>
              </div>
            ) : isUpcoming && !isFull ? (
              <Button 
                variant="gradient" 
                size="lg" 
                onClick={onRegister}
                className="w-full"
              >
                Register for Event
              </Button>
            ) : isFull ? (
              <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-destructive font-medium">This event is at full capacity</p>
              </div>
            ) : (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Registration is not available for past events</p>
              </div>
            )}
          </div>

          {/* Registered Users */}
          {event.registrations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Registered Attendees ({event.registrations.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {event.registrations.map((registration) => (
                  <div 
                    key={registration.id}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded"
                  >
                    <div>
                      <p className="font-medium text-sm">{registration.user.name}</p>
                      <p className="text-xs text-muted-foreground">{registration.user.email}</p>
                    </div>
                    {currentUserRegistration === registration.userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancelRegistration(registration.userId)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};