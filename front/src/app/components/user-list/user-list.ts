import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  readonly auth = inject(AuthService);

  users = signal<User[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les utilisateurs.');
        this.isLoading.set(false);
      }
    });
  }
}
