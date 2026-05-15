import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from '../events/events.component';
import { InvitationsComponent } from '../events/invitations/invitations.component';
import { AttendingEventsComponent } from '../events/attending-events/attending-events.component';
import { EventsCalendarComponent } from '../events/events-calendar/events-calendar.component';

type WorkspaceTab = 'created' | 'attending' | 'invitations' | 'calendar';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    EventsComponent,
    InvitationsComponent,
    AttendingEventsComponent,
    EventsCalendarComponent,
  ],
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent {
  activeTab = signal<WorkspaceTab>('created');
}
