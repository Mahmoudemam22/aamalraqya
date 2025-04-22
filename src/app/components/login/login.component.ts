import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  remember_me = true;
  csrfToken = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http
      .get<any>('https://digital-business.com/useraccount/csrf_token/', {
        withCredentials: true,
      })
      .subscribe({
        next: (result) => {
          console.log('CSRF Token Response:', result);
          this.csrfToken = result.csrfToken;
          if (!this.csrfToken) {
            console.error('CSRF token is missing or invalid');
            return;
          }
          console.log('CSRF Token:', this.csrfToken);
          const body = {
            username: this.username,
            password: this.password,
            remember_me: this.remember_me,
          };
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRFToken': this.csrfToken,
          });
          this.http
            .post<any>(
              'https://digital-business.com/useraccount/login_api/',
              body,
              {
                headers,
                withCredentials: true,
              }
            )
            .subscribe({
              next: (res) => {
                console.log('Login API Response:', res);
                if (res.success) {
                  this.router.navigate(['/home']);
                } else {
                  console.error('Login failed: ' + res.message);
                }
              },
              error: (err) => {
                console.error('Login API Error:', err);
              },
            });
        },
        error: (err) => {
          console.error('CSRF Token Error:', err);
        },
      });
  }
}
