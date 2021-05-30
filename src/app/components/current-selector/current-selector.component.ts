import { Component } from "@angular/core"
import { MatSelectChange } from "@angular/material/select"
import { PreferencesService } from "@services/preferences.service"

@Component({
    selector: "app-current-selector",
    templateUrl: "./current-selector.component.html",
    styleUrls: ["./current-selector.component.scss"]
})
export class CurrentSelectorComponent {
  selectedCurrent: string | null
  currents = ["$", "€"];
  currentLabels = this.currents

  onCurrentChange(event: MatSelectChange): void {
      const current = event.value
      this.preference.changeFontFamily.emit(current)
      this.preference.savePreference("current", current)
  }

  constructor(private preference: PreferencesService) {
      this.selectedCurrent = preference.getPreference("current")
  }
}
