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
export class UserService {
  headers: HttpHeaders;

  private url = `http://${baseUrl.ip}:8081/api/v1`;

  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService
  ) {
    // Retrieve the Keycloak token from localStorage
    const keycloakToken = localStorage.getItem('keycloakToken');

    if (keycloakToken) {
      // If token is available, set it in the headers
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

  getUsersList() {
    return this.httpClient
      .get(`${this.url}/user`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getUsersList');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getUserById(id) {
    return this.httpClient
      .get(`${this.url}/user/${id}`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          } else {
            alert('error getUsersList');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createUser(postData) {
    return this.httpClient
      .post(`${this.url}/user`, postData, { headers: this.headers })
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

  updateUser(id, postData) {
    return this.httpClient
      .put(`${this.url}/user/${id}`, postData, { headers: this.headers })
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
  updateUserWithLogo(id, data, logofile: File) {
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
      .put(`${this.url}/user/${id}`, formData, { headers: uploadHeaders })
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

  getRoles() {
    return this.httpClient
      .get(`${this.url}/roles`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getUsersList');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getGlobalCurrency() {
    return this.httpClient
      .get(`${this.url}/currencies`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getUsersList');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getLocations() {
    return this.httpClient
      .get(`${this.url}/locations/hierarchical`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getUsersList');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getBrands() {
    return this.httpClient
      .get(`${this.url}/brand/hierarchical`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error Brands');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getCategory() {
    return this.httpClient
      .get(`${this.url}/category/hierarchical`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error categoryList');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  activeToInActive(id) {
    return this.httpClient
      .post(
        `${this.url}/user/deactivate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          return result;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  inactiveToActive(id) {
    return this.httpClient
      .post(`${this.url}/user/activate?id=${id}`, {}, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          return result;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getBlob() {
    return this.httpClient.get(`${this.url}/user/export`, {
      headers: this.headers,
      responseType: 'blob',
    });
  }

  // getlogoapi
  getLogo(id) {
    return this.httpClient
      .get(`${this.url}/user/logo?id=${id}`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // uploadlogoapi
  uploadLogo(data, logofile) {
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
      .post(`${this.url}/user`, formData, { headers: uploadHeaders })
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
    this.notification.create(type, data, '' + '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }
  getActiveUsersList() {
    return this.httpClient
      .get(`${this.url}/user/active`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getUsersList');
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getUserCodeError(userCode) {
    return this.httpClient
      .get(`${this.url}/user/user-code/${userCode}`, { headers: this.headers })
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
}
