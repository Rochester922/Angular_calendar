import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Form field module
import { MatInputModule } from '@angular/material/input'; // Input module
import { MatButtonModule } from '@angular/material/button'; // Button module
import { FormsModule } from '@angular/forms'; // For two-way data binding in forms
import { ReactiveFormsModule } from '@angular/forms'; // For reactive forms
import { MatDatepickerModule } from '@angular/material/datepicker'; // Datepicker for date/time fields
import { MatNativeDateModule } from '@angular/material/core'; // Native date module
import { MatTimepickerModule } from '@angular/material/timepicker'; // Import MatTimepickerModule
import { CalendarValue } from '../../../types/calendar';
import { v4 } from 'uuid';
import { EventsService } from '../../service/events/events.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.less'],
  imports: [
    NgIf,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
  ],
})
export class EventModalComponent {
  eventForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EventModalComponent>,
    private formBuilder: FormBuilder,
    private eventsService: EventsService,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date; event: CalendarValue },
  ) {
    const { event } = data || {};

    this.eventForm = this.formBuilder.group({
      title: [event?.title || '', Validators.required],
      startTime: [event?.startTime || '', Validators.required],
      endTime: [event?.endTime || '', Validators.required],
    });
  }

  onSave() {
    const { date } = this.data;
    const {
      value: { title, startTime, endTime },
    } = this.eventForm;

    if (this.eventForm.valid) {
      const baseDateString = date.toISOString().split('T')[0];

      const startTimeString = new Date(startTime).toTimeString().split(' ')[0];
      const endTimeString = new Date(endTime).toTimeString().split(' ')[0];

      this.dialogRef.close({
        id: this.data.event?.id || v4(),
        title,
        startTime: new Date(`${baseDateString}T${startTimeString}`),
        endTime: new Date(`${baseDateString}T${endTimeString}`),
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete() {
    this.eventsService.deleteEvent(this.data.event);
  }
}
