import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { EventsService } from '../../service/events/events.service';
import { EventDayComponent } from '../event-day/event-day.component';
import { CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop'; // Import DragDropModule

@Component({
  selector: 'app-calendar',
  imports: [
    NgFor,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    EventDayComponent,
    DragDropModule,
    CdkDropListGroup,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less'],
})
export class CalendarComponent implements OnInit {
  currentMonth: Date;
  daysInMonth: Date[];
  emptyDays: number[] = [];

  constructor(private eventsService: EventsService) {
    this.currentMonth = new Date(); // Set to current date
    this.daysInMonth = [];
  }

  ngOnInit() {
    this.eventsService.initEvents();
    this.generateCalendar();
  }

  generateCalendar() {
    const startOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0,
    );
    const daysInMonth = [];
    let day = new Date(startOfMonth);

    while (day <= endOfMonth) {
      daysInMonth.push(new Date(day));

      day.setDate(day.getDate() + 1);
    }

    this.emptyDays = new Array(day.getDay());

    this.daysInMonth = daysInMonth;
  }

  goToNextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
  }

  goToPreviousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
  }
}
