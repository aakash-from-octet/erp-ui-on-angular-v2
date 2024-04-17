import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { XTenantId, baseUrl } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FacilitiesService {
  private url = `http://${baseUrl.ip}:8081/api/v1`;
  headers: HttpHeaders;
  constructor(private httpClient: HttpClient) {
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

  getfacilitiesList() {
    return this.httpClient
      .get(`${this.url}/facilities`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getfacilitiesList');
          }
        })
      );
  }

  getfacilitiesType() {
    return this.httpClient
      .get(`${this.url}/facility_types`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result;
          } else {
            alert('error getfacilitiesType');
          }
        })
      );
  }

  getLocationList() {
    return this.httpClient
      .get(`${this.url}/locations`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getLocationList');
          }
        })
      );
  }

  createFacility(postData) {
    return this.httpClient
      .post(`${this.url}/facilities`, postData, { headers: this.headers })
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

  updateFacilityList(id, postData) {
    return this.httpClient
      .put(`${this.url}/facilities/${id}`, postData, { headers: this.headers })
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

  activeToInActive(id) {
    return this.httpClient
      .post(
        `${this.url}/facilities/${id}/deactivate`,
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

  inactiveToActive(id) {
    return this.httpClient
      .post(
        `${this.url}/facilities/${id}/activate`,
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

  getOrgFacilities() {
    return this.httpClient
      .get(`${this.url}/facilities/org`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getfacilitiesList');
          }
        })
      );
  }

  getFacilitiesWithVendorId(id) {
    return this.httpClient
      .get(`${this.url}/facilities/vendor/${id}`, { headers: this.headers })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((result: any) => {
          if (result) {
            return result.data;
          } else {
            alert('error getfacilitiesList');
          }
        })
      );
  }

  // bulkAction Active

  bulkActionActive(id) {
    return this.httpClient
      .post(
        `${this.url}/facilities/bulk-activate?id=${id}`,
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

  // bulkAction De-activate
  bulkActionDeActive(id) {
    return this.httpClient
      .post(
        `${this.url}/facilities/bulk-de-activate?id=${id}`,
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

  // getFacilitieCode Already Present Api

  getFacilitieCodeError(facilitiesCode) {
    return this.httpClient
      .get(`${this.url}/facilities/facility-code/${facilitiesCode}`, {
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
