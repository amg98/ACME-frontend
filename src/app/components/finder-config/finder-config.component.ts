import { Component, OnInit } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-finder-config",
    templateUrl: "./finder-config.component.html",
    styleUrls: ["./finder-config.component.scss"]
})
export class FinderConfigComponent extends TranslatableComponent implements OnInit {

    constructor(translator: TranslatorService) { 
        super(translator)
    }

    ngOnInit(): void {
        console.log("finder config log")      
    }

}
