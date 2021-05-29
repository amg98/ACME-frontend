import { EventEmitter, Injectable } from "@angular/core"

@Injectable({
    providedIn: "root",
})
export class ThemeService {
  activateTheme = new EventEmitter<string>();

  saveTheme(state: string): void {
      localStorage.setItem("theme", state)
  }

  getTheme(): string | null {
      const stateTheme =
      localStorage.getItem("theme") !== null
          ? localStorage.getItem("theme")
          : "light"
      return stateTheme
  }
}
