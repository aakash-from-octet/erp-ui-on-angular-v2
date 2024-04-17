import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { XTenantId, baseUrl } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  headers: HttpHeaders;

  private url = `http://${baseUrl.ip}:8081/api/v1`;

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService
  ) {
    // Retrieve the Keycloak token from localStorage
    const keycloakToken = localStorage.getItem('keycloakToken');
    //  const tenantId = 'godrej';

    if (keycloakToken) {
      // If token is available, set it in the headers
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${keycloakToken}`,
        'X-Tenant-Id': XTenantId.XTenantId,
      });
    } else {
      // If token is not available, initialize headers without Authorization

      this.headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      // Show a message to the user to re-login
      //   this.dialog.open(LoginDialogComponent, {
      //     data: { message: 'Your session has expired. Please log in again.' }
      //   });
    }
  }

  private handleError(error: HttpErrorResponse) {
    this.createNotification('error', error?.error?.message);
  }

  // organisation apis

  getOrganisation() {
    return this.httpClient
      .get(`${this.url}/organizations`, { headers: this.headers })
      .pipe(
        map((result) => {
          if (result) {
            return result;
          }
          return null;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateOrganization(data, id, logofile) {
    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );
    formData.append('logoFile', logofile);
    const keycloakToken = localStorage.getItem('keycloakToken');
    const uploadHeaders = new HttpHeaders({
      'X-Tenant-Id': XTenantId.XTenantId,
      Authorization: `Bearer ${keycloakToken}`,
    });
    return this.httpClient
      .put(`${this.url}/organizations/${id}`, formData, {
        headers: uploadHeaders,
      })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // currency
  getGlobalcurrency() {
    return this.httpClient
      .get(`${this.url}/currencies`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // getLogoapi
  getLogo(id) {
    return this.httpClient
      .get(`${this.url}/organizations/logo?id=${id}`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // getById
  getByIdView(id) {
    return this.httpClient
      .get(`${this.url}/organizations/${id}`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          }
        })
      );
  }

  // Notification Method
  createNotification(type: string, data): void {
    this.notification.create(type, data, '' + '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }
}
