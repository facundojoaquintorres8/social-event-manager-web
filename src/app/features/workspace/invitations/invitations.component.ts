import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCardModel, Invitation, InvitationStatus } from '../../../core/models/event.model';
import { ToastService } from '../../../core/services/toast.service';
import { InvitationsService } from '../../../core/services/invitations.service';
import { finalize } from 'rxjs';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { EventCardSkeletonComponent } from '../../../shared/components/event-card-skeleton/event-card-skeleton.component';
import { LucideInbox } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [
    CommonModule,
    EmptyStateComponent,
    ErrorStateComponent,
    EventCardComponent,
    EventCardSkeletonComponent,
    LucideInbox,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invitations.component.html',
})
export class InvitationsComponent implements OnInit {
  private readonly invitationService = inject(InvitationsService);
  private readonly toastService = inject(ToastService);

  readonly invitations = signal<Invitation[]>([]);
  readonly error = signal<boolean>(false);
  readonly loading = signal(true);
  readonly actionLoading = signal<{ invitationId: string; action: 'accept' | 'reject' } | null>(
    null,
  );

  readonly InvitationStatus = InvitationStatus;

  ngOnInit(): void {
    this.loadInvitations();
  }

  loadInvitations() {
    this.error.set(false);
    this.loading.set(true);

    this.invitationService
      .getMyInvitations()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.invitations.set(response.data.content);
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  updateStatus(eventId: string, status: InvitationStatus): void {
    const invitation = this.invitations().find((inv) => inv.eventId === eventId);
    if (!invitation) return;

    const action = status === InvitationStatus.ACCEPTED ? 'accept' : 'reject';
    this.actionLoading.set({ invitationId: invitation.invitationId, action });

    this.invitationService.updateInvitationStatus(eventId, status).subscribe({
      next: () => {
        this.invitations.update((invitations) =>
          invitations.map((inv) => (inv.eventId === eventId ? { ...inv, status } : inv)),
        );
        this.toastService.show(`Invitation ${status.toLowerCase()} successfully`, 'success');
        this.actionLoading.set(null);
      },
      error: () => {
        this.actionLoading.set(null);
      },
    });
  }

  toEventCard(inv: Invitation): EventCardModel {
    return {
      id: inv.eventId,
      title: inv.title,
      eventDate: inv.eventDate,
      location: inv.location,
      latitude: inv.latitude,
      longitude: inv.longitude,
      createdBy: inv.createdBy,
      eventStatus: inv.eventStatus,
      invitationId: inv.invitationId,
      invitationStatus: inv.status,
    };
  }
}
