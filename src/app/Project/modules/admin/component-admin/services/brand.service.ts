//import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, throwError } from 'rxjs';
import { XTenantId, baseUrl } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class BrandService {
  headers: HttpHeaders;
  private url = `http://${baseUrl.ip}:8081/api/v1`;
  notification;

  constructor(private httpClient: HttpClient) {
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

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    }
    if (error.status === 200) {
      errorMessage = error.error.message;
      return of(error.error);
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    if (error.status === 400) {
      errorMessage = error.error.message;
      this.createNotification('error', error?.error?.message);
      return of(error.error.message);
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // getRoleDeatils
  getBrand() {
    return this.httpClient
      .get(`${this.url}/brand`, { headers: this.headers })
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
  getBrandExcludingCurrentBrand(id) {
    return this.httpClient
      .get(`${this.url}/brand/parent-brand/${id}`, { headers: this.headers })
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

  // create Role
  createBrand(postData) {
    return this.httpClient
      .post(`${this.url}/brand`, postData, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          }
        }),
        catchError(this.handleError)
      );
  }

  // inactive to active
  inactiveToActive(id) {
    return this.httpClient
      .post(`${this.url}/brand/${id}/activate`, {}, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          return result;
        })
      );
  }

  activeToInActive(id) {
    return this.httpClient
      .post(`${this.url}/brand/${id}/deactivate`, {}, { headers: this.headers })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  // update Role
  updateBrand(id, postData) {
    return this.httpClient
      .put(`${this.url}/brand/${id}`, postData, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result?.statuscode === 200) {
            return result;
          } else {
            alert(result?.message);
          }
        })
      );
  }

  // bulkAction Active

  bulkActionActive(id) {
    return this.httpClient
      .post(
        `${this.url}/brand/bulk-activate?id=${id}`,
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
        `${this.url}/brand/bulk-de-activate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  // getlogoapi
  getLogo(id) {
    return this.httpClient
      .get(`${this.url}/brand/logo?id=${id}`, { headers: this.headers })
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
      .post(`${this.url}/brand`, formData, { headers: uploadHeaders })
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

  // brand code error getapi
  getBrandCodeError(brandCode) {
    return this.httpClient
      .get(`${this.url}/brand/brand-code/${brandCode}`, {
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
        // catchError(this.handleError.bind(this))
      );
  }

  createNotification(type: string, data): void {
    this.notification.create(type, data, '' + '', {
      nzPlacement: 'bottomRight',
      nzDuration: 3000,
    });
  }
}
