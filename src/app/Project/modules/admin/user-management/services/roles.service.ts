import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map } from 'rxjs';
import { XTenantId, baseUrl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
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
  // getRoleDeatils
  getRole() {
    return this.httpClient
      .get(`${this.url}/roles`, { headers: this.headers })
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

  // create Role
  createRole(postData) {
    return this.httpClient
      .post(`${this.url}/roles`, postData, { headers: this.headers })
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

  // inactive to active
  inactiveToActive(id) {
    return this.httpClient
      .post(`${this.url}/roles/${id}/activate`, {}, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          return result;
        })
      );
  }

  activeToInActive(id) {
    return this.httpClient
      .post(`${this.url}/roles/${id}/deactivate`, {}, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          return result;
        })
      );
  }

  // update Role
  updateRole(id, postData) {
    return this.httpClient
      .put(`${this.url}/roles/${id}`, postData, { headers: this.headers })
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

  // bulkAction Active

  bulkActionActive(id) {
    return this.httpClient
      .post(
        `${this.url}/roles/bulk-activate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result:any) => {
          return result;
        })
      );
  }

  // bulkAction De-activate
  bulkActionDeActive(id) {
    return this.httpClient
      .post(
        `${this.url}/roles/bulk-de-activate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result:any) => {
          return result;
        })
      );
  }

  // getFacilitieCode Already Present Api

  getRoleCodeError(roleCode) {
    return this.httpClient
      .get(`${this.url}/roles/role-code/${roleCode}`, { headers: this.headers })
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
