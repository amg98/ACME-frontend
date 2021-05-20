import { Component, AfterViewInit, ViewChild, OnInit } from "@angular/core"
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { MatSnackBar } from "@angular/material/snack-bar"

import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"
import { Trip } from "src/app/models/Trip"
import { TripsService } from "@services/trips.service"

@Component({
    selector: "app-trips-manager-list",
    templateUrl: "./trips-manager-list.component.html",
    styleUrls: ["./trips-manager-list.component.scss"],
})

export class TripsManagerListComponent extends TranslatableComponent implements AfterViewInit, OnInit {

    displayedColumns: string[] = [
        "ticker", "title", "price", "startDate", "endDate", "description", "cancelReason"
    ];
    dataSource: MatTableDataSource<Trip>
    trips: Trip[] | null = null
    currentDate = new Date()

    @ViewChild(MatPaginator) paginator!: MatPaginator

    constructor(translator: TranslatorService, private snackBar: MatSnackBar, private tripsService: TripsService) {
        super(translator)
        this.dataSource = new MatTableDataSource<Trip>()
    }

    async ngOnInit(): Promise<void> {
        try {
            this.trips = await this.tripsService.getTripsByManager()
            this.dataSource.data = this.trips
        } catch {
            this.showAlert("trips/error", "alert-error")
            this.trips = []
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator
    }

    checkDate(date: string): boolean {
        return ((new Date(date).getTime() - this.currentDate.getTime()) / (1000 * 60 * 60 * 24) > 7)
    }

    onCancel(tripId: string): void {
        console.log(tripId)
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackBar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }
}