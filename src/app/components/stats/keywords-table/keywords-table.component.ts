import { Component, OnDestroy, OnInit } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { StatsService } from "@services/stats.service"
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
    selector: "app-keywords-table",
    templateUrl: "./keywords-table.component.html",
    styleUrls: ["./keywords-table.component.scss"]
})
export class KeywordsTableComponent extends TranslatableComponent implements OnInit, OnDestroy {

    headersName = ["stats/word", "stats/count"]
    languageChangeSub: Subscription
    loading = true
    data: Array<TableData> = [{
        header: {
            values: [[""], [""]]
        },
        cells: {
            values: [["-", "-"], ["a", "a"]]
        },
        type: "table"
    }]
    layout = {
        paper_bgcolor: "rgba(0, 0, 0, 0)",
        title: ""
    }

    constructor(translator: TranslatorService, private statsService: StatsService) { 
        super(translator)

        this.data[0].cells.values = [new Array(10).fill("-"), new Array(10).fill("-")]

        this.languageChangeSub = translator.subscribe(() => {
            this.data[0].header.values = this.headersName.map(headerName => [translator.getMessages()[headerName]])
            this.layout.title = translator.getMessages()["stats/top-keywords"]
        })
    }

    async ngOnInit(): Promise<void> {
        this.loading = true
        try {
            const topKeywords = await this.statsService.getTopKeywords()
            topKeywords.forEach((keyword, i) => {
                this.data[0].cells.values[0][i] = keyword.keyword
                this.data[0].cells.values[1][i] = keyword.count.toString()
            })
        // eslint-disable-next-line no-empty
        } catch { }
        this.loading = false
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.languageChangeSub.unsubscribe()
    }

}
