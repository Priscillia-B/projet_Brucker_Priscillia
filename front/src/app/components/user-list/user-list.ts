import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../services/user';
import { User } from '../../models/user';
import { confirmDelete, showError } from '../../utils/alerts';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);

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

  async deleteUser(user: User) {
    if (!(await confirmDelete(`Supprimer le compte de ${user.prenom} ${user.nom} ?`))) return;

    this.userService.deleteUser(user.id).subscribe({
      next: () => this.users.update(list => list.filter(u => u.id !== user.id)),
      error: () => void showError('La suppression a échoué.')
    });
  }
}
