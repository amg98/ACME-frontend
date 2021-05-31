import { Component } from "@angular/core"
import { MatSelectChange } from "@angular/material/select"
import { PreferencesService } from "@services/preferences.service"

@Component({
    selector: "app-size-selector",
    templateUrl: "./size-selector.component.html",
    styleUrls: ["./size-selector.component.scss"]
})

export class SizeSelectorComponent  {
  selectedSize: string|null; 
  sizes = ["12", "16", "20", "24"];
  SizeLabels = this.sizes;

  onSizeChange(event: MatSelectChange): void {
      this.preference.changeSize.emit(event.value)
      this.preference.savePreference("size", event.value)
  }

  constructor(private preference: PreferencesService) { 
      this.selectedSize = this.preference.getPreference("size")
  } 
}
