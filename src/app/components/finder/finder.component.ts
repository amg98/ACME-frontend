import { Component } from "@angular/core"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { TranslatorService } from "@services/translator.service"

@Component({
    selector: "app-finder",
    templateUrl: "./finder.component.html",
    styleUrls: ["./finder.component.scss"]
})
export class FinderComponent extends TranslatableComponent  {
  
  finderText!: string;

  constructor(translator: TranslatorService) {
      super(translator)
      this.setLanguageChangeListener(()=>{
          this.finderText = translator.getString("search")
      })
  }


  ngOnInit(): void { 
      console.log("init")
  }
 
}
