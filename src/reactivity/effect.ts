import { extend } from '../utils';
export function effect(fn, option?) {
  let effect = new EffectActive(fn, option);
  effect = extend(effect, option);
  const runner = effect.run.bind(effect);
  console.log('runner', runner);
  runner.effe = effect;
  return runner;
}

export class EffectActive {
  public _fn: any;
  // 当响应状态改变后，有scheduler优先执行scheduler，否则执行fn

  // 配置对象中的属性或方法,在实例外部通过Object.assign挂载到该实例身上
  // public scheduler: any
  // // 当调用stop时会触发的回调函数
  // public onStop: any
  // 收集每个watcher(effect)，全局唯一
  public static depTarget: EffectActive | Set<any>;
  // 收集当前effect（每个effect实例都存储一份自己的地址），以便在执行stop时，将自己从依赖列表里移除(当再次run时进行添加)
  public meEffect;
  // 收集当前effect所处的依赖列表，方便移除自己
  public relyList;

  // 记录当前effect是否已经被收集过
  public isActive;

  // 用于收集当前run的返回值，该值作用与computed方法
  public _val;
  scheduler: any;
  constructor(fn, scheduler?) {
    EffectActive.depTarget = this;
    this._fn = fn;
    if(scheduler){
      this.scheduler = scheduler
    }
    this.run();
    EffectActive.depTarget = null;
  }
  public run() {
    this.isActive = true;
    this._val = this._fn();
    return this._val
  }

  // 暂停监听，即将当前对象从依赖列表里移除
  public stop() {
    if (this.isActive) this.cleanRelyList();
    this.isActive = false;
  }
  public cleanRelyList() {
    // 从依赖列表中移除自己
    this.relyList.delete(this.meEffect);
    if (this.onStop) this.onStop();
  }
}

// 从响应状态的依赖列表中删除对应的watcher
export function stop(runner) {
  runner.effe.stop();
}

export function computedEffect(getter) {

}


