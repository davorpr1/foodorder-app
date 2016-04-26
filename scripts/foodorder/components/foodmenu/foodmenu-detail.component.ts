import { Component, ApplicationRef, ChangeDetectorRef, ChangeDetectionStrategy, provide, Output, ViewChild, AfterViewInit, EventEmitter, DynamicComponentLoader, ElementRef, Injector, Injectable, OnInit, OnDestroy } from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, AbstractControl, NgFormModel } from 'angular2/common';
import { RouteParams, Router, Location } from 'angular2/router';
import { TestLogger } from 'beatcode/services/logger';
import { FoodMenu } from './../../models/foodmenu';
import { Restaurant } from './../../models/restaurant';
import { DropdownComponent, AutocompleteComponent, DatePickerComponent, KendoDatePickerComponent } from 'beatcode/controls';
import { IEntityDataService, IEmptyConstruct, IEntityContainer, ChangesCommit, DataChanged, DataChangeType, OverrideDataDefinition } from 'beatcode/models/interfaces';
import { Observable } from 'rxjs/Rx';
import { OverrideableDetailComponent } from 'beatcode/components/overrideable.component';

@Component({
    directives: [FORM_DIRECTIVES, AutocompleteComponent, DatePickerComponent, DropdownComponent, KendoDatePickerComponent],
    templateUrl: `./../templates/foodorder/components/foodmenu/foodmenu-detail.html`
})
@Injectable()
export class FoodMenuDetailComponent extends OverrideableDetailComponent implements IEntityContainer, OnDestroy, AfterViewInit {
    private _id: string;
    public entity: FoodMenu = new FoodMenu();
    public entityForm: ControlGroup;
    private restaurantType: IEmptyConstruct = Restaurant;
    @Output() formSubmitted: EventEmitter<ChangesCommit> = new EventEmitter<ChangesCommit>();
    private inProgressChangeID: string = null;

    logValue(event: any) {
        this.logger.log('Form got event about new value...' + event);
    }

    constructor(private logger: TestLogger,
        routeParams: RouteParams,
        private router: Router,
        private entityService: IEntityDataService,
        public dynamicComponentLoader: DynamicComponentLoader,
        public injector: Injector,
        public elementRef: ElementRef,
        private fb: FormBuilder,
        private changeDetector: ChangeDetectorRef,
        private location: Location)
    {
        super(logger, dynamicComponentLoader, injector, elementRef, changeDetector);
        this._id = routeParams.get("id");

        this.entityService.dataObserver.subscribe((updatedFoodMenus: DataChanged) => {
            if (this.inProgressChangeID && this.inProgressChangeID == updatedFoodMenus.ID) {
                this.inProgressChangeID = null;
                this.busy = false;
                this.location.back();
            } else {
                this.entity = updatedFoodMenus.data.find(menu => menu.ID === this._id && (menu instanceof FoodMenu)) as FoodMenu;
                if (!this.entity) this.entity = new FoodMenu();
                else {
                    this.logger.log("Change execution result acknowledged: " + updatedFoodMenus.ID);
                }
                this.changeDetector.markForCheck();
            }
        });
        this.busy = true;
        this.entityService.fetchEntity(FoodMenu, this._id).then((_fm: FoodMenu) => {
            this.entity = _fm;
            this.busy = false;
        });

        this.entityForm = fb.group({
            Name: ["", Validators.compose(this.entity.getValidators()["Name"].map(x => x.Validator))],
            ActiveFromDate: ["", Validators.required],
            ActiveUntilDate: ["", Validators.required],
            RestaurantID: ["", Validators.required]
        });
        this.entityService.registerNewChangesStream(this.formSubmitted);
        
        logger.log("FoodMenu detail initiated!");
    }

    ngOnDestroy() {
        this.formSubmitted.complete();
    }

    @ViewChild('submitButton') submitBtn: ElementRef;

    ngAfterViewInit() {
        var that = this;
        var buttonClick: Observable<MouseEvent> = Observable.fromEvent(this.submitBtn.nativeElement, 'click');
        buttonClick.subscribe(function (event: MouseEvent) {
            that.inProgressChangeID = "FoodMenu_Detail_Form_" + (Math.random() * 1000013);
            that.busy = true;
            that.formSubmitted.next({
                ID: that.inProgressChangeID,
                DataType: FoodMenu,
                ChnageType: that.entity.ID ? DataChangeType.Update : DataChangeType.Insert,
                data: [that.entity]
            });
        });
    }
}