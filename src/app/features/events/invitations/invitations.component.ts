import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventStatus, Invitation, InvitationStatus } from '../../../core/models/event.model';
import { ToastService } from '../../../core/services/toast.service';
import { LucideAngularModule, Calendar, MapPin, User, Check, X, Inbox } from 'lucide-angular';
import { buildGoogleMapsUrl } from '../../../shared/utils/maps.utils';
import { InvitationsService } from '../../../core/services/invitations.service';
import { canInteractWithEvent, isEventExpired } from '../../../shared/utils/event.utils';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './invitations.component.html',
})
export class InvitationsComponent implements OnInit {
  private readonly invitationService = inject(InvitationsService);
  private readonly toastService = inject(ToastService);

  invitations = signal<Invitation[]>([]);
  loading = signal(true);
  actionLoading = signal<{ invitationId: string; status: InvitationStatus } | null>(null);

  readonly InvitationStatus = InvitationStatus;
  readonly EventStatus = EventStatus;
  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly User = User;
  readonly Check = Check;
  readonly X = X;
  readonly Inbox = Inbox;
  readonly buildGoogleMapsUrl = buildGoogleMapsUrl;
  readonly canInteractWithEvent = canInteractWithEvent;
  readonly isEventExpired = isEventExpired;

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations() {
    this.loading.set(true);

    this.invitationService.getMyInvitations().subscribe({
      next: (response) => {
        this.invitations.set(response.data.content);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  updateStatus(invitation: Invitation, status: InvitationStatus) {
    this.actionLoading.set({
      invitationId: invitation.invitationId,
      status,
    });

    this.invitationService.updateInvitationStatus(invitation.eventId, status).subscribe({
      next: () => {
        this.invitations.update((invitations) =>
          invitations.map((inv) =>
            inv.invitationId === invitation.invitationId
              ? {
                  ...inv,
                  status,
                }
              : inv,
          ),
        );

        this.toastService.show(`Invitation ${status.toLowerCase()} successfully`, 'success');

        this.actionLoading.set(null);
      },
      error: () => {
        this.actionLoading.set(null);
      },
    });
  }
}
