import {Component, OnInit, inject, signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {DashboardService, Location,Sublocation, EventBinRequest, BinInterval, BinResponse} from './dashboard-service';
import {RawEventsBarGraphComponent} from './raw-events-bar-graph/raw-events-bar-graph';
import {MatDialog} from '@angular/material/dialog';
import {EventDetailsDialogComponent} from './event-details-dialog-component/event-details-dialog-component';

@Component({
  selector: 'app-dashboard-component',
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        RawEventsBarGraphComponent,
    ],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent implements OnInit {
    private readonly dashboardService= inject(DashboardService);
    private readonly dialog = inject(MatDialog);

    locations  = signal<Location[]>([]);
    sublocations = signal<Sublocation[]>([]);

    selectedLocation = signal<string>('ALL');
    selectedSublocations = signal<string[]>([]);

    startDate = signal<string>('');
    endDate = signal<string>('');
    selectedInterval = signal<string>('Days');
    intervals = signal<string[]>(['Minutes', 'Hours','Days', 'Weeks', 'Months']);

    binnedEvents = signal<BinResponse[]>([]);

    ngOnInit(): void {
        this.dashboardService.getLocations()
            .subscribe({
                next: (locations) => {
                    this.locations.set(locations);
                },
                error: (error) => {
                    console.error('Error fetching locations:', error);
                },
            });

    }
    onLocationChange(locationId: string): void {
        this.selectedLocation.set(locationId);
        this.selectedSublocations.set([]); // ✅ Reset sublocations when location changes

        if (locationId === 'ALL') {
            this.sublocations.set([]); // ✅ Clear sublocations list if 'ALL' is selected
        } else {
            this.dashboardService.getSublocations(locationId)
                .subscribe({
                    next: (subs) => {
                        this.sublocations.set(subs);
                    },
                    error: (error) => {
                        console.error('Error fetching sublocations:', error);
                        this.sublocations.set([]);
                    },
                });
        }
    }

    onSublocationsChange(subIds: string[]): void {
        this.selectedSublocations.set(subIds);

        if (subIds.length > 0) {
            this.dashboardService.getTimeLimits(subIds).subscribe({
                next: (res) => {
                    // slice(0, 16) formats 'YYYY-MM-DDThh:mm:ss...' to 'YYYY-MM-DDThh:mm' for datetime-local inputs
                    if (res.earliest_datetime) this.startDate.set(res.earliest_datetime.slice(0, 16));
                    if (res.latest_datetime) this.endDate.set(res.latest_datetime.slice(0, 16));
                },
                error: (err) => console.error('Error fetching time limits:', err)
            });
        } else {
            this.startDate.set('');
            this.endDate.set('');
        }
    }
    private formatToLocalIso(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);

        // Get timezone offset in minutes and calculate hours/minutes
        const tzo = -date.getTimezoneOffset();
        const sign = tzo >= 0 ? '+' : '-';
        const pad = (num: number) => num.toString().padStart(2, '0');

        const YYYY = date.getFullYear();
        const MM = pad(date.getMonth() + 1);
        const DD = pad(date.getDate());
        const hh = pad(date.getHours());
        const mm = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        const tzHours = pad(Math.floor(Math.abs(tzo) / 60));
        const tzMins = pad(Math.abs(tzo) % 60);

        // Reconstructs: YYYY-MM-DDThh:mm:ss.000+08:00
        return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}.000${sign}${tzHours}:${tzMins}`;
    }

    onGoClicked(): void {
        const request: EventBinRequest = {
            sublocation_ids: this.selectedSublocations(),
            // Convert the HTML datetime-local strings to ISO 8601 format
            start_datetime: this.formatToLocalIso(this.startDate()),
            end_datetime: this.formatToLocalIso(this.endDate()),
            // Cast the Title Case UI interval to the lowercase BinInterval type
            interval: this.selectedInterval().toLowerCase() as BinInterval,
        };

        // Call the service and subscribe to the results
        this.dashboardService.getEvents(request).subscribe({
            next: (response) => {
                console.log('Successfully fetched binned events:', response);
                this.binnedEvents.set(response);
                // Future step: Pass this response payload into your graphing component
            },
            error: (error) => {
                console.error('Error fetching binned events:', error);
            }
        });
    }

    onBinClicked(bin: BinResponse): void {
        this.dialog.open(EventDetailsDialogComponent, {
            width: '800px',
            // Pass the parameters needed for the API call into the dialog
            data: {
                sublocation_ids: this.selectedSublocations(),
                start_datetime: bin.start_time,
                end_datetime: bin.end_time
            }
        });
    }


}
