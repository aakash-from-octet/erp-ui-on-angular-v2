export const environment = {
  production: false, // Set to true for production
  keycloakUrl: 'http://35.154.250.39:8080/', // Update with your Keycloak URL
};

export const XTenantId = {
  XTenantId: 'unilever',
};

export const baseUrl = {
  ip: '35.154.250.39',
  //ip:'192.168.1.14',
  port: '8081',
};

export const regex = {
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  mobile: /^(\+\d{1,3}[\s-]?)?(\d{1,4}[\s-]?){1,5}$/,
};
