import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslatableComponent } from "@components/translatable/translatable.component";
import { ActorsService } from "@services/actors.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslatorService } from "@services/translator.service";
import { TripsService } from "@services/trips.service";
import { Actor } from "src/app/models/Actor";
import { Trip } from "src/app/models/Trip";

@Component({
    selector: "app-trip-form",
    templateUrl: "./trip-form.component.html",
    styleUrls: ["./trip-form.component.scss"]
})
export class TripFormComponent extends TranslatableComponent {
    loggedActor = this.actorsService.getLoggedActor();
    requirementList: string[] = ['Not allowed to smoke', 'Not allowed pets', 'Not allowed children under 16', 'Love travelling'];
    loading = false
    actor!: Actor;
    tripForm: FormGroup;
    stages!: FormArray;
    stagesText!: string;
    addStagesText!: string;
    requirements!: FormArray;
    requirementsText!: string;
    requirementText!: string;
    pictures!: FormArray;
    trip!: Trip;
    isNew!: boolean;
    totalprice = 0;
    trip_new = true;
    updated!: boolean;
    profileForm!: FormGroup;
    tripCreationError!: string;
    closeText!: string;
    saveSuccessText!: string;
    saveFailureText!: string;
    newTripFormText!: string;
    title!: string;
    requiredFieldText!: string;
    description!: string;
    price!: string;
    saveText!: string;
    addRequerimentsText!: string;
    startDate!: string;
    endDate!: string;
    dates!: string;
    dragAndDropPicturesText!: string;

    constructor(private formBuilder: FormBuilder,
        translator: TranslatorService,
        private tripsService: TripsService,
        private router: Router,
        private route: ActivatedRoute,
        private actorsService: ActorsService,
        private snackbar: MatSnackBar) {
        super(translator);


        this.tripForm = this.formBuilder.group({
            title: ["", Validators.required],
            description: ["", Validators.required],
            price: [""],
            requirements: this.formBuilder.array([this.createRequeriment]),
            startDate: ["", Validators.required],
            endDate: ["", Validators.required],
            pictures: this.formBuilder.array([""]),
            stages: this.formBuilder.array([this.createStage()]),
            //managerID: [""]
        });
        this.setLanguageChangeListener(() => {
            this.closeText = translator.getString("close");
            this.saveSuccessText = translator.getString("save-success");
            this.saveFailureText = translator.getString("save-failure");
            this.newTripFormText = translator.getString("newTripFormText");
            this.title = translator.getString("title");
            this.description = translator.getString("description");
            this.price = translator.getString("price");
            this.stagesText = translator.getString("stages");
            this.requirementText = translator.getString("requirement");
            this.requirementsText = translator.getString("requirements");
            this.addRequerimentsText = translator.getString("addRequeriments");
            this.saveText = translator.getString("save");
            this.dates = translator.getString("dates");
            this.dragAndDropPicturesText = translator.getString("dragAndDropPicturesText");
            this.addStagesText = translator.getString("addStagesText");
        });
    }

    formatDate(d: Date) {
        let month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            // tslint:disable-next-line: prefer-const
            year = d.getFullYear();

        if (month.length < 2) { month = '0' + month; }
        if (day.length < 2) { day = '0' + day; }

        return [year, month, day].join('-');
    }

    updatePrice() {

        const stages_price = document.getElementsByName("stage-price");
        this.totalprice = 0;
        for (let i = 0; i < stages_price.length; i++) {
            const stage = <HTMLInputElement>stages_price[i];
            this.totalprice += Number(stage.value);
        }
        this.tripForm.controls["price"].setValue(this.totalprice);
    }

    createStage() {
        return this.formBuilder.group({
            title: [""],
            description: [""],
            price: [""]
        });
    }

    createRequeriment() {
        return this.formBuilder.group({
            requirement: [""],
        });
    }

    removeStage(index: number) {
        this.stages.removeAt(index);
        this.updatePrice();
    }

    addStage() {
        this.stages = this.tripForm.get("stages") as FormArray;
        this.stages.push(this.createStage());
    }

    initStages(stagesList: any[]) {
        this.stages = this.tripForm.get("stages") as FormArray;
        stagesList.map(item => {
            this.stages.push(this.formBuilder.group(
                {
                    title: [item.title],
                    description: [item.description],
                    price: [item.price]
                }));
        });
        this.removeStage(0);
        this.tripForm.setControl("stages", this.stages);
    }

    addRequeriments() {
        this.requirements = this.tripForm.get("requirements") as FormArray;
        this.requirements.push(new FormControl([""]));
    }

    removeReq(index: number) {
        this.requirements.removeAt(index);
    }

    initRequeriments(requirementsList: string[]) {
        this.requirements = this.tripForm.get("requirements") as FormArray;
        requirementsList.map(requirement => {
            this.requirements.push(new FormControl(requirement));
        });
        this.removeReq(0);
        this.tripForm.setControl("requirements", this.requirements);
    }

    addPicture() {
        this.pictures = this.tripForm.get("pictures") as FormArray;
        this.pictures.push(new FormControl([""]));
    }

    removePic(index: number) {
        this.pictures.removeAt(index);
    }

    initPictures(picturesList: string[]) {
        this.pictures = this.tripForm.get("pictures") as FormArray;
        picturesList.map(picture => {
            this.pictures.push(new FormControl(picture));
        });
        this.removePic(0);
        this.tripForm.setControl("pictures", this.pictures);
    }
    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    async onSubmit(): Promise<void> {
        this.loading = true
        this.updated = false;
        this.tripForm.controls["price"].setValue(this.updatePrice);
        /*if (this.route.url !== undefined) {
            this.route.url.subscribe(url => {
                if (url[0].path !== "new") {
                    this.trip_new = false;
                    this.route.params
                        .subscribe(async params => {
                            this.trip = await this.tripsService.getTrip(params["id"]);
                            if (!this.actorsService.checkId(this.trip.managerID)) {
                                this.router.navigate(["/denied-access"]);
                            } else {
                                this.tripForm.controls["title"].setValue(this.trip.title);
                                this.tripForm.controls["description"].setValue(this.trip.description);
                                this.totalprice = Number(this.trip.price);
                                this.tripForm.controls["price"].setValue(this.trip.price);
                                this.initRequeriments(this.trip.requirements);
                                this.tripForm.controls['startDate'].setValue(this.formatDate(new Date(this.trip.startDate)));
                                this.tripForm.controls['endDate'].setValue(this.formatDate(new Date(this.trip.endDate)));
                                this.initPictures(this.trip.pictures);
                                this.initStages(this.trip.stages);
                            }
                        });
                }
            });
        }*/
        if (this.loggedActor !== null
            && this.loggedActor !== undefined
            && this.loggedActor._id !== null) {
            //this.tripForm.controls["managerID"].setValue(this.loggedActor._id);
        }
        const formTrip = this.tripForm.value;
        console.log(formTrip)
        if (this.trip_new) {
            this.tripsService.postTrip(formTrip).then(val => {
                this.updated = true;
                this.loading = false;
                this.snackbar.open(this.saveSuccessText, this.closeText, {
                    duration: 5000,
                    panelClass: ["alert-success"]
                });
                this.loading = false;
                //PONER EN ESTA RUTA EL NOMBRE DE LA PANTALLA QUE LE DE FAUSTINO
                //this.router.navigate(["/my-trips"]);
                // TODO : poner mensaje creado
            }, err => {
                this.snackbar.open(this.saveFailureText, this.closeText, {
                    duration: 5000,
                    panelClass: ["alert-error"]
                });
            }
            );
        } else {
            this.tripsService.updateTrip(formTrip, this.trip.ticker).then(val => {
                this.updated = true;
                //this.router.navigate(["/my-trips"]);
                this.snackbar.open(this.saveSuccessText, this.closeText, {
                    duration: 5000,
                    panelClass: ["alert-success"]
                });
                this.loading = false;
            }, err => {
                this.snackbar.open(this.saveFailureText, this.closeText, {
                    duration: 5000,
                    panelClass: ["alert-error"]
                });
            }
            );
        }
    }
}

