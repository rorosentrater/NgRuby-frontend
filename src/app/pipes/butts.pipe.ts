import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'butts'
})
export class ButtsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return value + ' like butts';
  }

}
