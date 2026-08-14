import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LucideCircleCheckBig,
  LucideCircleX,
  LucideClock,
  LucideDynamicIcon,
} from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';

type PaymentStatus = 'success' | 'failure' | 'pending';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payment-result.component.html',
})
export class PaymentResultComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);

  readonly status = signal<PaymentStatus>('success');
  readonly LucideCircleCheckBig = LucideCircleCheckBig;
  readonly LucideCircleX = LucideCircleX;
  readonly LucideClock = LucideClock;

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('success')) {
      this.status.set('success');
      this.refreshUserProfile();
    } else if (url.includes('failure')) {
      this.status.set('failure');
    } else {
      this.status.set('pending');
    }
  }

  private refreshUserProfile(): void {
    this.usersService.me().subscribe({
      next: (res) => {
        const current = this.authService.currentUser();
        if (current) {
          this.authService.currentUser.set({
            ...current,
            premium: res.data.premium,
          });
        }
      },
    });
  }
}
