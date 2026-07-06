import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-card-skeleton',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-card-skeleton.component.html',
})
export class EventCardSkeletonComponent {
  count = input<number>(3);
  variant = input<'default' | 'invitations'>('default');

  items = computed(() => Array.from({ length: this.count() }));
}
