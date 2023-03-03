import { ShapeFlags } from '../shared/ShapeFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  // debugger;
  patch(vnode, container);
}

// 虚拟结点对比
function patch(vnode, container) {
  // TODO 判断vnode 是不是一个 element
  // 如果是 element 那么就应该处理 element
  // debugger
  if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));

  const { props } = vnode;
  const isOn = /^on[A-Z]/;
  for (const key in props) {
    if (isOn.test(key)) {
      const event = key.slice(2).toLocaleLowerCase();
      const fn = props[key];
      el.addEventListener(event, fn);
    } else {
      const val = props[key];
      el.setAttribute(key, val);
    }
  }
  const { children, shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el);
  }
  container.append(el);
}

function mountChildren(children, el): any {
  children.forEach(c => {
    patch(c, el);
  });
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(initialVNode, instance, container);
}

function setupRenderEffect(initialVNode, instance: any, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);

  initialVNode.el = subTree.el;
}
