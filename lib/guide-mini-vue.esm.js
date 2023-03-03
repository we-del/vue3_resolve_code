const extend = (...obj) => Object.assign(...obj);
const isObject = target => typeof target === 'object';
const typeAssert = target => {
    const s = Object.prototype.toString.call(target);
    const pattern = /\[\s*object (.*)\s*\]/;
    console.log('pattern.exec(s)', pattern.exec(s));
    return pattern.exec(s)[1].toLowerCase();
};
// ->  字体为什么没效果

class EffectActive {
    constructor(fn, scheduler) {
        EffectActive.depTarget = this;
        this._fn = fn;
        if (scheduler) {
            this.scheduler = scheduler;
        }
        this.run();
        EffectActive.depTarget = null;
    }
    run() {
        this.isActive = true;
        this._val = this._fn();
        return this._val;
    }
    // 暂停监听，即将当前对象从依赖列表里移除
    stop() {
        if (this.isActive)
            this.cleanRelyList();
        this.isActive = false;
    }
    cleanRelyList() {
        // 从依赖列表中移除自己
        this.relyList.delete(this.meEffect);
        if (this.onStop)
            this.onStop();
    }
}

function createGetter(isReadonly = false, isShallow = false) {
    return function (target, key) {
        // 开闭原则，在新增功能时不要破坏原有代码结构，即在其基础上开发
        if (ReactiveOptionUtil.IS_REACTIVE === key) {
            return !isReadonly;
        }
        else if (ReactiveOptionUtil.IS_READONLY === key) {
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
        if (isReadonly)
            return;
        const res = Reflect.set(target, key, value);
        console.log('res', res);
        trigger(target, key);
        return res;
    };
}
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
const shallowReactiveGet = createGetter(false, true);
const mutableHandlers = { get, set };
const readonlyHandlers = {
    get: readonlyGet,
    set() {
        console.warn('只读的属性不能被调用');
        return true;
    }
};
// Object.sign 可以从第一个参数开始向最后一个参数执行，依次合并每个参数上的属性和方法，如果出现重复则后面的覆盖前面的
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});
extend({}, mutableHandlers, {
    get: shallowReactiveGet
});
// map 特性
let map;
// 一个对象生成一个对应的map用于存储数据
// 依赖使用set存储
// 依赖收集
function track(target, key) {
    // 避免effect在stop后，再次get可能出现的怪异行为
    if (!existEffect())
        return;
    // console.log('track ::  target,key', target, key)
    // 创建根部容器
    if (!map)
        map = new Map();
    // 创建对应容器
    if (!map.has(target))
        map.set(target, new Map());
    const rootContainer = map.get(target);
    // 如果是复杂数据类型则需要递归的进行map映射生成依赖存储
    // 给对应的复杂数据类型key分配set实例，用于存储watcher
    if (!rootContainer.has(key))
        rootContainer.set(key, new Set());
    const dep = rootContainer.get(key);
    effectCollector(dep);
}
function existEffect() {
    return !!EffectActive.depTarget;
}
// 返回当前指向的EffectActive实例
function getTargetEffect() {
    return EffectActive.depTarget;
}
// 收集依赖
function effectCollector(dep) {
    const target = getTargetEffect();
    if (typeAssert(target) === 'Set') {
        for (const t of target) {
            dep.add(target);
        }
    }
    else {
        if (!(target instanceof EffectActive))
            return;
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
    if (!map.has(target))
        return;
    const rootContainer = map.get(target);
    const dep = rootContainer.get(key);
    effectTrigger(dep);
}
function effectTrigger(dep) {
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        }
        else {
            effect.run();
        }
    }
}

function reactive(target) {
    return defineProxy(target, mutableHandlers);
}
function readonly(target) {
    return defineProxy(target, readonlyHandlers);
}
function defineProxy(target, config) {
    return new Proxy(target, config);
}
var ReactiveOptionUtil;
(function (ReactiveOptionUtil) {
    ReactiveOptionUtil["IS_READONLY"] = "__is_readonly";
    ReactiveOptionUtil["IS_REACTIVE"] = "__is_reactive";
})(ReactiveOptionUtil || (ReactiveOptionUtil = {}));
function shallowReadonly(target) {
    return defineProxy(target, shallowReadonlyHandlers);
}

// 将 add-foo -> addFoo 写法，使用replace替换
const camelize = (str) => {
    return str.replace(/-(\w)/g, (_, g1) => g1 && g1.toUpperCase());
};
// 将首字母变为大写
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
// 加上事件标识
const toHandlerKey = (str) => {
    return str ? 'on' + capitalize(str) : '';
};

function emit(instance, event, ...args) {
    console.log('emit', event);
    const { props } = instance;
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
    // console.log(' handler(...args)', handler(...args));
    // const handler = props['onAdd'];
}

function initSlots(instance, children) {
    normalizeObjectSlots(children, instance.slots);
}
function normalizeObjectSlots(children, slots) {
    for (const key in children) {
        const value = children[key];
        slots[key] = normalizeSlotValue(value);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

const publicPropertiesMap = {
    $el: i => i.vnode.el,
    $slots: i => i.slots
};
const PublicInstanceProxyHandlers = {
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
        }
        else if (Reflect.has(props, key)) {
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

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
}

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { }
    };
    // 将emit绑定到组件上，并传入了一个固定参数component(优化，避免用户需要传入实例对象)
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    console.log('instance', instance);
    // todo
    initProps(instance, instance.vnode.props);
    // initSlots(instance, instance.vnode.children);
    initSlots(instance, instance.vnode.slots);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    // 模板解析代理
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    // if (Component.render) {
    instance.render = Component.render;
    // }
}

function render(vnode, container) {
    // debugger;
    patch(vnode, container);
}
// 虚拟结点对比
function patch(vnode, container) {
    // TODO 判断vnode 是不是一个 element
    // 如果是 element 那么就应该处理 element
    // debugger
    if (vnode.shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { props } = vnode;
    const isOn = /^on[A-Z]/;
    for (const key in props) {
        if (isOn.test(key)) {
            const event = key.slice(2).toLocaleLowerCase();
            const fn = props[key];
            el.addEventListener(event, fn);
        }
        else {
            const val = props[key];
            el.setAttribute(key, val);
        }
    }
    const { children, shapeFlag } = vnode;
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(children, el);
    }
    container.append(el);
}
function mountChildren(children, el) {
    children.forEach(c => {
        patch(c, el);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    const instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(initialVNode, instance, container);
}
function setupRenderEffect(initialVNode, instance, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
    initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        //组件的类型标注，同时最多可以有两个标记(当前标签是元素还是组件，当前子元素是标签还是组件)
        shapeFlag: getShapeFlag(type),
        el: null
    };
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount(root) {
            // 先 vnode
            // component -> vnode
            // 所有逻辑操作 都会基于 vnode 做处理，然后渲染为真实dom
            const rootContainer = document.querySelector(root);
            const vnode = createVNode(rootComponent);
            debugger;
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name) {
    const slot = slots[name];
    if (slot) {
        debugger;
        return createVNode('div', {}, slots);
    }
}

export { createApp, h, renderSlots };
