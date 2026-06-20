import { Component, effect, HostListener, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contribution, CreateContributionRequest } from '../../../core/models/event.model';

@Component({
  selector: 'app-contribution-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contribution-modal.component.html',
})
export class ContributionModalComponent {
  readonly loading = input(false);
  readonly contribution = input<Contribution | null>(null);

  readonly modalClosed = output<void>();
  readonly submitContribution = output<CreateContributionRequest>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    cost: this.fb.control<number | null>(null),
    splitCost: [false],
  });

  constructor() {
    effect(() => {
      const contribution = this.contribution();
      if (contribution) {
        this.form.patchValue({
          name: contribution.name,
          description: contribution.description ?? '',
          cost: contribution.cost ?? null,
          splitCost: contribution.splitCost,
        });
      } else {
        this.form.reset({
          name: '',
          description: '',
          cost: null,
          splitCost: false,
        });
      }
    });
  }

  onClose() {
    if (this.loading()) {
      return;
    }

    this.modalClosed.emit();
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const value = this.form.getRawValue();

    this.submitContribution.emit({
      name: value.name.trim(),
      description: value.description?.trim() || '',
      cost: value.cost,
      splitCost: value.splitCost ?? false,
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (!this.loading()) this.onClose();
  }
}
