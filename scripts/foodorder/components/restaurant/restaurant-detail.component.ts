import { Component, OnInit, DynamicComponentLoader, ElementRef, ComponentRef, Injectable, Input, Injector, Provider, provide, ChangeDetectorRef } from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, AbstractControl, NgFormModel } from 'angular2/common';
import { Http, HTTP_PROVIDERS, Response, Request, RequestOptions, RequestMethod, Headers, BrowserXhr } from 'angular2/http';
import { RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from 'angular2/router';
import { TestLogger } from 'beatcode/services/logger';
import { Restaurant } from './../../models/restaurant';
import { IEntityDataService, IEntityContainer, IOverrideDetailComponent, ControlDefinition, DataChanged } from 'beatcode/models/interfaces';
import { OverrideableDetailComponent } from 'beatcode/components/overrideable.component';
import { ComponentOverridesFactory } from 'beatcode/factories/component-overrides.factory';
import { GridComponent, TextboxComponent } from 'beatcode/controls';


@Component({
    directives: [FORM_DIRECTIVES],
    providers: [ComponentRef, provide(IEntityContainer, { useClass: RestaurantDetailComponent })],
    selector: 'restaurant-detail',
    template: `<div #DEFAULTANCHOR></div>
            <h3>Restaurant details</h3>
            <br />
            <p>{{entity.Name}}</p>
<form [ngFormModel]="entityForm" (ngSubmit)="onSubmit()">
    <div #formStart></div>
    <div #nameControl></div>
    <div #addressControl></div>
    <div #formEnd></div>
    <button type="submit" class="btn btn-default" [disabled]="!entityForm.valid || !loaded">Submit</button>
</form>
        `
})
@Injectable()
export class RestaurantDetailComponent extends OverrideableDetailComponent implements IEntityContainer {
    @Input() private entityID: string;
    public entity: Restaurant = new Restaurant();
    public controls: Array<ControlDefinition> = [
        { placeHolder: 'nameControl', propertyName: 'Name', controlComponent: TextboxComponent, componentInstance: null },
        { placeHolder: 'addressControl', propertyName: 'Address', controlComponent: TextboxComponent, componentInstance: null }
    ];
    public entityForm: ControlGroup;
    public loaded: boolean = false;

    constructor(private logger: TestLogger,
        routeParams: RouteParams,
        private router: Router,
        private http: Http,
        private entityService: IEntityDataService,
        public dynamicComponentLoader: DynamicComponentLoader,
        public injector: Injector,
        public elementRef: ElementRef,
        private fb: FormBuilder,
        private compRef: ComponentRef,
        public cd: ChangeDetectorRef)
    {
        super(logger, dynamicComponentLoader, injector, elementRef, cd);
        this.entityID = routeParams.get("id");
        this.entityService.dataObserver.subscribe((updatedRestaurants: DataChanged) => {
            this.entity.setModelData(updatedRestaurants.data.find(rest => rest.ID === this.entityID && rest instanceof Restaurant) as Restaurant);
            if (!this.entity) this.entity = new Restaurant();
        });
        this.entityService.fetchEntity(Restaurant, this.entityID).then((_rest: any) => {
            this.entity.setModelData(_rest as Restaurant);
        });
        this.entityForm = fb.group({});

        var that = this;
        this.initializationComplete.subscribe((ha: any) => {
            setTimeout(
                function() {
                    that.controls.filter(x => x.propertyName === 'Name' && x.componentInstance).map(x => x.componentInstance.height = 50);
                    that.loaded = true;
                },
                100
            );
        });

        logger.log("Restaurant detail initiated!");
    }

    onSubmit() {
        this.entityService.updateEntity(Restaurant, this.entity);
        // this.router.navigate(['RestaurantList']);
    }
}