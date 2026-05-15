import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../../core/services/events.service';
import { Invitation, InvitationStatus } from '../../../core/models/event.model';
import { ToastService } from '../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule, Calendar, MapPin, User, Check, X, Inbox } from 'lucide-angular';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './invitations.component.html',
})
export class InvitationsComponent implements OnInit {
  private readonly eventService = inject(EventsService);
  private readonly toastService = inject(ToastService);

  invitations = signal<Invitation[]>([]);
  loading = signal(true);
  actionLoading = signal<string | null>(null);

  readonly InvitationStatus = InvitationStatus;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly User = User;
  readonly Check = Check;
  readonly X = X;
  readonly Inbox = Inbox;

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
    this.actionLoading.set(invitationId);

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

        this.actionLoading.set(null);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.message) {
          this.toastService.show(err.error.message, 'error');
        } else {
          this.toastService.show('Unexpected error occurred', 'error');
        }

        this.actionLoading.set(null);
      },
    });
  }
}
