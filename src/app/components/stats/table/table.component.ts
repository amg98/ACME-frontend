import { Component, OnDestroy, OnInit } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { Stats, StatsService } from "@services/stats.service"
import { TranslatorService } from "@services/translator.service"
import { Subscription } from "rxjs"

interface HeaderData {
    values: Array<Array<string>>
}

interface CellData {
    values: Array<Array<string>>
}

interface TableData {
    type: "table"
    header: HeaderData
    cells: CellData
}

@Component({
    selector: "app-table",
    templateUrl: "./table.component.html",
    styleUrls: ["./table.component.scss"]
})
export class TableComponent extends TranslatableComponent implements OnInit, OnDestroy {

    headersName = ["stats/min", "stats/max", "stats/mean", "stats/stdv"]
    labelsName = ["stats/trips-per-manager", "stats/apps-per-trip", "stats/price-per-trips", "stats/avg-price-finder"]
    languageChangeSub: Subscription;
    loading = true
    data: Array<TableData> = [{
        header: {
            values: [[""], [""], [""], [""], [""]]
        },
        cells: {
            values: [
                ["", "", "", ""],
                ["-", "-", "-", "-"],
                ["-", "-", "-", "-"],
                ["-", "-", "-", "-"],
                ["-", "-", "-", "-"]
            ]
        },
        type: "table"
    }]
    layout = {
        paper_bgcolor: "rgba(0, 0, 0, 0)"
    }

    constructor(translator: TranslatorService, private statsService: StatsService) { 
        super(translator)

        this.languageChangeSub = translator.subscribe(() => {
            this.data[0].header.values = this.headersName.map(headerName => [translator.getMessages()[headerName]])
            this.data[0].header.values = [[""], ...this.data[0].header.values]
            this.data[0].cells.values[0] = this.labelsName.map(labelName => translator.getMessages()[labelName])
        })
    }

    async getStats(statsGetter: () => Promise<Stats>, row: number): Promise<void> {
        try {
            const stats = await statsGetter()
            this.data[0].cells.values[1][row] = stats.min.toFixed(2)
            this.data[0].cells.values[2][row] = stats.max.toFixed(2)
            this.data[0].cells.values[3][row] = stats.avg.toFixed(2)
            this.data[0].cells.values[4][row] = stats.stdv.toFixed(2)
        // eslint-disable-next-line no-empty
        } catch { }
    }

    async ngOnInit(): Promise<void> {
        this.loading = true
        await this.getStats(() => this.statsService.getTripsPerManager(), 0)
        await this.getStats(() => this.statsService.getApplicationsPerTrip(), 1)
        await this.getStats(() => this.statsService.getPricePerTrips(), 2)
        try {
            const stats = await this.statsService.getAveragePriceFinder()
            this.data[0].cells.values[1][3] = stats.minPrice.toFixed(2)
            this.data[0].cells.values[2][3] = stats.maxPrice.toFixed(2)
        // eslint-disable-next-line no-empty
        } catch { }
        this.loading = false
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.languageChangeSub.unsubscribe()
    }
}
