﻿import {Provider, provide, Injector, OpaqueToken, Injectable, NoProviderError, OnInit } from 'angular2/core';
import { GlobalDataSharing, Storage } from './../controls/menu';
import { OverrideComponentDescriptor, IOverrideDetailComponent, IEmptyConstruct, DecoratorRegistrations } from './../models/interfaces';

@Injectable()
export class ComponentOverridesFactory {
    private registeredOverrides: Storage<OverrideComponentDescriptor> = new Storage<OverrideComponentDescriptor>();
    private _plainOverrides: Array<OverrideComponentDescriptor> = new Array<OverrideComponentDescriptor>();

    constructor(private globalDataShare: GlobalDataSharing) {
        console.log('ComponentOverridesFactory instatinated!');
        this.registeredOverrides = this.globalDataShare.getSharedData<OverrideComponentDescriptor>("ComponentDetailOverrides");
        DecoratorRegistrations.registeredDecorators.filter(x => x instanceof OverrideComponentDescriptor).map(exDecorated => this.registeredOverrides.data.push(exDecorated));

        this._plainOverrides = this.registeredOverrides.data;

        this.registeredOverrides.OnUpdate.subscribe((newItem: OverrideComponentDescriptor) => {
            console.log("New override registered for: " + newItem.overrideComponent);
            this._plainOverrides = this.registeredOverrides.data;
        }, () => { }, () => { });
    }

    // returns Type
    public getAllComponentOverrides(componentListenerDescriptors: Array<string>): OverrideComponentDescriptor[]
    {
        return this._plainOverrides.filter(x => componentListenerDescriptors.indexOf(x.hostComponentDescriptor) >= 0).map(x => x);
    }
}
