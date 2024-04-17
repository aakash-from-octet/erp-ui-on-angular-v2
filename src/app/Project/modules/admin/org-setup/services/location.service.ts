import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { XTenantId, baseUrl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
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

  // getLocationDeatils
  getLocation() {
    return this.httpClient
      .get(`${this.url}/locations`, { headers: this.headers })
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

  createLocation(postData) {
    return this.httpClient
      .post(`${this.url}/locations`, postData, { headers: this.headers })
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

  // update location

  updateLocation(id, PostData) {
    return this.httpClient
      .put(`${this.url}/locations/${id}`, PostData, { headers: this.headers })
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
        `${this.url}/locations/${id}/activate`,
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
        `${this.url}/locations/${id}/deactivate`,
        {},
        { headers: this.headers }
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  getGlobalcurrency() {
    return this.httpClient
      .get(`${this.url}/currencies`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error');
          }
        })
      );
  }

  getLocationTypeApi() {
    return this.httpClient
      .get(`${this.url}/location_types`, { headers: this.headers })
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
        `${this.url}/locations/bulk-activate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  // bulkAction De-activate
  bulkActionDeActive(id) {
    return this.httpClient
      .post(
        `${this.url}/locations/bulk-de-activate?id=${id}`,
        {},
        { headers: this.headers }
      )
      .pipe(
        map((result) => {
          return result;
        })
      );
  }

  // getLocationCode Already Present Api

  getLocationCodeError(locationCode) {
    return this.httpClient
      .get(`${this.url}/locations/location-code/${locationCode}`, {
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
}
