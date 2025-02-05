import { NgFor } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { EventsService } from '../../service/events/events.service';
import { EventDayComponent } from '../event-day/event-day.component';
import { CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    NgFor,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    EventDayComponent,
    DragDropModule,
    CdkDropListGroup,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less'],
})
export class CalendarComponent implements OnInit {
  currentMonth: Date = new Date();
  daysInMonth: Date[] = [];
  emptyDays: any[] = [];
  
  @ViewChild('picker') picker!: MatDatepicker<Date>; // Reference to DatePicker

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.eventsService.initEvents();
    this.generateCalendar();
  }

  generateCalendar() {
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    this.emptyDays = new Array(startOfMonth.getDay()).fill(null);
    this.daysInMonth = [];

    for (let day = new Date(startOfMonth); day <= endOfMonth; day.setDate(day.getDate() + 1)) {
      this.daysInMonth.push(new Date(day));
    }
  }

  goToNextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  goToPreviousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  openDatePicker() {
    this.picker.open(); // Opens the date picker programmatically
  }

  onMonthSelected(event: Date) {
    this.currentMonth = new Date(event.getFullYear(), event.getMonth(), 1);
    this.generateCalendar();

    this.picker.close(); 
  }
}
