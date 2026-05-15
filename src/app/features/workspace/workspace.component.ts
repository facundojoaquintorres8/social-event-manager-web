import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from '../events/events.component';
import { InvitationsComponent } from '../events/invitations/invitations.component';

type WorkspaceTab = 'created' | 'attending' | 'invitations';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, EventsComponent, InvitationsComponent],
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent {
  activeTab = signal<WorkspaceTab>('created');
}
