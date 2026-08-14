import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth2-callback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-[100dvh] items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
      ></div>
    </div>
  `,
})
export class OAuth2CallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;

    const error = params.get('error');
    if (error) {
      this.router.navigate(['/login'], { queryParams: { error } });
      return;
    }

    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const firstName = params.get('firstName');
    const lastName = params.get('lastName');
    const email = params.get('email');
    const hasPassword = params.get('hasPassword') === 'true';
    const premium = params.get('premium') === 'true';

    if (!accessToken || !refreshToken || !email) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.storeUserAndTokens({
      accessToken,
      refreshToken,
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email,
      hasPassword,
      premium,
    });

    this.router.navigate(['/dashboard']);
  }
}
