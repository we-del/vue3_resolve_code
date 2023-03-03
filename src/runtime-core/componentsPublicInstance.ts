const publicPropertiesMap = {
  $el: i => i.vnode.el,
  $slots: i => i.slots
};
export const PublicInstanceProxyHandlers = {
  // 解构_属性并起了一个别名 instance  ,(此写法只能在解构的对象属性为_时使用)，少用
  // get({ _: instance }, key) {
  get(target, key) {
    let instance = target._;
    const { setupState, props } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    if (Reflect.has(setupState, key)) {
      return setupState[key];
    } else if (Reflect.has(props, key)) {
      return props[key];
    }

    // 将每一个可扩展的数据存储到对象中存户
    // if (key === '$el') {
    //   return instance.vnode.el;
    // }
    // 获取$el对象
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  }
};
