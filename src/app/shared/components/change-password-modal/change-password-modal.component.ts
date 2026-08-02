import {
  Component,
  inject,
  output,
  signal,
  ChangeDetectionStrategy,
  computed,
  input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideEye, LucideEyeOff, LucideDynamicIcon } from '@lucide/angular';
import { ToastService } from '../../../core/services/toast.service';
import { passwordMatchValidator } from '../../utils/validators';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './change-password-modal.component.html',
})
export class ChangePasswordModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly authService = inject(AuthService);

  readonly mode = input<'change' | 'set'>('change');

  readonly modalClosed = output<void>();

  readonly loading = signal(false);
  readonly showCurrent = signal(false);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);

  readonly form = computed(() => {
    if (this.mode() === 'set') {
      return this.fb.nonNullable.group(
        {
          currentPassword: [''],
          newPassword: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
            ],
          ],
          confirmPassword: ['', Validators.required],
        },
        { validators: passwordMatchValidator('newPassword', 'confirmPassword') },
      );
    }
    return this.fb.nonNullable.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator('newPassword', 'confirmPassword') },
    );
  });
  protected readonly currentIcon = computed(() => (this.showCurrent() ? LucideEyeOff : LucideEye));
  protected readonly newIcon = computed(() => (this.showNew() ? LucideEyeOff : LucideEye));
  protected readonly confirmIcon = computed(() => (this.showConfirm() ? LucideEyeOff : LucideEye));

  onClose(): void {
    this.modalClosed.emit();
  }

  submit(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const { currentPassword, newPassword } = this.form().getRawValue();

    const request$ =
      this.mode() === 'change'
        ? this.usersService.changePassword({ currentPassword: currentPassword!, newPassword })
        : this.usersService.setPassword({ newPassword });

    request$.pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.toastService.show(
          this.translate.instant(
            this.mode() === 'change' ? 'changePassword.toast.success' : 'setPassword.toast.success',
          ),
          'success',
        );
        this.onClose();
        if (this.mode() === 'set') {
          this.authService.updateHasPassword(true);
        }
      },
    });
  }
}
