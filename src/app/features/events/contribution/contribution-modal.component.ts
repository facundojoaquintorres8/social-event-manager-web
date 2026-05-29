import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contribution, CreateContributionRequest } from '../../../core/models/event.model';

@Component({
  selector: 'app-contribution-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contribution-modal.component.html',
})
export class ContributionModalComponent implements OnChanges {
  @Input() open = false;

  @Input() loading = false;

  @Input() contribution: Contribution | null = null;

  @Output() modalClosed = new EventEmitter<void>();

  @Output() submitContribution = new EventEmitter<CreateContributionRequest>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(255)]],
    cost: this.fb.control<number | null>(null),
    splitCost: [false],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contribution']) {
      if (this.contribution) {
        this.form.patchValue({
          name: this.contribution.name,
          description: this.contribution.description ?? '',
          cost: this.contribution.cost ?? null,
          splitCost: this.contribution.splitCost,
        });
      } else {
        this.form.reset({
          name: '',
          description: '',
          cost: null,
          splitCost: false,
        });
      }
    }
  }

  onClose() {
    if (this.loading) {
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
}
