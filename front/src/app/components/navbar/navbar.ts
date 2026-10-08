import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive], // <-- Imports indispensables pour la navigation
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss' // Pensez bien au .scss !
})
export class NavbarComponent {
  // Pas de logique complexe nécessaire ici pour le moment
}


