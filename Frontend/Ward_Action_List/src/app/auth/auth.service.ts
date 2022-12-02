import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, pipe, Subject, tap } from 'rxjs';
import { throwError } from 'rxjs';
import { AuthUser } from './user.model';


export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router:Router) { }

  user = new BehaviorSubject<AuthUser | null>(null);
  private tokenExpirationTimer: any;

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCIPCiMoWv7_bFoTU44V4rL-c4vZfK8C5c',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(catchError(errorRes => {
        let errorMessage = 'An unkown error occured';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_NOT_FOUND':
          case 'INVALID_PASSWORD':
            errorMessage = 'The username or email is incorrect';
            break;
          case 'USER_DISABLED':
            errorMessage = 'This user has been disabled';
            break;
        }
        return throwError(errorMessage);
      }), tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      }))
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCIPCiMoWv7_bFoTU44V4rL-c4vZfK8C5c',
      {
        email: email,
        password: password,
        returnSecureToken: true,
      }).pipe(catchError(errorRes => {
        let errorMessage = 'An unknown error occured';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = "The email already exists";
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = "The operation is not allowed";
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER:':
            errorMessage = "Too many attempts, try again later";
            break;
        }
        return throwError(errorMessage);
      }),
      tap(resData => {
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
      }));
    }

    logout(){
      this.user.next(null);
      this.router.navigate(['']);
      localStorage.removeItem('userData');
      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = null;
    }

    autoLogin(){
      const userData = localStorage.getItem('userData');
      if(!userData){
        return;
      }
      else{
        const UserObjData: {
          email: string,
          id : string,
          _token: string,
          _tokenExpirationDate: string
        } = JSON.parse(userData);

        const loadedUser = new AuthUser(UserObjData.email, UserObjData.id, UserObjData._token, new Date(UserObjData._tokenExpirationDate));
        if(loadedUser.token){
          this.user.next(loadedUser);
          this.autoLogout(new Date(UserObjData._tokenExpirationDate).getTime() - new Date().getTime())
        }
      }
    }

    autoLogout(expirationDuration:number){
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, expirationDuration);
    }

    private handleAuthentication(email:string, localId: string ,token:string, expiresIn:number){
      const expDate = new Date(new Date().getTime() + expiresIn * 1000);
        const newUser = new AuthUser(email, localId, token, expDate);
        this.user.next(newUser);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(newUser));
    }
}
