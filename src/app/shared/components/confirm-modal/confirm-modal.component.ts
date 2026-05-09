import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  readonly open = input<boolean>(false);
  readonly title = input<string>('Confirm action');
  readonly message = input<string>('Are you sure?');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
