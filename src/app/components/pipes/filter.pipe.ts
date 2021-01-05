import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../power-user/power-user.component';

@Pipe({ name: 'userFilter' })
export class FilterPipe implements PipeTransform {
  /**
   * Transform
   *
   * @param {any[]} items
   * @param {string} searchText
   * @returns {any[]}
   */
  transform(items: User[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.username.toLocaleLowerCase().includes(searchText);
    });
  }
}