import { Action } from './action';

export class Expedition extends Action{

  constructor(description: string , order: string[]) {
    super(description, order);
  }

}