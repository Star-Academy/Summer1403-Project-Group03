import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { LoadGraphService } from '../../../services/load-graph/load-graph.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from '../../../../shared/services/loading.service';
import { DangerSuccessNotificationComponent } from '../../../../shared/components/danger-success-notification/danger-success-notification.component';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { Account } from '../../../model/graph';
import { debounceTime, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-search-nodes',
  templateUrl: './search-nodes.component.html',
  styleUrl: './search-nodes.component.scss',
})
export class SearchNodesComponent implements AfterViewInit {
  @Output() showGraph = new EventEmitter<Account>();

  searchInput = '';
  accounts: Account[] = [];
  length!: number;
  pageIndex = 0;

  private searchText$ = new Subject<string>();
  nodeName$!: Observable<string>;

  constructor(
    private _snackBar: MatSnackBar,
    private loadGraphService: LoadGraphService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {}

  ngAfterViewInit(): void {
    this.loadGraphService.nodesData$.subscribe({
      next: (data) => {
        this.accounts = data.items;
        this.length = data.totalItems;
        this.pageIndex = data.pageIndex;
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
      },
    });

    this.loadGraphService.getAllNodes();

    this.nodeName$ = this.searchText$.pipe(debounceTime(500));

    this.nodeName$.subscribe((searchInput) => {
      console.log(searchInput);

      this.loadGraphService.search(searchInput).subscribe({
        next: (data) => {
          this.accounts = data.items;
          this.length = data.totalItems;
          this.pageIndex = data.pageIndex;
          this.loadingService.setLoading(false);
        },
        error: (error) => {
          this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
            data: error.error.message,
            panelClass: ['notification-class-danger'],
            duration: 2000,
          });
          this.loadingService.setLoading(false);
        },
      });
    });
  }

  searchNodes(searchInput: string) {
    this.loadingService.setLoading(true);
    if (!searchInput) {
      this.loadGraphService.getAllNodes();
      return;
    }
    this.searchText$.next(searchInput);
  }

  showAsGraph(account: Account) {
    this.showGraph.emit(account);
  }

  getInfo(account: number) {
    this.loadGraphService.getNodeInfo(account).subscribe({
      next: (data) => {
        this.dialog.open(InfoDialogComponent, {
          width: '105rem',
          data,
        });
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
      },
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.length = e.length;
    this.loadGraphService.getAllNodes(e.pageIndex);
  }
}
