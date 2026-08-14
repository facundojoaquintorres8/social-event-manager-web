import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreatePreferenceResponse } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}payments`;

  createPreference(): Observable<ApiResponse<CreatePreferenceResponse>> {
    return this.http.post<ApiResponse<CreatePreferenceResponse>>(
      `${this.url}/create-preference`,
      {},
    );
  }
}
