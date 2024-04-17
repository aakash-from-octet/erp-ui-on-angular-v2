import { APP_INITIALIZER, NgModule } from '@angular/core';

import {
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { environment } from 'src/environments/environment';
import { DynamicConfigServiceService } from './Project/shared/services/dynamic-config-service.service';
import { UiCommonService } from './Project/shared/services/ui-common/ui-common.service';
import { ShareModule } from './Project/shared/share/share.module';
import * as appStore from './Project/store/app.state';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

registerLocaleData(en);
export function initializeKeycloak(
  keycloak: KeycloakService,
  dynamic: DynamicConfigServiceService
) {
  return () =>
    dynamic
      .fetchSubdomain()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((subdomain) => {
        const keycloakConfig = {
          url: environment.keycloakUrl,
          realm: 'unilever',
          clientId: 'angular-' + 'unilever',
        };
        return keycloak
          .init({
            config: keycloakConfig,
            initOptions: {
              onLoad: 'login-required',
              flow: 'standard',
            },
          })
          .then((authenticated) => {
            if (authenticated) {
              // Keycloak is initialized and user is authenticated
              // Store the token in localStorage
              keycloak.getToken().then((token) => {
                localStorage.setItem('keycloakToken', token);
              });
            } else {
              console.log('User is not authenticated');
            }
          });
      })
      .catch((error) => {
        console.error('Error fetching subdomain:', error);
        // Handle error or initialize Keycloak with default values
        return keycloak.init(); // Initialize Keycloak with default values
      });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ShareModule,
    StoreModule.forRoot(appStore.appReducer),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([]),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NZ_I18N, useValue: en_US },
    DynamicConfigServiceService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, DynamicConfigServiceService],
    },
    UiCommonService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(public dynamic: DynamicConfigServiceService) {}
}
