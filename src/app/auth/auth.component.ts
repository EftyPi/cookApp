import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from './auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

    isLoginMode = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService,
                private router: Router) { }

    ngOnInit(): void {
    }

    onSwitchMode(): void {
        this.isLoginMode = !this.isLoginMode;
    }

    onSumbit(form: NgForm): void {
        // console.log(form.value);
        if (!form.valid){
            return;
        }
        this.isLoading = true;

        const userEmail = form.value.email;
        const userPassword = form.value.password;

        let authObs: Observable<AuthResponseData>;

        if (this.isLoginMode){
            authObs = this.authService.login(userEmail, userPassword);
        } else {
            authObs = this.authService.signup(userEmail, userPassword);
        }

        // subscribe to the response
        authObs.subscribe(responseData => {
            console.log(responseData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            this.error = errorMessage;
            this.isLoading = false;
        });

        form.reset();
    }

    onErrorHandled(): void {
        this.error = null;
    }
}
