import { ComponentFixture, TestBed } from "@angular/core/testing"

import { ManagerApplicationsComponent } from "./applications.component"

fdescribe("ManagerApplicationsComponent", () => {
    let component: ManagerApplicationsComponent
    let fixture: ComponentFixture<ManagerApplicationsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ ManagerApplicationsComponent ]
        })
            .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(ManagerApplicationsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it("should create", () => {
        expect(component).toBeTruthy()
    })
})
