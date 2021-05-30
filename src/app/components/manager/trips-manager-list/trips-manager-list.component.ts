import { Component, AfterViewInit, ViewChild, OnInit } from "@angular/core"
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { MatSnackBar } from "@angular/material/snack-bar"

import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"
import { Trip } from "src/app/models/Trip"
import { TripsService } from "@services/trips.service"
import { MatDialog } from "@angular/material/dialog"
import { CancelTripComponent } from "@components/dialog/cancel-trip/cancel-trip.component" 
import { PreferencesService } from "@services/preferences.service"

@Component({
    selector: "app-trips-manager-list",
    templateUrl: "./trips-manager-list.component.html",
    styleUrls: ["./trips-manager-list.component.scss"],
})

export class TripsManagerListComponent extends TranslatableComponent implements AfterViewInit, OnInit {

    displayedColumns: string[] = [
        "ticker", "title", "price", "startDate", "endDate", "description" 
    ];
    
    dataSource: MatTableDataSource<Trip>
    trips: Trip[] | null = null
    currentDate = new Date()

    @ViewChild(MatPaginator) paginator!: MatPaginator
    showSpiner = false
    current: string | null

    constructor(translator: TranslatorService, private tripsService: TripsService,
        private snackBar: MatSnackBar, private dialogRef: MatDialog, preference: PreferencesService) {
        super(translator)
        this.dataSource = new MatTableDataSource<Trip>()
        this.current = preference.getPreference("current")
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

    onCancel(trip: Trip, index: number): void {
        if (!this.trips) return
        const dialogRef = this.dialogRef.open(CancelTripComponent, {
            width: "30em",
            data: { cancelReason: "" }
        })

        dialogRef.afterClosed().subscribe(res => {
            if (res === undefined) return
            if (res === "") {
                this.showAlert("trips/no-reason", "alert-info")
                return
            }
            this.cancelTrip(trip, index, res)
        })
    }

    async cancelTrip(trip: Trip, index: number, cancelReason: string): Promise<void> {
        if (!this.trips) return
        this.showSpiner = true
        try { 
            trip.cancelReason = cancelReason
            await this.tripsService.cancelTripByManager(trip, cancelReason)
            this.trips[index].cancelReason = cancelReason
            this.trips[index].isCancelled = true
            this.showAlert("trips/success-cancel", "alert-success")
        } catch {
            this.showAlert("trips/error-cancel", "alert-error")
        }
        this.dataSource.data = this.trips 
        this.showSpiner = false
    }

    async deleteTrip(trip: Trip): Promise<void> {
        if (!this.trips) return
        this.showSpiner = true
        try { 
            await this.tripsService.deleteTrip(trip) 
            this.trips = await this.tripsService.getTripsByManager()
            this.showAlert("trips/success-delete", "alert-success")
        } catch {
            this.showAlert("trips/error-delete", "alert-error")
        }
        this.dataSource.data = this.trips 
        this.showSpiner = false
    }


    showAlert(messageID: string, panelClass: string): void {
        this.snackBar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }
}