import { Component, OnInit } from '@angular/core';
import {
  GetUserResponse,
  UserData,
} from '../../../interfaces/manage-users.interface';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { PageEvent } from '@angular/material/paginator';
import { UserDeleteConfirmationComponent } from './user-delete-confirmation/user-delete-confirmation.component';
import { AdminService } from '../../../services/admin/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserManageNotificationComponent } from './user-manage-notification/user-manage-notification.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss',
})
export class ManageUsersComponent implements OnInit {
  usersData!: UserData[];
  displayedColumns: string[] = [
    'username',
    'fullName',
    'phoneNumber',
    'email',
    'roleName',
    'edit/delete',
  ];
  length!: number;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  constructor(
    private readonly dialog: MatDialog,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.adminService.usersData$.subscribe((res: GetUserResponse) => {
      this.usersData = res.users;
      this.length = res.count;
      this.pageIndex = res.thisPage;
    });

    this.adminService.notification$.subscribe((data) => {
      this._snackBar.openFromComponent(UserManageNotificationComponent, {
        data: data.message,
        panelClass: data.status
          ? ['notification-class-success']
          : ['notification-class-danger'],
        duration: 2000,
      });

      if (data.status) {
        this.dialog.closeAll();
      }
    });

    this.adminService.getUsers(this.pageSize, this.pageIndex);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.length = e.length;
    this.adminService.getUsers(e.pageSize, e.pageIndex);
  }

  addUser() {
    this.dialog.open(AddUserComponent, {
      width: '105rem',
      data: {
        pagSize: this.pageSize,
        pageIndex: this.pageIndex,
      },
    });
  }

  editUser(userData: UserData) {
    this.dialog.open(EditUserComponent, {
      width: '105rem',
      data: {
        user: userData,
        pagSize: this.pageSize,
        pageIndex: this.pageIndex,
      },
    });
  }

  deleteUser(userData: UserData) {
    this.dialog.open(UserDeleteConfirmationComponent, {
      width: '22rem',
      data: {
        user: userData,
        pagSize: this.pageSize,
        pageIndex: this.pageIndex,
      },
    });
  }
}
