import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { XTenantId, baseUrl } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  headers: HttpHeaders;

  private url = `http://${baseUrl.ip}:8081/api/v1`;
  // private url=`http://192.168.1.117:8081/api/v1`;

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

      // Show a message to the user to re-login
      //   this.dialog.open(LoginDialogComponent, {
      //     data: { message: 'Your session has expired. Please log in again.' }
      //   });
    }
  }

  // getRoleDeatils
  getCategory() {
    return this.httpClient
      .get(`${this.url}/category`, { headers: this.headers })
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
  getCategoryExcludingCurrentCategory(id) {
    return this.httpClient
      .get(`${this.url}/category/parent-category/${id}`, {
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

  // create Role
  createCategory(postData) {
    return this.httpClient
      .post(`${this.url}/category`, postData, { headers: this.headers })
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

  // inactive to active
  inactiveToActive(id) {
    return this.httpClient
      .post(
        `${this.url}/category/${id}/activate`,
        {},
        { headers: this.headers }
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          return result;
        })
      );
  }

  activeToInActive(id) {
    return this.httpClient
      .post(
        `${this.url}/category/${id}/deactivate`,
        {},
        { headers: this.headers }
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  // update Role
  updateCategory(id, postData) {
    return this.httpClient
      .put(`${this.url}/category/${id}`, postData, { headers: this.headers })
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
        `${this.url}/category/bulk-activate?id=${id}`,
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
        `${this.url}/category/bulk-de-activate?id=${id}`,
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

  // categoryCode error getapi
  getCategoryCodeError(categoryCode) {
    return this.httpClient
      .get(`${this.url}/category/category-code/${categoryCode}`, {
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
}
