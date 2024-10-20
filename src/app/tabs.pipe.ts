import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tabs',
  standalone: true
})
export class TabsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
