/// <reference path="../../../scripts/beatcode/typings/jquery/jquery.d.ts" />
/// <reference path="../../../scripts/beatcode/typings/jqueryui/jqueryui.d.ts" />
/// <reference path="../../../scripts/beatcode/typings/moment.d.ts" />
/// <reference path="../../../scripts/beatcode/typings/kendo-ui/kendo-ui.d.ts" />
/// <reference path="../../../scripts/beatcode/typings/es6-shim.d.ts" />
/// <reference path="../../../scripts/beatcode/beatcode.d.ts" />

import {Component, provide, Injectable, ElementRef, AfterViewInit, ChangeDetectionStrategy} from 'angular2/core';
import {FORM_PROVIDERS, NgModel} from 'angular2/common';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router, HashLocationStrategy, LocationStrategy } from 'angular2/router';
import { Http, HTTP_PROVIDERS, Response, Request, RequestOptions, RequestMethod, Headers, BrowserXhr } from 'angular2/http';
import {bootstrap} from 'angular2/platform/browser';
import { TestLogger } from 'beatcode/services/logger';
import { MenuComponent, GlobalDataSharing, MenuItem, IRouteMechanism } from 'beatcode/controls/menu';
import { LocalStorageService } from 'beatcode/services/local-storage.service';
import { RhetosRestService } from 'beatcode/services/rhetos-rest.service';

import { PermissionProvider } from 'beatcode/services/permission-provider.service';
import { IDataStructure, IEntityDataService, OverrideComponentDescriptor, IEntityContainer } from 'beatcode/models/interfaces';
import { ComponentOverridesFactory } from 'beatcode/factories/component-overrides.factory';
import { DataOverridesFactory } from 'beatcode/factories/data-overrides.factory';
import { AppSettings } from 'beatcode/app/app.settings';

import { RestaurantListComponent } from './../components/restaurant/restaurant-list.component';

declare var jQuery: JQueryStatic;

@Component({
    selector: "food-app",
    directives: [ROUTER_DIRECTIVES, MenuComponent],
    template: `
	<app-menu></app-menu>
    <div class="container body-content">
		<h1>Food app</h1>
		<div class="col-xs-9" style="border:1px;">
			<router-outlet></router-outlet>
		</div>
		<hr />
		<footer>
			<p>&copy; 2016 - FoodApp provided by BeatCode</p>
		</footer>
	</div>
    `
})
@RouteConfig([
    { path: 'food-app/', name: 'FoodApp', component: RestaurantListComponent, useAsDefault: true }
])
class FoodAppComponent implements AfterViewInit {

    constructor(private m_elementRef: ElementRef,
        private logger: TestLogger,
        private http: Http,
        private permissionService: PermissionProvider
    ) {
		AppSettings.API_ENDPOINT = 'http://dprugovecki-pc:8040/FoodRhetos/REST/';
		permissionService.reloadAllAuthorizedClaims();
    }

    ngAfterViewInit() {
        this.logger.log("Application initialized!");
    }
    
}

@Injectable()
export class CORSBrowserXHr extends BrowserXhr {

    build(): any {
        var x: any = super.build();
        x['withCredentials'] = true;
        return x;
    }
}

bootstrap(FoodAppComponent, [
    RhetosRestService, PermissionProvider, LocalStorageService, ComponentOverridesFactory, IEntityContainer, DataOverridesFactory,

    provide(IEntityDataService, { useClass: RhetosRestService }),

    provide(TestLogger, { useClass: TestLogger }),
    provide(GlobalDataSharing, { useClass: GlobalDataSharing }),
    HTTP_PROVIDERS, ROUTER_PROVIDERS, FORM_PROVIDERS, NgModel,
    provide(BrowserXhr, { useClass: CORSBrowserXHr }),
    provide(LocationStrategy, { useClass: HashLocationStrategy })
]);