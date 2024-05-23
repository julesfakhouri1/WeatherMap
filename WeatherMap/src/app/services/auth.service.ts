import { Injectable } from '@angular/core';
import {Auth, signInWithPopup, signOut, user} from '@angular/fire/auth';
import { GoogleAuthProvider } from 'firebase/auth'; // Importation depuis 'firebase/auth'
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  signOut() {
    return signOut(this.auth);
  }

  isLoggedIn(): Promise<boolean> {
    return firstValueFrom(user(this.auth)).then(u => !!u);
  }
}
