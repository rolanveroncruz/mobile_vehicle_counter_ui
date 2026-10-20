import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartEvent } from 'chart.js';

// Adjust the import path based on your folder structure
import { BinResponse } from '../dashboard-service';

@Component({
    selector: 'app-raw-events-bar-graph',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: './raw-events-bar-graph.html',
    styleUrls: ['./raw-events-bar-graph.scss']
})
export class RawEventsBarGraphComponent implements OnChanges {
    // ✅ Receives data from the Dashboard parent
    @Input() events: BinResponse[] = [];

    @Output() binClicked = new EventEmitter<BinResponse>();

    public barChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to fill the container height
        plugins: {
            legend: { display: false }, // Hides the legend for a cleaner look if there's only one dataset
        }
    };

    public barChartData: ChartConfiguration<'bar'>['data'] = {
        labels: [],
        datasets: [{ data: [], label: 'Event Count' }]
    };

    // ✅ Reacts automatically whenever the parent passes a new array
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['events'] && this.events) {
            this.updateChart();
        }
    }

    private updateChart(): void {
        this.barChartData = {
            // Formats the ISO string into a readable label (e.g., "10/9 16:44")
            labels: this.events.map(e => {
                const date = new Date(e.start_time);
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${month}/${day} ${hours}:${minutes}`;
            }),
            datasets: [
                {
                    data: this.events.map(e => e.count),
                    label: 'Event Count',
                    backgroundColor: '#3f51b5', // Angular Material Primary Color
                    borderRadius: 4, // Slightly rounds the top of the bars
                }
            ]
        };
    }


    onChartClick({ event, active }: { event?: ChartEvent, active?: object[] }): void {
        // Check if the user actually clicked on a bar (active array has items)
        if (active && active.length > 0) {

            // Get the index of the clicked bar
            const clickedElement = active[0] as any;
            const dataIndex = clickedElement.index;

            // Use the index to grab the corresponding BinResponse from your input array
            const selectedBin = this.events[dataIndex];

            console.log('User clicked on interval:', selectedBin.start_time, 'to', selectedBin.end_time);

            this.binClicked.emit(selectedBin);
        }
    }

}
