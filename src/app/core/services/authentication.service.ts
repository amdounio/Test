import { SocialAuthService } from '@abacritt/angularx-social-login';
import { inject, Injectable } from '@angular/core';
import { GoogleOAuthDto } from '../models/google-auth.dto';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { Login } from '../../models/login.model';
import { AuthenticationResponse } from '../../models/auth-response.dto';
import { User } from '../../models/user.model';
import { Role } from '../enums/role.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

declare var AppleID: any;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  tokenExpirationTimer
  $isAuthenticated = new BehaviorSubject<boolean>(false);
  token: string = ''


  constructor(private router: Router, private notificationService: NotificationService, private httpService: HttpService, private socialAuthService: SocialAuthService) {
  }

  login(data: GoogleOAuthDto) {
    this.httpService.post<AuthenticationResponse, GoogleOAuthDto>('auth/login', data).subscribe({
      next: res => {
        this.saveCredentials(res);
        const tokenExpiration = this.getTokenExpiration(res.idToken);
        this.setLogoutTimer(tokenExpiration);
        if (res.newUser) {
          this.router.navigate(['/register/user-description'], { replaceUrl: true });
        }else{
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        }
      },
      error: error => {
        console.error(error);
        this.notificationService.Error('ERROR WHILE login')
      }
    })
  }


  register(data: GoogleOAuthDto) {
    this.httpService.post<AuthenticationResponse, GoogleOAuthDto>('auth/register', data).subscribe({
      next: res => {
        this.saveCredentials(res);
        if (!res.newUser) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.router.navigate(['/register/user-description'], { replaceUrl: true });
        }
      },
      error: error => {
        console.error(error);
        this.notificationService.Error('ERROR WHILE login')
      }
    })
  }


  updateUser(data: User) {
    return this.httpService.put<{user:User}, User>('edit-info/', data);
  }

  getOneObservable(id: any): Observable<User> {
    return this.httpService.getOne<User>('user', id);
  }

  private saveCredentials(authenticationResponse: AuthenticationResponse) {
    console.log(authenticationResponse.user);
    
    localStorage.setItem('user', JSON.stringify(authenticationResponse.user));
    localStorage.setItem('token', authenticationResponse.idToken);
  }

  // updateUserCredentials(user: User) {
  //   localStorage.setItem('user', JSON.stringify(user));
  // }

  redirectToHomePage() {
    this.router.navigate(['/'], { replaceUrl: true });
    return false;
  }

  redirectToResetPasswordPage() {
    this.router.navigate(['/reset-password'], { replaceUrl: true });
    return false;
  }

  logout() {
    localStorage.clear();
    this.socialAuthService.signOut()
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  getUser(): User | null {
    return JSON.parse(localStorage.getItem('user'));
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    return this.getUser() !== null && this.getAccessToken() !== null;
  }



  isADMIN(): boolean {
    const user = this.getUser();
    if (user === undefined || user?.role === undefined) {
      return false;
    }
    return user?.role === Role.ADMIN
  }

  isUser(): boolean {
    const user = this.getUser();
    if (user === undefined || user?.role === undefined) {
      return false;
    }
    return user?.role === Role.USER
  }


  socialAuthInit() {
    this.socialAuthService.authState.subscribe({
      next: (user: GoogleOAuthDto) => {
        if (user) {
          this.login(user)
        }
      },
      error: error => {
        this.notificationService.Error("something went wrong")
      }
    });
  }


  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  public async apple() {
    try {
      console.log(AppleID)
      AppleID.auth.init({
        clientId: 'VRSignIn',
        scope: 'name email',
        redirectURI: 'http://localhost:4200/dashboard',
        state: 'init',
        nonce: 'test',
        usePopup: true //or false defaults to false
      });
      const data = await AppleID.auth.signIn();
      console.log(this.parseJwt(data.authorization.id_token))

    } catch (error) {
      console.log(error)
      //handle error.
    }
  }



  private getTokenExpiration(token: string): number {
    const decodedToken: any = jwtDecode(token); // Decode JWT token
    if (decodedToken.exp === undefined) return null;
    const expirationDate = new Date(0); // Unix epoch
    expirationDate.setUTCSeconds(decodedToken.exp);
    return expirationDate.getTime();
  }

  private setLogoutTimer(expirationTime: number): void {
    const expirationDuration = expirationTime - Date.now();
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  isTokenExpired() {
    if (this.getAccessToken()) {
      const decodedToken = jwtDecode(this.getAccessToken());
      const dateNow = new Date();
      // exp is in seconds, convert it to milliseconds
      if (decodedToken.exp < dateNow.getTime() / 1000) {
        this.logout();  // Call your logout function
      } else {
        this.$isAuthenticated.next(true)
      }
    } else {
      this.logout()
    }

  }


  planSubscription(plan){    
    return this.httpService.post<{url:string},{userId : string}>('subscriptions/subscribe/'+plan,{userId : this.getUser().id})
  }


}
