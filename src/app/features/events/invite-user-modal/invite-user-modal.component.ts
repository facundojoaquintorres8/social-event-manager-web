import {
  Component,
  HostListener,
  inject,
  output,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invite-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './invite-user-modal.component.html',
})
export class InviteUserModalComponent {
  private readonly fb = inject(FormBuilder);

  readonly closeModal = output<void>();
  readonly invite = output<string>();

  readonly loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onClose() {
    this.form.reset();
    this.closeModal.emit();
  }

  onSubmit() {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.invite.emit(this.form.value.email!);
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  resetLoading() {
    this.loading.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (!this.loading()) this.onClose();
  }
}
