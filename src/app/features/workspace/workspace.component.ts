import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from '../events/events.component';
import { InvitationsComponent } from '../events/invitations/invitations.component';
import { AttendingEventsComponent } from '../events/attending-events/attending-events.component';

type WorkspaceTab = 'created' | 'attending' | 'invitations';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, EventsComponent, InvitationsComponent, AttendingEventsComponent],
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent {
  activeTab = signal<WorkspaceTab>('created');
}
