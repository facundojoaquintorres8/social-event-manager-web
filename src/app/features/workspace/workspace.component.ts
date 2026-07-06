import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationsComponent } from './invitations/invitations.component';
import { AttendingEventsComponent } from './attending-events/attending-events.component';
import { EventsCalendarComponent } from './events-calendar/events-calendar.component';
import { CreatedEventsComponent } from './created-events/created-events.component';
import { ActivatedRoute, Router } from '@angular/router';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './workspace.component.html',
})
export class WorkspaceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  activeTab = signal<WorkspaceTab>('created');

  ngOnInit(): void {
    const tab = this.route.snapshot.queryParams['tab'];
    if (tab) this.activeTab.set(tab);
  }

  setTab(tab: WorkspaceTab): void {
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }
}
