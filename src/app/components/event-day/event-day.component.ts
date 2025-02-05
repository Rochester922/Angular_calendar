import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { CalendarValue } from '../../../types/calendar';
import { EventsService } from '../../service/events/events.service';
import { NgFor } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-event-day',
  imports: [NgFor, DragDropModule, CdkDropList, CdkDrag],
  templateUrl: './event-day.component.html',
  styleUrl: './event-day.component.less',
})
export class EventDayComponent implements OnInit {
  @Input()
  day: Date = new Date();
  events: CalendarValue[] = [];

  constructor(
    private dialog: MatDialog,
    private eventsService: EventsService,
  ) {
    this.events = eventsService.getEventsByDate(this.day);
  }

  ngOnInit(): void {
    this.eventsService.eventsSubject$.subscribe(() => {
      this.events = this.eventsService.getEventsByDate(this.day);
    });
  }

  formatStartTime(event: CalendarValue): string {
    const date = new Date(event.startTime);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  openEventDialog(date: Date): void {
    const dialogRef = this.dialog.open(EventModalComponent, { data: { date } });

    dialogRef.afterClosed().subscribe((result: CalendarValue) => {
      if (result) {
        this.eventsService.addEvent(result);
      }
    });
  }

  editEventDialog(date: Date, event: CalendarValue, e: Event): void {
    e.stopPropagation();
    e.preventDefault();

    const dialogRef = this.dialog.open(EventModalComponent, {
      data: { date, event },
    });

    dialogRef.afterClosed().subscribe((result: CalendarValue) => {
      if (result) {
        this.eventsService.updateEvent(result);
      }
    });
  }

  drop(event: CdkDragDrop<CalendarValue[]>, date: Date) {
    if (event.previousContainer !== event.container) {
      const {
        item: { data },
      } = event;

      const baseDateString = date.toISOString().split('T')[0];

      const startTimeString = new Date(data.startTime)
        .toTimeString()
        .split(' ')[0];
      const endTimeString = new Date(data.endTime).toTimeString().split(' ')[0];

      this.eventsService.updateEvent({
        ...data,
        startTime: new Date(`${baseDateString}T${startTimeString}`),
        endTime: new Date(`${baseDateString}T${endTimeString}`),
      });
    }
  }
}
