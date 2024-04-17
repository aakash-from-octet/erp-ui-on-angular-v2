import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicConfigServiceService {
  private subdomain!: string;
  getSubdomain(): string {
    return this.subdomain;
  }


  fetchSubdomain(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // Logic to fetch the subdomain
      // You can use window.location or any other method to extract the subdomain
      const subdomain = window.location.hostname.split('.')[0]; // Example: subdomain.yourdomain.com
      if (subdomain) {
        this.subdomain = subdomain;
        resolve(subdomain);
      } else {
        reject('Subdomain not found');
      }
    });
  }
}
