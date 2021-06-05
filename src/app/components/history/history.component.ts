import { Component, OnInit } from "@angular/core" 
import { MatTableDataSource } from "@angular/material/table"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { HistoryService } from "@services/history.service"
import { TranslatorService } from "@services/translator.service"

export interface HistoryTrips {
    _id: string;
    title: string;
    visits: number;
    description: string;
    frequency: number;
    button: string
}

@Component({
    selector: "app-history",
    templateUrl: "./history.component.html",
    styleUrls: ["./history.component.scss"],
})
export class HistoryComponent extends TranslatableComponent implements OnInit { 
    displayedColumns: string[] = [
        "title",
        "description",
        "num. of visits",
        "frequency",
        "button"
    ];

    dataSource: MatTableDataSource<HistoryTrips>;

    constructor(translator: TranslatorService, private historySrv: HistoryService) {
        super(translator)
        this.dataSource = new MatTableDataSource<HistoryTrips>()
    }

    ngOnInit(): void { 
        this.dataSource.data = this.historySrv.getHistory().sort(this.order)// ordenar el arreglo del historial que se obtine 
    }

    order = function (o1: HistoryTrips, o2: HistoryTrips): number {//funcion para ordenar el arreglo
        if (o1.frequency > o2.frequency) { //comparación lexicogŕafica
            return -1
        } else if (o1.frequency < o2.frequency) {
            return 1
        }
        return 0
    }
}
