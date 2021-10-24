import { Action } from './action';

export class Heal extends Action{

  constructor(description: string , order: string[]) {
    super(description, order);
  }

}