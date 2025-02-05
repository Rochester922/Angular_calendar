import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CalendarValue } from '../../../types/calendar';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private eventsSubject = new BehaviorSubject<CalendarValue[]>([]);
  private currentMonthSubject = new BehaviorSubject<Date>(new Date());
  private daysInMonthSubject = new BehaviorSubject<Date[]>([]);
  private emptyDaysSubject = new BehaviorSubject<null[]>([]);

  get eventsSubject$() {
    return this.eventsSubject.asObservable();
  }

  get currentMonth$() {
    return this.currentMonthSubject.asObservable();
  }

  get daysInMonth$() {
    return this.daysInMonthSubject.asObservable();
  }

  get emptyDaysSubject$() {
    return this.emptyDaysSubject.asObservable();
  }

  initEvents() {
    try {
      const jsonData = localStorage.getItem('appointments') || '';
      const events = JSON.parse(jsonData);

      this.eventsSubject.next(events);
    } catch (error) {
      this.eventsSubject.next([]);
    }
  }

  getEvents(): CalendarValue[] {
    return this.eventsSubject.value;
  }

  getEventsByDate(date: Date): CalendarValue[] {
    const utcYear = date.getUTCFullYear();
    const utcMonth = date.getUTCMonth();
    const utcDate = date.getUTCDate();

    const startTime = new Date(utcYear, utcMonth, utcDate, 0, 0, 0, 0);
    const endTime = new Date(utcYear, utcMonth, utcDate, 23, 59, 59, 999);

    return this.eventsSubject.value
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
    this.eventsSubject.next([...this.eventsSubject.value, event]);

    this.saveEventToLocalStorage();
  }

  updateEvent(updatedEvent: CalendarValue): void {
    this.eventsSubject.next(
      this.eventsSubject.value.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );

    this.saveEventToLocalStorage();
  }

  deleteEvent(event: CalendarValue): void {
    this.eventsSubject.next(
      this.eventsSubject.value.filter((value) => event.id !== value.id),
    );

    this.saveEventToLocalStorage();
  }

  saveEventToLocalStorage() {
    localStorage.setItem(
      'appointments',
      JSON.stringify(this.eventsSubject.value),
    );
  }

  setCurrentMonth(date: Date) {
    this.currentMonthSubject.next(date);
    this.generateDaysInMonth(date);
  }

  private generateDaysInMonth(date: Date) {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const daysInMonth: Date[] = [];
    for (
      let day = new Date(startOfMonth);
      day <= endOfMonth;
      day.setDate(day.getDate() + 1)
    ) {
      daysInMonth.push(new Date(day));
    }

    this.emptyDaysSubject.next(new Array(startOfMonth.getDay()).fill(null));
    this.daysInMonthSubject.next(daysInMonth);
  }
}
