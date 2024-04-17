export const environment = {
  production: false, // Set to true for production
  keycloakUrl: 'http://35.154.250.39:8080/', // Update with your Keycloak URL
};

export const baseUrl = {
  ip: '35.154.250.39',
  port: '8081',
};

export const XTenantId = {
  XTenantId: 'unilever',
};

export const regex = {
  email:/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  mobile: /^\+91\s*-?\s*\d{7,}$/,
};
