import { NgFor } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { EventsService } from '../../service/events/events.service';
import { EventDayComponent } from '../event-day/event-day.component';
import { CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

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
  emptyDays: null[] = [];

  @ViewChild('picker') picker!: MatDatepicker<Date>; // Reference to DatePicker

  constructor(
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['m']) {
        const [year, month] = params['m'].split('-');
        this.eventsService.setCurrentMonth(new Date(+year, +month - 1, 1));
      } else {
        this.eventsService.setCurrentMonth(new Date());
      }
    });

    this.eventsService.currentMonth$.subscribe((date) => {
      this.currentMonth = date;
    });

    this.eventsService.daysInMonth$.subscribe((days) => {
      this.daysInMonth = days;
    });

    this.eventsService.emptyDaysSubject$.subscribe((days) => {
      this.emptyDays = days;
    });

    this.eventsService.initEvents();
  }

  updateParam() {
    const formattedDate = `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}`;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { m: formattedDate },
      queryParamsHandling: 'merge',
    });
  }

  goToNextMonth() {
    this.eventsService.setCurrentMonth(
      new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        1,
      ),
    );

    this.updateParam();
  }

  goToPreviousMonth() {
    this.eventsService.setCurrentMonth(
      new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() - 1,
        1,
      ),
    );

    this.updateParam();
  }

  openDatePicker() {
    this.picker.open(); // Opens the date picker programmatically
  }

  onMonthSelected(event: Date) {
    this.eventsService.setCurrentMonth(
      new Date(event.getFullYear(), event.getMonth(), 1),
    );

    this.picker.close();
    this.updateParam();
  }
}
