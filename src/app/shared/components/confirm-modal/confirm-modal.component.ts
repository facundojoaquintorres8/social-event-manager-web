import { Component, HostListener, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  readonly title = input<string | null>(null);
  readonly message = input<string | null>(null);
  readonly confirmDisabled = input<boolean>(false);

  readonly confirm = output<void>();
  readonly closeModal = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeModal.emit();
  }
}
