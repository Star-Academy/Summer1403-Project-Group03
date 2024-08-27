import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category/category.service';
import { CategoryData } from '../../../model/Category';
import { UserManageNotificationComponent } from '../../../../user/components/dashboard/manage-users/user-manage-notification/user-manage-notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cat-delete-confirm',
  template: `
    <h2 mat-dialog-title>Delete User</h2>
    <mat-dialog-content>
      Would you like to delete <b>{{ this.data.category.name }}</b
      >?
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-button
        mat-dialog-close
        cdkFocusInitial
        (click)="deleteUser()"
      >
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class CatDeleteConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected data: {
      category: CategoryData;
      pageSize: number;
      pageIndex: number;
    },
    private categoryService: CategoryService,
    private _snackBar: MatSnackBar,
  ) {}

  deleteUser() {
    this.categoryService.deleteCategory(this.data.category.id).subscribe({
      next: () => {
        console.log(12121212);
        this.categoryService.getCategories(
          this.data.pageSize,
          this.data.pageIndex,
        );
        this._snackBar.openFromComponent(UserManageNotificationComponent, {
          data: 'Category created successfully.',
          panelClass: ['notification-class-success'],
          duration: 2000,
        });
      },
      error: (error) => {
        this._snackBar.openFromComponent(UserManageNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
      },
    });
  }
}
