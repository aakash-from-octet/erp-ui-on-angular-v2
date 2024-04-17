import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { map } from 'rxjs';
import { XTenantId, baseUrl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RolePermissionsService {
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
        'X-Tenant-ID': XTenantId.XTenantId,
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

  // get roles api
  getRole() {
    return this.httpClient
      .get(`${this.url}/roles/is-active`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          } else {
            alert('error');
          }
        })
      );
  }

  getRoleMenuLevel(id) {
    return this.httpClient
      .get(`${this.url}/role-permission/${id}`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          } else {
            alert('error');
          }
        })
      );
  }

  saveRoleMenuLevel(id, postData) {
    return this.httpClient
      .put(`${this.url}/role-permission/${id}`, postData, {
        headers: this.headers,
      })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          } else {
            alert('error');
          }
        })
      );
  }

  createNotification(type: string, data): void {
    this.notification.create(type, data, ' ' + '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }
}
