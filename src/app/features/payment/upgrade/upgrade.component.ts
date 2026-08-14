import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideCheck, LucideCrown, LucideDynamicIcon } from '@lucide/angular';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-upgrade',
  standalone: true,
  imports: [TranslatePipe, LucideCrown, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upgrade.component.html',
})
export class UpgradeComponent {
  private readonly paymentService = inject(PaymentService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly LucideCheck = LucideCheck;

  readonly isPremium = this.authService.currentUser()?.premium ?? false;

  subscribe(): void {
    if (this.isPremium) return;

    this.loading.set(true);

    this.paymentService
      .createPreference()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (res) => {
          // en sandbox usás sandboxInitPoint, en producción initPoint
          window.location.href = res.data.sandboxInitPoint;
        },
      });
  }
}
