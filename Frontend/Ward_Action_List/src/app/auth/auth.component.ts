import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode: Boolean = true;
  isLoading: Boolean = false;
  error: string | null = null;

  
  constructor(private authService: AuthService, private router:Router) { }
  
  ngOnInit(): void {
  }
  
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  
  onSubmit(form: NgForm) {
    //if form not valid, do nothing
    if (!form.valid) {
      return;
    }
    //Create observable
    let authObs: Observable<AuthResponseData>;

    //get values from form
    const email = form.value.email;
    const password = form.value.password;

    //Spinner if loading is taking some time
    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
    }
    else {
      authObs = this.authService.signup(email, password)
    }
     authObs.subscribe(resData => {
      this.router.navigate(['/ward-view']);
    }, errorMessgae => {
      this.error = errorMessgae;
    });

    this.isLoading = false;
    form.reset();
  }

}
