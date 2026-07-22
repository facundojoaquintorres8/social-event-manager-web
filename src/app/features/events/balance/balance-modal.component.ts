import {
  Component,
  HostListener,
  OnChanges,
  SimpleChanges,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BalanceParticipantRequest,
  BalanceRequest,
  BalanceResponse,
  EventFull,
  InvitationStatus,
} from '../../../core/models/event.model';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-balance-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './balance-modal.component.html',
})
export class BalanceModalComponent implements OnChanges {
  private readonly translate = inject(TranslateService);

  readonly event = input.required<EventFull>();
  readonly loading = input(false);
  readonly result = input<BalanceResponse | null>(null);

  readonly modalClosed = output<void>();
  readonly calculateBalance = output<BalanceRequest>();

  readonly participants = signal<BalanceParticipantRequest[]>([]);
  readonly externalParticipantName = signal('');

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event']?.currentValue) {
      this.initializeParticipants();
    }
  }

  getRemoveParticipantReason(participant: BalanceParticipantRequest): string {
    if (this.canRemoveParticipant(participant)) {
      return this.translate.instant('balanceModal.remove');
    }
    return this.translate.instant('balanceModal.toast.removeParticipantReason');
  }

  canRemoveParticipant(participant: BalanceParticipantRequest): boolean {
    if (!participant.userId) {
      return true;
    }

    return !this.event().contributions.some(
      (contribution) => contribution.splitCost && contribution.createdById === participant.userId,
    );
  }

  removeParticipant(index: number) {
    this.participants.update((participants) => participants.filter((_, i) => i !== index));
  }

  addExternalParticipant(input: HTMLInputElement) {
    const name = input.value.trim();

    if (!name) {
      return;
    }

    this.participants.update((participants) => [
      ...participants,
      {
        name,
      },
    ]);

    input.value = '';
  }

  submit() {
    this.calculateBalance.emit({
      participants: this.participants(),
    });
  }

  onClose() {
    this.modalClosed.emit();
  }

  private initializeParticipants() {
    const event = this.event();

    const participants: BalanceParticipantRequest[] = [];

    participants.push({
      userId: event.createdById, // owner
      name: event.createdBy,
    });

    event.participants
      .filter((participant) => participant.status === InvitationStatus.ACCEPTED)
      .forEach((participant) => {
        participants.push({
          userId: participant.userId,
          name: `${participant.firstName} ${participant.lastName}`,
        });
      });

    this.participants.set(participants);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (!this.loading()) this.onClose();
  }
}
