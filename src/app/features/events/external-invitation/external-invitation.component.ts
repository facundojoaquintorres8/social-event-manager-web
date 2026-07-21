import {
  Component,
  OnInit,
  computed,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import {
  ExternalInvitationPreview,
  ExternalInvitationStatus,
} from '../../../core/models/event.model';
import { ExternalInvitationsService } from '../../../core/services/external-invitations.service';
import { StatusLabelPipe } from '../../../shared/utils/status-label.pipe';
import { buildGoogleMapsUrl } from '../../../shared/utils/maps.utils';
import { LucideTriangleAlert } from '@lucide/angular';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-external-invitation',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe, LucideTriangleAlert, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './external-invitation.component.html',
})
export class ExternalInvitationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly externalInvitationsService = inject(ExternalInvitationsService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);

  loading = signal(true);
  error = signal<string | null>(null);
  invitation = signal<ExternalInvitationPreview | null>(null);

  readonly ExternalInvitationStatus = ExternalInvitationStatus;
  readonly buildGoogleMapsUrl = buildGoogleMapsUrl;

  readonly loggedIn = computed(() => this.authService.isAuthenticated());
  readonly alreadyClaimed = computed(() => this.invitation()?.alreadyClaimed ?? false);
  readonly wrongAccount = computed(() => {
    const invitation = this.invitation();
    const currentUserEmail = this.authService.currentUser()?.email;
    if (!invitation || !currentUserEmail) {
      return false;
    }
    return invitation.invitedEmail.toLowerCase() !== currentUserEmail.toLowerCase();
  });
  readonly canRegister = computed(() => {
    const invitation = this.invitation();
    return (
      !!invitation &&
      !this.loggedIn() &&
      !this.alreadyClaimed() &&
      invitation.status !== ExternalInvitationStatus.CANCELLED
    );
  });
  readonly canLogin = computed(() => {
    return !this.loggedIn() && this.alreadyClaimed();
  });

  ngOnInit(): void {
    this.loadInvitation();
  }

  loadInvitation() {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.error.set(this.translate.instant('externalInvitation.invalidInvitation'));

      this.loading.set(false);

      return;
    }

    this.externalInvitationsService.getExternalInvitationPreview(token).subscribe({
      next: (response) => {
        const invitation = response.data;

        this.invitation.set(invitation);

        if (
          this.loggedIn() &&
          invitation.alreadyClaimed &&
          invitation.invitedEmail.toLowerCase() ===
            this.authService.currentUser()?.email?.toLowerCase()
        ) {
          this.router.navigate(['/events', invitation.eventId]);

          return;
        }

        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(
          error?.error?.message || this.translate.instant('externalInvitation.notAvailable'),
        );
        this.loading.set(false);
      },
    });
  }

  goToLogin() {
    const token = this.route.snapshot.paramMap.get('token');

    this.router.navigate(['/login'], {
      queryParams: {
        redirect: `/invite/${token}`,
      },
    });
  }

  goToRegister() {
    const token = this.route.snapshot.paramMap.get('token');

    this.router.navigate(['/register'], {
      queryParams: {
        redirect: `/invite/${token}`,
      },
    });
  }
}
