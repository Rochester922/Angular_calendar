import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarValue } from '../../../types/calendar';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private events = new BehaviorSubject<CalendarValue[]>([]);

  events$ = this.events.asObservable();

  initEvents() {
    try {
      const jsonData = localStorage.getItem('appointments') || '';
      const events = JSON.parse(jsonData);

      this.events.next(events);
    } catch (error) {
      this.events.next([]);
    }
  }

  getEvents(): CalendarValue[] {
    return this.events.value;
  }

  getEventsByDate(date: Date): CalendarValue[] {
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth();
    const utcDate = date.getUTCDate();

    const startTime = new Date(utcYear, utcMonth, utcDate, 0, 0, 0, 0);
    const endTime = new Date(utcYear, utcMonth, utcDate, 23, 59, 59, 999);

    return this.events.value
      .filter(
        (event) =>
          new Date(event.startTime).getTime() >= startTime.getTime() &&
          new Date(event.startTime).getTime() <= endTime.getTime(),
      )
      ?.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  }

  addEvent(event: CalendarValue): void {
    this.events.next([...this.events.value, event]);

    localStorage.setItem('appointments', JSON.stringify(this.events.value));
  }

  updateEvent(updatedEvent: CalendarValue): void {
    this.events.next(
      this.events.value.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );

    localStorage.setItem('appointments', JSON.stringify(this.events.value));
  }

  deleteEvent(event: CalendarValue): void {
    this.events.next(
      this.events.value.filter((value) => event.id !== value.id),
    );

    localStorage.setItem('appointments', JSON.stringify(this.events.value));
  }
}
