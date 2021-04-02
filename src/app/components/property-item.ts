import { Type } from '@angular/core';

export class PropertyItem {
    constructor(public component: Type<any>, public propertyData: any) {

    }
}