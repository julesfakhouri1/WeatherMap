import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router) {}

  googleSignIn() {
    this.authService.googleSignIn().then(() => {
      // Redirigez l'utilisateur vers la page d'accueil après la connexion
      this.router.navigate(['/home']);
    }).catch(error => {
      console.error('Erreur de connexion:', error);
    });
  }
}
