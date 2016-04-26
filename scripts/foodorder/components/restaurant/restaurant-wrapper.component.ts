import { Component, OnInit, DynamicComponentLoader, ElementRef, ComponentRef, Injectable, Input } from 'angular2/core';
import { FORM_DIRECTIVES, FormBuilder, Validators, ControlGroup, AbstractControl } from 'angular2/common';
import { Http, HTTP_PROVIDERS, Response, Request, RequestOptions, RequestMethod, Headers, BrowserXhr } from 'angular2/http';
import { RouteConfig, ROUTER_DIRECTIVES, RouteParams, Router } from 'angular2/router';
import { TestLogger } from 'beatcode/services/logger';
import { Restaurant } from './../../models/restaurant';
import { IEntityDataService, IEntityContainer } from 'beatcode/models/interfaces';

import { RestaurantDetailComponent } from './restaurant-detail.component';
import { FoodMenuListComponent } from './../foodmenu/foodmenu-list.component';

@Component({
    directives: [RestaurantDetailComponent, FoodMenuListComponent],
    template: `<table><tr>
            <td>First instance  <restaurant-detail [entityID]="entID" #restaurant></restaurant-detail></td>
            <td>Second instance <restaurant-detail [entityID]="entID"></restaurant-detail></td>
            <td>Third instance <restaurant-detail [entityID]="entID"></restaurant-detail></td>
            <td>Fourth instance <restaurant-detail [entityID]="entID"></restaurant-detail></td>
            </tr>
           </table>
            <div *ngIf="restaurant.entity.ID">
                All menus for restaurant {{ restaurant.entity.Name }}
                <foodmenu-list [restaurantID]="restaurant.entity.ID"></foodmenu-list>            
                End of dual view
            </div>`
})
export class RestaurantWrapperComponent {
    private entID: string = "";
    constructor(private logger: TestLogger,
        routeParams: RouteParams
    ) {
        this.entID = routeParams.get("id");
    }
}