import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LucideDynamicIcon, LucideEye, LucideEyeOff } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { passwordMatchValidator } from '../../../shared/utils/validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly token = signal<string | null>(null);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);

  protected readonly newIcon = computed(() => (this.showNew() ? LucideEyeOff : LucideEye));
  protected readonly confirmIcon = computed(() => (this.showConfirm() ? LucideEyeOff : LucideEye));

  readonly form = this.fb.nonNullable.group(
    {
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

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.token.set(token);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.authService
      .resetPassword({
        token: this.token()!,
        newPassword: this.form.getRawValue().newPassword,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.toastService.show(this.translate.instant('resetPassword.toast.success'), 'success');
          this.router.navigate(['/login']);
        },
      });
  }
}
