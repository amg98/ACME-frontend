import { Component, OnDestroy, OnInit } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { StatsService } from "@services/stats.service"
import { TranslatorService } from "@services/translator.service"
import { Subscription } from "rxjs"

interface PieData {
    values: Array<number>,
    labels: Array<string>,
    type: "pie"
}

@Component({
    selector: "app-pie-chart",
    templateUrl: "./pie-chart.component.html",
    styleUrls: ["./pie-chart.component.scss"]
})
export class PieChartComponent extends TranslatableComponent implements OnInit, OnDestroy {

    labelsName = ["stats/pending", "stats/accepted", "stats/rejected", "stats/due", "stats/cancelled"]
    languageChangeSub: Subscription;
    loading = true
    data: Array<PieData> = [{
        values: [],
        labels: [],
        type: "pie"
    }]
    available = false
    layout = {
        title: "",
        paper_bgcolor: "rgba(0, 0, 0, 0)"
    }

    constructor(translator: TranslatorService, private statsService: StatsService) { 
        super(translator)

        this.languageChangeSub = translator.subscribe(() => {
            this.data[0].labels = this.labelsName.map(labelName => translator.getMessages()[labelName])
            this.layout.title = translator.getMessages()["stats/apps-ratio"]
        })
    }

    async ngOnInit(): Promise<void> {
        this.loading = true
        try {
            const appsRatio = await this.statsService.getApplicationsRatio()
            this.data[0].values = [ ...Object.entries(appsRatio).map(entry => entry[1]) ]
            this.available = true
        // eslint-disable-next-line no-empty
        } catch { }
        this.loading = false
    }

    ngOnDestroy(): void {
        super.ngOnDestroy()
        this.languageChangeSub.unsubscribe()
    }
}
