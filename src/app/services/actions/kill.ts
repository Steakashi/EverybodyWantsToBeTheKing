import { Action } from './action';

export class Kill extends Action{

  NEEDS_TARGET = true;

  constructor(description: string , order: string[]) {
    super(description, order);
  }

}