import { render } from './renderer';
import { createVNode } from './vnode';

export function createApp(rootComponent) {
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
