import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationsComponent } from './invitations/invitations.component';
import { AttendingEventsComponent } from './attending-events/attending-events.component';
import { EventsCalendarComponent } from './events-calendar/events-calendar.component';
import { CreatedEventsComponent } from './created-events/created-events.component';

type WorkspaceTab = 'created' | 'attending' | 'invitations' | 'calendar';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    CreatedEventsComponent,
    InvitationsComponent,
    AttendingEventsComponent,
    EventsCalendarComponent,
  ],
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent {
  activeTab = signal<WorkspaceTab>('created');
}
