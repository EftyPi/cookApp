import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient,
                private router: Router) {}

    // store the new user in the database
    signup(userEmail: string, userPassword: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDu5WHseaTvKsua5CW1P8UU35pmEGJkvqk',
            {
                email: userEmail,
                password: userPassword,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            }));
    }

    // checks if the user exists in the database before logging in
    login(userEmail: string, userPassword: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDu5WHseaTvKsua5CW1P8UU35pmEGJkvqk',
            {
                email: userEmail,
                password: userPassword,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            }));
    }

    logout(): void {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin(): void {
        const userData: {
            email: string;
            id: string;
            _token: string
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            // if a user does not exist
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }


    private handleError(errorResponse: HttpErrorResponse): Observable<never> {
        let errorMsg = 'An error occurred';
        if (!errorResponse.error || !errorResponse.error.error){
            return throwError(errorMsg);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMsg = 'This user already exists.';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMsg = 'This operation is not allowed.';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMsg = 'Too many attempts. Please try again later.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMsg = 'This user does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMsg = 'The email or password is wrong.';
                break;
            case 'USER_DISABLED':
                errorMsg = 'The user is not authorized.';
                break;
            default:
                break;
        }
        return throwError(errorMsg);
    }

    private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number): void {
        // current time is in ms hence * 1000 to convert it to ms
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(email, localId, idToken, expirationDate);
        // set this as the current logged in user
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        // store the user to remain login when the page refreshes and its token has not expired yet
        localStorage.setItem('userData', JSON.stringify(user));
    }

}
