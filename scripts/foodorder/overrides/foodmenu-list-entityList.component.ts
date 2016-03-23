﻿import { Component, OnInit, DynamicComponentLoader, ElementRef, ComponentRef, Inject, forwardRef, ViewChild, AfterViewInit } from 'angular2/core';
import { FORM_DIRECTIVES } from 'angular2/common';
import { TestLogger } from 'beatcode/services/logger';
import { FoodMenu } from './../models/foodmenu';
import { IDataStructure, IEmptyConstruct } from 'beatcode/models/interfaces';
import { IEntityContainer, IOverrideDetailComponent, OverrideDetailComponent, FieldFilter } from 'beatcode/models/interfaces';
import { FoodMenuListComponent } from './../components/foodmenu/foodmenu-list.component';
import { EntityListControl } from 'beatcode/controls/entity-list.control';
import { KendoGridComponent } from 'beatcode/controls/kendo-grid.control';

@Component({
    directives: [FORM_DIRECTIVES, EntityListControl, KendoGridComponent],
    template: `<kendo-grid [dataLoadOnInit]="false" [entityType]="dataEntity" [editLink]="editLink" #foodmenu_list></kendo-grid>`
})
@OverrideDetailComponent({
    hostComponent: FoodMenuListComponent
})
export class FoodMenuListEntityListOverrideComponent implements IOverrideDetailComponent {
    private dataEntity: IEmptyConstruct = FoodMenu;
    private editLink: string = "/FoodMenuCenter/FoodOrder_FoodMenu_DetailComponent";
    public filters: Array<FieldFilter> = null;

    @ViewChild('foodmenu_list') grid: KendoGridComponent;

    constructor(private logger: TestLogger,
        private elementRef: ElementRef,
        @Inject(forwardRef(() => FoodMenuListComponent)) private parentComponent: FoodMenuListComponent
    ) {
        this.dataEntity = parentComponent.dataEntity;
        (parentComponent.elementRef_ODC.nativeElement as HTMLElement).querySelectorAll("base-grid").item(0).setAttribute('hidden', 'hidden');
        parentComponent.filterChanged.subscribe((newFilters: FieldFilter[]) => {
            this.filters = null;
            if (this.grid) this.grid.setFilters(newFilters); else this.filters = newFilters;
            logger.log("FoodMenu list customization - Got new filters: " + newFilters.length);
        });
        logger.log("FoodMenu list customization - List representation replaced!");
    }
    getInstanceID(): string { return "NotDefined"; }

    postControlsCreatedCallback() {
        if (!this.filters) this.filters = this.parentComponent.filters;
        if (this.filters) this.grid.setFilters(this.filters);
        this.filters = null;
    }
}