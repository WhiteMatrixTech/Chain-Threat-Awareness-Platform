import EventEmitter from 'eventemitter3';

export const emitter = new EventEmitter();

export enum InternalEventType {
  SAVE_CONTRACT = 'save_contract'
}
