import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { XTenantId, baseUrl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UiCommonService {
  private windowWidthSubject = new BehaviorSubject<number>(window.innerWidth);
  headers: HttpHeaders;
  private url = `http://${baseUrl.ip}:8081/api/v1`;

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService
  ) {
    window.addEventListener('resize', () => {
      this.windowWidthSubject.next(window.innerWidth);
    });
    const keycloakToken = localStorage.getItem('keycloakToken');

    if (keycloakToken) {
      this.headers = new HttpHeaders({
        'X-Tenant-Id': XTenantId.XTenantId,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloakToken}`,
      });
    } else {
      // If token is not available, initialize headers without Authorization

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }
  }

  private handleError(error: HttpErrorResponse) {
    this.createNotification('error', error?.error?.message);
  }

  getWindowWidth(): Observable<number> {
    return this.windowWidthSubject.asObservable();
  }

  getMenuList() {
    return this.httpClient
      .get(`${this.url}/role-permission`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          } else {
            alert('error');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createNotification(type: string, data): void {
    this.notification.create(type, data, ' ' + '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }
}
