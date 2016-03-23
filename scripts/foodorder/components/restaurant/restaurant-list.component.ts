import { Component, View, provide, OnInit, AfterViewInit, NgZone, ApplicationRef } from 'angular2/core';
import { TestLogger } from 'beatcode/services/logger';
import { Restaurant } from './../../models/restaurant';
import { IDataStructure, IEmptyConstruct } from 'beatcode/models/interfaces';
import { KendoGridComponent } from 'beatcode/controls/kendo-grid.control';

@Component({
    directives: [KendoGridComponent],
    template: `<kendo-grid [entityType]="dataEntity"></kendo-grid>`
})
export class RestaurantListComponent {
    public dataEntity: IEmptyConstruct = Restaurant;
    constructor(private logger: TestLogger) {
        logger.log("Restaurant list component initiated!");
    }
}