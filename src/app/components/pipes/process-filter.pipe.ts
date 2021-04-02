import { Pipe, PipeTransform } from '@angular/core';
import { ProcessingObject } from '../power-user/power-user.component';

@Pipe({
  name: 'processFilter'
})
export class ProcessFilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: ProcessingObject[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(item => {
      if(item.processId != null ) {
        return item.processId.toLocaleLowerCase().includes(searchText);
      }
    });
  }

}
