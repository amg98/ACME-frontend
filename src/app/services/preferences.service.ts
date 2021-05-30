import { EventEmitter, Injectable } from "@angular/core"

@Injectable({
    providedIn: "root",
})
export class PreferencesService {

    activateTheme = new EventEmitter<string>();
    changeSize = new EventEmitter<string>();
    changeFontFamily = new EventEmitter<string>();

    savePreference(preference: string, state: string): void {
        localStorage.setItem(preference, state)
    }

    getPreference(preference: string): string | null {
        const data = localStorage.getItem(preference) !== null ? 
            localStorage.getItem(preference) :
            preference === "theme" ? "light" :
                preference === "size" ? "16" : 
                    preference === "font"? "Roboto" : "€"   
                                        
        return data
    }
}
