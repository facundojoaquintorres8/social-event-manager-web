import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationsComponent } from './invitations/invitations.component';
import { AttendingEventsComponent } from './attending-events/attending-events.component';
import { EventsCalendarComponent } from './events-calendar/events-calendar.component';
import { CreatedEventsComponent } from './created-events/created-events.component';
import { ActivatedRoute } from '@angular/router';

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
export class WorkspaceComponent implements OnInit {
  readonly route = inject(ActivatedRoute);

  activeTab = signal<WorkspaceTab>('created');

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParams['tab'];
    if (tab) this.activeTab.set(tab);
  }
}
