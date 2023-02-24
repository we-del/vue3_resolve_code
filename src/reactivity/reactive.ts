import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from './proxy';
export function reactive(target: any[] | { [pros: string]: any }) {
  return defineProxy(target, mutableHandlers);
}

export function readonly(target: any[] | { [pros: string]: any }) {
  return defineProxy(target, readonlyHandlers);
}

function defineProxy(target, config) {
  return new Proxy(target, config);
}

export enum ReactiveOptionUtil {
  IS_READONLY = '__is_readonly',
  IS_REACTIVE = '__is_reactive'
}

export function isReactive(target: any[] | { [pros: string]: any }) {
  return !!target[ReactiveOptionUtil.IS_REACTIVE];
}

export function isReadonly(target: any[] | { [pros: string]: any }) {
  return !!target[ReactiveOptionUtil.IS_READONLY];
}

export function shallowReadonly(target: any[] | { [pros: string]: any }) {
  return defineProxy(target, shallowReadonlyHandlers);
}
export function shallowReactive(target: any[] | { [pros: string]: any }) {
  return defineProxy(target, shallowReactiveHandlers);
}

export function isProxy(target: any[] | { [pros: string]: any }) {
  return isReactive(target) || isReadonly(target);
}
