import {Component, OnInit, inject, signal} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';

import {DashboardService, Location,Sublocation} from './dashboard-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [
      MatFormFieldModule,
      MatSelectModule,
      FormsModule
  ],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent implements OnInit {
    private readonly dashboardService= inject(DashboardService);

    locations  = signal<Location[]>([]);
    sublocations = signal<Sublocation[]>([]);

    selectedLocation = signal<string>('ALL');
    selectedSublocations = signal<string[]>([]);

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
}
