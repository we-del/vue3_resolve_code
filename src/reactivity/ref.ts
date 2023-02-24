import { isObject } from '../utils';
import { effectTrigger, existEffect, getTargetEffect } from './proxy';
import { reactive } from './reactive';

export function ref<T>(target: T) {
  return new RefImpl(target);
}

export function isRef(target) {
  return !!target._v__isRef;
}

export function unRef(target) {
  return isRef(target) ? target.value : target;
}

export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, k) {
      return unRef(Reflect.get(target, k));
    },
    set(target, k, v) {
      if (isRef(v)) return (target[k] = v);
      else return (target[k].value = v);
    }
  });
}

class RefImpl {
  private _value;
  private dep: Set<any> | undefined;
  private _v__isRef = true;
  constructor(target) {
    if (isObject(target)) {
      this._value = reactive(target);
    } else {
      this._value = target;
    }
    this.dep = new Set();
  }

  // 依赖收集
  public get value(): string {
    if (existEffect()) this.dep.add(getTargetEffect());
    return this._value;
  }
  // 触发依赖
  public set value(v: any) {
    if (v === this._value) return;
    if (isObject(v)) {
      v = reactive(v);
    }
    this._value = v;
    effectTrigger(this.dep);
  }
}
