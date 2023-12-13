import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../../core/authentication/auth.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  login(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      // Perform login logic here using formData.email and formData.password
      console.log(formData); // For demonstration, log the form data
      // Call the AuthService's login method with provided email and password
        this.authService.login(formData.email, formData.password).subscribe(() => {
          // Redirect to a specific page after successful login
          this.router.navigate(['/']); // Replace '/dashboard' with your desired route
        }, (error) => {
        // Handle login errors here, e.g., display error message
        console.error('Login failed:', error);
      });
    } else {
      // Handle form errors or display messages to the user
      // You can access specific form controls' errors using this.loginForm.get('controlName').errors
    }

  }
}

