import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../core/services/events.service';
import { Invitation, InvitationStatus } from '../../../core/models/event.model';
import { ToastService } from '../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invitations.component.html',
})
export class InvitationsComponent implements OnInit {
  private readonly eventService = inject(EventsService);
  private readonly toastService = inject(ToastService);

  invitations = signal<Invitation[]>([]);
  loading = signal(true);

  readonly InvitationStatus = InvitationStatus;

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations() {
    this.loading.set(true);

    this.eventService.getMyInvitations().subscribe({
      next: (response) => {
        this.invitations.set(response.data.content);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.message) {
          this.toastService.show(err.error.message, 'error');
          return;
        }
        this.toastService.show('Unexpected error occurred', 'error');
      },
    });
  }

  updateStatus(invitationId: string, status: InvitationStatus) {
    this.eventService.updateInvitationStatus(invitationId, status).subscribe({
      next: () => {
        this.invitations.update((invitations) =>
          invitations.map((invitation) =>
            invitation.invitationId === invitationId
              ? {
                  ...invitation,
                  status,
                }
              : invitation,
          ),
        );

        this.toastService.show(`Invitation ${status.toLowerCase()} successfully`, 'success');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.message) {
          this.toastService.show(err.error.message, 'error');
          return;
        }
        this.toastService.show('Unexpected error occurred', 'error');
      },
    });
  }
}
