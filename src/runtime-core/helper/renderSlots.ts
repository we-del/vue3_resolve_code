import { createVNode } from '../vnode';

export function renderSlots(slots, name) {
  const slot = slots[name];
  if (slot) {
    debugger
    return createVNode('div', {}, slots);
  }
}
