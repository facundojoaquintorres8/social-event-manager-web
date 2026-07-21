import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'statusLabel',
  standalone: true,
  pure: false,
})
export class StatusLabelPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(value: string): string {
    return this.translate.instant(`status.${value}`) ?? value;
  }
}
