import { Component, OnInit } from "@angular/core"
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { TranslatableComponent } from "@components/translatable/translatable.component"
import { ActorsService } from "@services/actors.service"
import { Router, ActivatedRoute } from "@angular/router"
import { TranslatorService } from "@services/translator.service"
import { TripsService } from "@services/trips.service"
import { Actor } from "src/app/models/Actor"
import { Trip } from "src/app/models/Trip"

@Component({
    selector: "app-trip-form",
    templateUrl: "./trip-form.component.html",
    styleUrls: ["./trip-form.component.scss"],

})

export class TripFormComponent extends TranslatableComponent implements OnInit {

    loggedActor = this.actorsService.getLoggedActor();
    requirementList: string[] = ["Not allowed to smoke", "Not allowed pets", "Not allowed children under 16", "Love travelling"];
    loading = false
    actor!: Actor;
    tripForm!: FormGroup
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
    newTripFormText!: string;
    title!: string;
    description!: string;
    price!: string;
    addrequirementsText!: string;
    startDate!: string;
    endDate!: string;
    id!: string;

    constructor(private formBuilder: FormBuilder,
        translator: TranslatorService,
        private tripsService: TripsService,
        private router: Router,
        private route: ActivatedRoute,
        private actorsService: ActorsService,
        private snackBar: MatSnackBar) {
        super(translator)

        this.setLanguageChangeListener(() => {
            this.newTripFormText = translator.getString("newTripFormText")
            this.description = translator.getString("description")
            this.title = translator.getString("title")
            this.price = translator.getString("price")
            this.stagesText = translator.getString("stages")
            this.requirementText = translator.getString("requirement")
            this.requirementsText = translator.getString("requirements")
            this.addStagesText = translator.getString("addStagesText")
        })
    }

    createForm() {
        this.tripForm = this.formBuilder.group({
            title: ["", Validators.required],
            description: ["", Validators.required],
            requirements: this.formBuilder.array([""]),
            startDate: ["", Validators.required],
            endDate: ["", Validators.required],
            pictures: this.formBuilder.array([""]),
            stages: this.formBuilder.array([this.createStage()]),
        })
    }

    ngOnInit() {
        this.updated = false;
        this.createForm();
        if (this.route.url !== undefined) {
            this.route.url.subscribe(url => {
                if (url[0].path !== 'new') {
                    this.trip_new = false;
                    this.route.params
                        .subscribe(async params => {
                            this.trip = await this.tripsService.getTrip(params["id"]);
                            if (!this.actorsService.checkManagerId(this.trip.managerID)) {
                                this.router.navigate(['/denied-access']);
                            } else {
                                this.tripForm.controls['title'].setValue(this.trip.title);
                                this.tripForm.controls['description'].setValue(this.trip.description);
                                this.totalprice = Number(this.trip.price);
                                this.initRequirements(this.trip.requirements);
                                this.tripForm.controls['startDate'].setValue(new Date(this.trip.startDate).toISOString());
                                this.tripForm.controls['endDate'].setValue(new Date(this.trip.endDate).toISOString());
                                this.initPictures(this.trip.pictures);
                                this.initStages(this.trip.stages);
                            }
                        });
                }
            });
        }
    }

    createStage() {
        return this.formBuilder.group({
            title: [""],
            description: [""],
            price: [Number]
        })
    }

    removeStage(index: number) {
        this.stages.removeAt(index)
    }
    goBack() {
        window.history.back();
      }

    addStage() {
        this.stages = this.tripForm.get("stages") as FormArray
        this.stages.push(this.createStage())
    }

    initStages(stagesList: any[]) {
        this.stages = this.tripForm.get("stages") as FormArray
        stagesList.map(item => {
            this.stages.push(this.formBuilder.group(
                {
                    title: [item.title],
                    description: [item.description],
                    price: [item.price]
                }))
        })
        this.removeStage(0)
        this.tripForm.setControl("stages", this.stages)
    }

    addRequirements() {
        this.requirements = this.tripForm.get("requirements") as FormArray
        this.requirements.push(new FormControl([""]))
    }

    removeReq(index: number) {
        this.requirements.removeAt(index)
    }

    initRequirements(requirementsList: string[]) {
        this.requirements = this.tripForm.get("requirements") as FormArray
        requirementsList.map(requirement => {
            this.requirements.push(new FormControl(requirement))
        })
        this.removeReq(0)
        this.tripForm.setControl("requirements", this.requirements)
    }

    addPicture() {
        this.pictures = this.tripForm.get("pictures") as FormArray
        this.pictures.push(new FormControl([""]))
    }

    removePic(index: number) {
        this.pictures.removeAt(index)
    }

    initPictures(picturesList: string[]) {
        this.pictures = this.tripForm.get("pictures") as FormArray
        picturesList.map(picture => {
            this.pictures.push(new FormControl(picture))
        })
        this.removePic(0)
        this.tripForm.setControl("pictures", this.pictures)
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls
    }

    async onSubmit(): Promise<void> {
        const formTrip = this.tripForm.value
        formTrip.startDate = new Date(formTrip.startDate).toISOString();
        formTrip.endDate = new Date(formTrip.endDate).toISOString();
        if (this.trip_new) {
            console.log(formTrip)
            try {
                this.trip = await this.tripsService.postTrip(formTrip);
                if (this.trip._id !== undefined) {
                    await this.tripsService.publishTrip(this.trip._id);
                }
                this.updated = true
                this.showAlert("tripCreatedText", "alert-success")
                this.router.navigate(["trips"]);
            } catch {
                this.showAlert("tripCreationError", "alert-error")
            }
            this.loading = false
        } else {
            try {
                if (this.trip._id !== undefined && this.trip._id !== null) {
                    this.tripsService.updateTrip(formTrip, this.trip._id);
                    this.updated = true
                    this.router.navigate(["trips/display/" + this.trip._id]);
                    this.showAlert("tripCreatedText", "alert-success")
                    this.loading = false
                }
            } catch {
                this.showAlert("tripCreationError", "alert-error")
            }
        }
    }

    showAlert(messageID: string, panelClass: string): void {
        this.snackBar.open(this.msg[messageID], this.msg.close, {
            duration: 5000,
            panelClass: [panelClass]
        })
    }
}

