import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./components/calendar/calendar.module').then(
        (m) => m.CalendarModule,
      ),
  },
];
