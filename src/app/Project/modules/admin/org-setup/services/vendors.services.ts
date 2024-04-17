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
export class vendorService {
  headers: HttpHeaders;
  private url = `http://${baseUrl.ip}:8081/api/v1`;

  // private url = `${environment.ApiUrl}`;
  constructor(
    private httpClient: HttpClient,
    private notification: NzNotificationService
  ) {
    // Retrieve the Keycloak token from localStorage
    const keycloakToken = localStorage.getItem('keycloakToken');

    if (keycloakToken) {
      // alert("working")
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

  // private handleError(error: HttpErrorResponse) {
  //   let errorMessage = 'Unknown error occurred';
  //   if (error.error instanceof ErrorEvent) {
  //     errorMessage = `Error: ${error.error.message}`;
  //   } else {
  //     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  //   }
  //   if(error.status === 400){
  //     errorMessage = error?.error?.message
  //     this.createNotification('error',errorMessage)
  //   }else if (error.status === 404) {
  //     errorMessage = 'Resource Not Found';
  //     this.createNotification('error',errorMessage)
  //   }
  //   console.error(errorMessage);
  //   throwError(() => new Error(errorMessage));
  // }
  private handleError(error: HttpErrorResponse) {
    this.createNotification('error', error?.error?.message);
  }

  getVendorList() {
    return this.httpClient
      .get(`${this.url}/vendors`, { headers: this.headers })
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

  getVendorById(vendorId) {
    return this.httpClient
      .get(`${this.url}/vendors/${vendorId}`, { headers: this.headers })
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

  createVendor(postData) {
    return this.httpClient
      .post(`${this.url}/vendors`, postData, { headers: this.headers })
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

  activeToInActive(id) {
    return this.httpClient
      .post(
        `${this.url}/vendors/${id}/deactivate`,
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
      .post(`${this.url}/vendors/${id}/activate`, {}, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          return result;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateVendorList(data, id, logofile) {
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
      .put(`${this.url}/vendors/${id}`, formData, { headers: uploadHeaders })
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

  // getVendorCode Already Present Api

  getVendorCodeError(vendorCode) {
    return this.httpClient
      .get(`${this.url}/vendors/vendor-code/${vendorCode}`, {
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
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // bulkAction Active

  bulkActionActive(id) {
    return this.httpClient
      .post(
        `${this.url}/vendors/bulk-activate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result:any) => {
          return result;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // bulkAction De-activate
  bulkActionDeActive(id) {
    return this.httpClient
      .post(
        `${this.url}/vendors/bulk-de-activate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result:any) => {
          return result;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  // getlogoapi
  getLogo(id) {
    return this.httpClient
      .get(`${this.url}/vendors/logo?id=${id}`, { headers: this.headers })
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
      .post(`${this.url}/vendors`, formData, { headers: uploadHeaders })
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

  // getById
  getByIdView(id) {
    return this.httpClient
      .get(`${this.url}/vendors/${id}`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
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
