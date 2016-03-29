import { Component, provide, OnInit, AfterViewInit, NgZone, ApplicationRef } from 'angular2/core';
import { TestLogger } from 'beatcode/services/logger';
import { Restaurant } from './../../models/restaurant';
import { IDataStructure, IEmptyConstruct } from 'beatcode/models/interfaces';
import { GridComponent } from 'beatcode/controls';

@Component({
    directives: [GridComponent],
    template: `<base-grid [entityType]="dataEntity"></base-grid>`
})
export class RestaurantListComponent {
    public dataEntity: IEmptyConstruct = Restaurant;
    constructor(private logger: TestLogger) {
        logger.log("Restaurant list component initiated!");
    }
}