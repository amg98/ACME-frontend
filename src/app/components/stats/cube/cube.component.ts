import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { CubeService } from "@services/cube.service"
import { TranslatorService } from "@services/translator.service"
import { Actor } from "src/app/models/Actor"

@Component({
    selector: "app-cube",
    templateUrl: "./cube.component.html",
    styleUrls: ["./cube.component.scss"]
})
export class CubeComponent extends TranslatableComponent implements OnInit {

    explorers: Actor[] = []
    loadingExplorers = true
    queryForm: FormGroup;
    complexQueryForm: FormGroup;
    loading = false
    loadingComplex = false
    months = new Array(36).fill(0).map((_, i) => (i + 1).toString().padStart(2, "0"))
    years = new Array(3).fill(0).map((_, i) => (i + 1).toString().padStart(2, "0"))
    queryResult: number | null = null
    complexQueryResult: Actor[] | null = null
    
    constructor(private cubeService: CubeService,
        translator: TranslatorService,
        private actorsService: ActorsService,
        private formBuilder: FormBuilder,
        private snackbar: MatSnackBar) {
        super(translator)

        this.queryForm = this.formBuilder.group({
            explorer: ["", [Validators.required]],
            period1: ["M", [Validators.required]],
            period2: ["", [Validators.required]],
        })

        this.complexQueryForm = this.formBuilder.group({
            period1: ["M", [Validators.required]],
            period2: ["", [Validators.required]],
            condition: ["", [Validators.required]],
            amount: ["", [Validators.required]],
        })
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackbar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }

    async ngOnInit(): Promise<void> {
        this.loadingExplorers = true
        try {
            this.explorers = (await this.actorsService.getActorsSummary())
                .filter(actor => actor.roles.includes("EXPLORER"))
        } catch {
            this.showAlert("users-list/load-error", "alert-error")
        }
        this.loadingExplorers = false
    }

    async computeCube(): Promise<void> {
        this.showAlert("cube/compute-started", "alert-info")
        try {
            await this.cubeService.computeCube()
            this.showAlert("cube/compute-success", "alert-success")
        } catch {
            this.showAlert("cube/compute-error", "alert-error")
        }
    }

    async queryCube(): Promise<void> {
        if (!this.queryForm.valid) return
        const formValue = this.queryForm.value

        this.loading = true
        try {
            this.complexQueryResult = null
            this.queryResult = await this.cubeService.queryCube(this.explorers[formValue.explorer], `${formValue.period1}${formValue.period2}`)
        } catch {
            this.showAlert("cube/query-error", "alert-error")
        }
        this.loading = false
    }

    async queryCubeComplex(): Promise<void> {
        if (!this.complexQueryForm.valid) return
        const formValue = this.complexQueryForm.value

        this.loadingComplex = true
        try {
            this.queryResult = null
            this.complexQueryResult = await this.cubeService.queryCubeComplex(`${formValue.period1}${formValue.period2}`, formValue.condition, formValue.amount)
            if(this.complexQueryResult.length === 0) {
                this.showAlert("cube/empty-result", "alert-info")
            }
        } catch(e) {
            this.showAlert("cube/query-error", "alert-error")
        }
        this.loadingComplex = false
    }

    periodChanged(): void {
        this.queryForm.patchValue({ period2: "" })
    }

    periodComplexChanged(): void {
        this.complexQueryForm.patchValue({ period2: "" })
    }
}
