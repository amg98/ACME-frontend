import { Component, AfterViewInit, ViewChild } from "@angular/core"
import { MatTableDataSource } from "@angular/material/table"
import { MatPaginator } from "@angular/material/paginator"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"
import { Trip } from "src/app/models/Trip"

@Component({
    selector: "app-trips-manager-list",
    templateUrl: "./trips-manager-list.component.html",
    styleUrls: ["./trips-manager-list.component.scss"],
})

export class TripsManagerListComponent extends TranslatableComponent implements AfterViewInit {

  displayedColumns: string[] = ["ticker", "title", "price", "startDate", "endDate", "cancelReason", "description"];
  dataSource = new MatTableDataSource<Trip>(trips);

  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(translator: TranslatorService) {
      super(translator)

  }

  ngAfterViewInit(): void {
      this.dataSource.paginator = this.paginator
  }
}

const trips: Trip[] = [
 
]

