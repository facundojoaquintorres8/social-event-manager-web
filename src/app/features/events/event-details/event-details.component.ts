import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EventsService } from '../../../core/services/events.service';
import {
  BalanceRequest,
  BalanceResponse,
  Contribution,
  CreateContributionRequest,
  EventFull,
  EventParticipant,
  EventStatus,
  InvitationStatus,
} from '../../../core/models/event.model';
import { ToastService } from '../../../core/services/toast.service';
import { InviteUserModalComponent } from '../invite-user-modal/invite-user-modal.component';
import { AuthService } from '../../../core/services/auth.service';
import { InvitationsService } from '../../../core/services/invitations.service';
import { ExternalInvitationsService } from '../../../core/services/external-invitations.service';
import {
  canAddContribution,
  canInteractWithEvent,
  isEventExpired,
} from '../../../shared/utils/event.utils';
import { ContributionsService } from '../../../core/services/contributions.service';
import { ContributionModalComponent } from '../contribution/contribution-modal.component';
import { BalanceModalComponent } from '../balance/balance-modal.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { StatusLabelPipe } from '../../../shared/utils/status-label.pipe';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { buildGoogleMapsUrl } from '../../../shared/utils/maps.utils';
import {
  LucideArrowLeft,
  LucideMail,
  LucidePackage,
  LucidePencil,
  LucidePlus,
  LucideTrash2,
  LucideUsers,
} from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    InviteUserModalComponent,
    ContributionModalComponent,
    BalanceModalComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    StatusLabelPipe,
    ConfirmModalComponent,
    LucideTrash2,
    LucideArrowLeft,
    LucidePlus,
    LucidePencil,
    LucideUsers,
    LucidePackage,
    LucideMail,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-details.component.html',
})
export class EventDetailsComponent implements OnInit {
  @ViewChild(InviteUserModalComponent)
  inviteModal?: InviteUserModalComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly eventsService = inject(EventsService);
  private readonly toastService = inject(ToastService);
  private readonly location = inject(Location);
  private readonly authService = inject(AuthService);
  private readonly invitationService = inject(InvitationsService);
  private readonly externalInvitationService = inject(ExternalInvitationsService);
  private readonly contributionsService = inject(ContributionsService);

  readonly event = signal<EventFull | null>(null);
  readonly loading = signal(true);
  readonly error = signal<boolean>(false);
  readonly cancelModalOpen = signal(false);
  readonly cancelling = signal(false);
  readonly inviteModalOpen = signal(false);
  readonly removingParticipant = signal<string | null>(null);
  readonly updatingInvitationStatus = signal<InvitationStatus | null>(null);
  readonly contributionModalOpen = signal(false);
  readonly contributionLoading = signal(false);
  readonly editingContribution = signal<Contribution | null>(null);
  readonly processingContributions = signal<Set<string>>(new Set());
  readonly balanceModalOpen = signal(false);
  readonly balanceLoading = signal(false);
  readonly balanceResult = signal<BalanceResponse | null>(null);

  readonly EventStatus = EventStatus;
  readonly InvitationStatus = InvitationStatus;
  readonly canInteractWithEvent = canInteractWithEvent;
  readonly canAddContribution = canAddContribution;
  readonly isEventExpired = isEventExpired;
  readonly buildGoogleMapsUrl = buildGoogleMapsUrl;

  currentUserParticipant = computed<EventParticipant | null>(() => {
    const currentEvent = this.event();

    const currentUser = this.authService.currentUser();

    if (!currentEvent || !currentUser || currentEvent.owner) {
      return null;
    }

    return (
      currentEvent.participants.find(
        (participant) => participant.email.toLowerCase() === currentUser.email.toLowerCase(),
      ) ?? null
    );
  });

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent(): void {
    this.loading.set(true);
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.error.set(true);
      this.loading.set(false);
      return;
    }

    this.error.set(false);
    this.eventsService
      .getFullEventById(eventId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          this.event.set(res.data);
        },
        error: () => {
          this.error.set(true);
        },
      });
  }

  openCancelModal(): void {
    this.cancelModalOpen.set(true);
  }

  closeCancelModal(): void {
    this.cancelModalOpen.set(false);
  }

  confirmCancel(): void {
    const current = this.event();
    if (!current) return;

    this.cancelling.set(true);
    this.eventsService
      .cancelEvent(current.id)
      .pipe(finalize(() => this.cancelling.set(false)))
      .subscribe({
        next: () => {
          this.toastService.show('Event cancelled successfully', 'success');
          this.loadEvent();
          this.closeCancelModal();
        },
        error: () => {
          this.toastService.show('Failed to cancel event', 'error');
        },
      });
  }

  inviteUser(email: string) {
    const currentEvent = this.event();

    if (!currentEvent) return;

    this.eventsService.inviteUser(currentEvent.id, email).subscribe({
      next: () => {
        this.toastService.show('Invitation sent successfully', 'success');

        this.inviteModalOpen.set(false);

        this.inviteModal?.resetLoading();

        this.refreshEvent(currentEvent.id);
      },
      error: () => {
        this.inviteModal?.resetLoading();
      },
    });
  }

  removeParticipant(participant: EventParticipant) {
    const currentEvent = this.event();

    if (!currentEvent) return;

    this.removingParticipant.set(participant.email);

    if (participant.external) {
      this.externalInvitationService
        .removeInvitation(currentEvent.id, participant.email)
        .pipe(finalize(() => this.removingParticipant.set(null)))
        .subscribe({
          next: () => {
            this.toastService.show('Participant removed successfully', 'success');

            this.event.update((event) => {
              if (!event) return event;

              return {
                ...event,
                participants: event.participants.filter((p) => p.email !== participant.email),
              };
            });
          },
        });
    } else {
      this.invitationService
        .removeInvitation(currentEvent.id, participant.email)
        .pipe(finalize(() => this.removingParticipant.set(null)))
        .subscribe({
          next: () => {
            this.toastService.show('Participant removed successfully', 'success');

            this.event.update((event) => {
              if (!event) return event;

              return {
                ...event,
                participants: event.participants.filter((p) => p.email !== participant.email),
              };
            });
          },
        });
    }
  }

  acceptInvitation() {
    const currentEvent = this.event();

    if (!currentEvent) return;

    this.updatingInvitationStatus.set(InvitationStatus.ACCEPTED);

    this.invitationService
      .updateInvitationStatus(currentEvent.id, InvitationStatus.ACCEPTED)
      .subscribe({
        next: () => {
          this.refreshEvent(currentEvent.id);

          this.toastService.show('Invitation accepted successfully', 'success');
        },
        error: () => {
          this.updatingInvitationStatus.set(null);
        },
      });
  }

  rejectInvitation() {
    const currentEvent = this.event();

    if (!currentEvent) return;

    this.updatingInvitationStatus.set(InvitationStatus.REJECTED);

    this.invitationService
      .updateInvitationStatus(currentEvent.id, InvitationStatus.REJECTED)
      .subscribe({
        next: () => {
          this.refreshEvent(currentEvent.id);

          this.toastService.show('Invitation rejected successfully', 'success');
        },
        error: () => {
          this.updatingInvitationStatus.set(null);
        },
      });
  }

  openCreateContributionModal() {
    this.editingContribution.set(null);
    this.contributionModalOpen.set(true);
  }

  openEditContributionModal(contribution: Contribution) {
    this.editingContribution.set(contribution);
    this.contributionModalOpen.set(true);
  }

  closeContributionModal() {
    this.editingContribution.set(null);
    this.contributionModalOpen.set(false);
  }

  submitContribution(payload: CreateContributionRequest) {
    const currentEvent = this.event();

    if (!currentEvent) {
      return;
    }

    this.contributionLoading.set(true);

    const editingContribution = this.editingContribution();

    const request = editingContribution
      ? this.contributionsService.updateContribution(
          currentEvent.id,
          editingContribution.id,
          payload,
        )
      : this.contributionsService.createContribution(currentEvent.id, payload);

    request.pipe(finalize(() => this.contributionLoading.set(false))).subscribe({
      next: () => {
        this.toastService.show(
          editingContribution
            ? 'Contribution updated successfully'
            : 'Contribution created successfully',
          'success',
        );

        this.closeContributionModal();

        this.refreshEvent(currentEvent.id);
      },
    });
  }

  toggleContributionCompleted(contribution: Contribution) {
    const currentEvent = this.event();

    if (!currentEvent) {
      return;
    }

    if (!currentEvent.owner && !contribution.owner) {
      return;
    }

    const completed = !contribution.completed;

    this.startContributionUpdate(contribution.id);

    this.contributionsService
      .updateContributionStatus(currentEvent.id, contribution.id, completed)
      .pipe(finalize(() => this.finishContributionUpdate(contribution.id)))
      .subscribe({
        next: () => {
          this.event.update((event) => {
            if (!event) {
              return event;
            }

            return {
              ...event,
              contributions: event.contributions.map((c) =>
                c.id === contribution.id
                  ? {
                      ...c,
                      completed,
                    }
                  : c,
              ),
            };
          });

          this.toastService.show(
            completed ? 'Contribution marked as ready' : 'Contribution marked as pending',
            'success',
          );
        },
        error: () => {
          this.toastService.show('Error updating contribution status', 'error');
        },
      });
  }

  isUpdatingContribution(contributionId: string): boolean {
    return this.processingContributions().has(contributionId);
  }

  deleteContribution(contribution: Contribution) {
    const currentEvent = this.event();

    if (!currentEvent) {
      return;
    }

    this.contributionsService.deleteContribution(currentEvent.id, contribution.id).subscribe({
      next: () => {
        this.toastService.show('Contribution deleted successfully', 'success');

        this.event.update((event) => {
          if (!event) {
            return event;
          }

          return {
            ...event,
            contributions: event.contributions.filter((c) => c.id !== contribution.id),
          };
        });
      },
    });
  }

  openBalanceModal() {
    this.balanceResult.set(null);
    this.balanceModalOpen.set(true);
  }

  closeBalanceModal() {
    this.balanceResult.set(null);
    this.balanceModalOpen.set(false);
  }

  calculateBalance(payload: BalanceRequest) {
    const currentEvent = this.event();

    if (!currentEvent) {
      return;
    }

    this.balanceLoading.set(true);

    this.eventsService
      .calculateBalance(currentEvent.id, payload)
      .pipe(finalize(() => this.balanceLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.balanceResult.set(res.data);
        },
      });
  }

  goBack(): void {
    this.location.back();
  }

  private refreshEvent(eventId: string): void {
    this.eventsService
      .getFullEventById(eventId)
      .pipe(finalize(() => this.updatingInvitationStatus.set(null)))
      .subscribe({
        next: (res) => {
          this.event.set(res.data);
        },
        error: () => {
          this.toastService.show('Error refreshing event', 'error');
        },
      });
  }

  private startContributionUpdate(contributionId: string) {
    this.processingContributions.update((current) => {
      const next = new Set(current);

      next.add(contributionId);

      return next;
    });
  }

  private finishContributionUpdate(contributionId: string) {
    this.processingContributions.update((current) => {
      const next = new Set(current);

      next.delete(contributionId);

      return next;
    });
  }
}
