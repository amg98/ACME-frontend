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
    {
        ticker: "1", title: "1er viaje", price: 220, isCancelled: false,
        requirements: ["sin requerimiento 1"], pictures: "foto 1",
        stages: [{ description: "stage desc1", title: "stage ttl1", price: 220 }],
        isPublished: false, cancelReason: "r1", startDate: "01/06/21", endDate: "01/09/21"
    }, {
        ticker: "2", title: "2er viaje", price: 230, isCancelled: false,
        requirements: ["sin requerimiento 2"], pictures: "foto 2",
        stages: [{ description: "stage desc2", title: "stage ttl2", price: 230 }],
        isPublished: true, cancelReason: "r2", startDate: "01/06/21", endDate: "01/09/21"
    }, {
        ticker: "1", title: "1er viaje", price: 220, isCancelled: false,
        requirements: ["sin requerimiento 1"], pictures: "foto 1",
        stages: [{ description: "stage desc1", title: "stage ttl1", price: 220 }],
        isPublished: false, cancelReason: "", startDate: "01/06/21", endDate: "01/09/21"
    }, {
        ticker: "2", title: "2er viaje", price: 230, isCancelled: false,
        requirements: ["sin requerimiento 2"], pictures: "foto 2",
        stages: [{ description: "stage desc2", title: "stage ttl2", price: 230 }],
        isPublished: false, cancelReason: "", startDate: "01/06/21", endDate: "01/09/21"
    }, {
        ticker: "1", title: "1er viaje", price: 220, isCancelled: false,
        requirements: ["sin requerimiento 1"], pictures: "foto 1",
        stages: [{ description: "stage desc1", title: "stage ttl1", price: 220 }],
        isPublished: true, cancelReason: "", startDate: "01/06/21", endDate: "01/09/21"
    }, {
        ticker: "2", title: "2er viaje", price: 230, isCancelled: false,
        requirements: ["sin requerimiento 2"], pictures: "foto 2",
        stages: [{ description: "stage desc2", title: "stage ttl2", price: 230 }],
        isPublished: false, cancelReason: "", startDate: "01/06/21", endDate: "01/09/21"
    },
]

