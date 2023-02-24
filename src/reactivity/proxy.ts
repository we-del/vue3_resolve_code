import { extend, isObject, typeAssert } from '../utils';
import { EffectActive } from './effect';
import { reactive, ReactiveOptionUtil, readonly } from './reactive';
function createGetter(isReadonly = false, isShallow = false) {
  return function (target, key) {
    // 开闭原则，在新增功能时不要破坏原有代码结构，即在其基础上开发
    if (ReactiveOptionUtil.IS_REACTIVE === key) {
      return !isReadonly;
    } else if (ReactiveOptionUtil.IS_READONLY === key) {
      return isReadonly;
    }
    const res = Reflect.get(target, key);
    // let deepWatcher;

    if (isObject(res) && !isShallow) {
      // 返回深层对象的代理 ，现阶段只能处理深度嵌套下已有字段的简单数据类型数据，返回对象的话期待处理
      return isReadonly ? readonly(res) : reactive(res);
      // 反回深度监听后的对象
      // deepWatcher = isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter(isReadonly = false) {
  return function (target, key, value) {
    if (isReadonly) return;
    const res = Reflect.set(target, key, value);
    console.log('res', res);
    trigger(target, key);
    return res;
  };
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
export const mutableHandlers = { get, set };

export const readonlyHandlers = {
  get: readonlyGet,
  set() {
    console.warn('只读的属性不能被调用');
    return true;
  }
};

// Object.sign 可以从第一个参数开始向最后一个参数执行，依次合并每个参数上的属性和方法，如果出现重复则后面的覆盖前面的
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});

export const shallowReactiveHandlers = extend({}, mutableHandlers, {
  get: shallowReactiveGet
});

// map 特性
let map: Map<any, any>;
// 一个对象生成一个对应的map用于存储数据
// 依赖使用set存储
// 依赖收集
function track(target, key) {
  // 避免effect在stop后，再次get可能出现的怪异行为
  if (!existEffect()) return;
  // console.log('track ::  target,key', target, key)
  // 创建根部容器
  if (!map) map = new Map();
  // 创建对应容器
  if (!map.has(target)) map.set(target, new Map());
  const rootContainer = map.get(target);

  // 如果是复杂数据类型则需要递归的进行map映射生成依赖存储
  // 给对应的复杂数据类型key分配set实例，用于存储watcher
  if (!rootContainer.has(key)) rootContainer.set(key, new Set());
  const dep = rootContainer.get(key);
  effectCollector(dep);
}

export function existEffect() {
  return !!EffectActive.depTarget;
}

// 返回当前指向的EffectActive实例
export function getTargetEffect() {
  return EffectActive.depTarget;
}

// 向EffectActive中注入依赖
export function setEffectRely(dep: Set<any>) {
  EffectActive.depTarget = dep;
}

// 清除依赖
export function clearEffectTarget() {
  EffectActive.depTarget = null;
}

// 收集依赖
export function effectCollector(dep) {
  const target = getTargetEffect();

  if (typeAssert(target) === 'Set') {
    for (const t of <Set<any>>target) {
      dep.add(target);
    }
  } else {
    if (!(target instanceof EffectActive)) return;
    // 将依赖收集
    dep.add(target);

    // =========================   effect引用其本身,方便在stop时能够清除   ============================//
    // 将静态属性的属性收集的依赖指向其本身
    target.meEffect = target;
    // 将静态属性收集的依赖的属性值指向收集列表
    target.relyList = dep;
  }
}

// 触发依赖
function trigger(target, key) {
  // console.log('trigger:: target,key', target, key)
  if (!map.has(target)) return;
  const rootContainer = map.get(target);
  const dep = rootContainer.get(key);
  effectTrigger(dep);
}

export function effectTrigger(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
