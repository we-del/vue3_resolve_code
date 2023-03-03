import { shallowReadonly } from '../reactivity/reactive';
import { emit } from './componentEmit';
import { initSlots } from './componentSlots';
import { PublicInstanceProxyHandlers } from './componentsPublicInstance';
import { initProps } from './compoonentProps';

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => {}
  };
  // 将emit绑定到组件上，并传入了一个固定参数component(优化，避免用户需要传入实例对象)
  component.emit = emit.bind(null, component);
  return component;
}

export function setupComponent(instance) {
  console.log('instance', instance);
  // todo
  initProps(instance, instance.vnode.props);
  // initSlots(instance, instance.vnode.children);
  initSlots(instance, instance.vnode.slots);

  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
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

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;
  // if (Component.render) {
  instance.render = Component.render;
  // }
}
