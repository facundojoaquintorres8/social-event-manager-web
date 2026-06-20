import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  private readonly labels: Record<string, string> = {
    ACTIVE: 'Active',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    CLAIMED: 'Claimed',
  };

  transform(value: string): string {
    return this.labels[value] ?? value;
  }
}
