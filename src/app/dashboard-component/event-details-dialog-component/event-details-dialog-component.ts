import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { DashboardService, EventDetailsRequest, BinEventDetail } from '../dashboard-service';

@Component({
    selector: 'app-event-details-dialog',
    standalone: true,
    imports: [MatDialogModule, MatTableModule, DatePipe],
    templateUrl: './event-details-dialog-component.html',
    styleUrl: './event-details-dialog-component.scss'
})
export class EventDetailsDialogComponent implements OnInit {
    private readonly dashboardService = inject(DashboardService);

    events = signal<BinEventDetail[]>([]);
    displayedColumns: string[] = ['date', 'plate', 'camera'];

    constructor(@Inject(MAT_DIALOG_DATA) public data: EventDetailsRequest) {}

    ngOnInit(): void {
        this.dashboardService.getBinEventDetails(this.data).subscribe({
            next: (res) => this.events.set(res),
            error: (err) => console.error('Error fetching event details:', err)
        });
    }
}
