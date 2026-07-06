import { Component, HostListener, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  readonly title = input<string>('Confirm action');
  readonly message = input<string>('Are you sure?');
  readonly confirmDisabled = input<boolean>(false);

  readonly confirm = output<void>();
  readonly closeModal = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeModal.emit();
  }
}
