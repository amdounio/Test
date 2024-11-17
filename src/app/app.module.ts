import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbAccordionModule, NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/public/login/login.component';
import { GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { LandingComponent } from './modules/public/landing/landing.component';
import { FeaturesComponent } from './modules/public/features/features.component';
import { PlansComponent } from './modules/public/plans/plans.component';
import { FaqComponent } from './modules/public/faq/faq.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { SideMenuComponent } from './core/layout/side-menu/side-menu.component';
import { DashboardComponent } from './modules/private/dashboard-v/dashboard.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { googleClientId } from './shared/constant';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    FeaturesComponent,
    PlansComponent,
    FaqComponent,
    HeaderComponent,
    SideMenuComponent,
    DashboardComponent,
    NotificationComponent

    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleSigninButtonModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      toastComponent: NotificationComponent
    }),
    NgbModule
  ],
  providers: [
    provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false, // optional, default is false
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(googleClientId), // Replace with your Google Client ID
          },
        ],
        onError: (err: any) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    SocialAuthService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
