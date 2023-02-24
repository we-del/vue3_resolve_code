import { EffectActive } from './effect';

export function computed(getter) {
  return new ComputedImpl(getter);
}

class ComputedImpl {
  getter: any;
  isCache: boolean = false;
  _value: any;

  effectActive: EffectActive;
  // isCollect:boolean = false
  constructor(getter) {
    this.getter = getter;
  }

  // 给类添加劫持属性value
  public get value() {
    const self = this;
    if (!this.isCache) {
      if (!this.effectActive) {
        this.effectActive = new EffectActive(this.getter, () => {
          this.isCache = false;
        });
        this._value = this.effectActive._val;
      } else {
        this._value = this.effectActive.run();
      }

      this.isCache = true;
    }
    return this._value;
  }
}
