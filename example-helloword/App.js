import { h } from '../lib/guide-mini-vue.esm.js';
import { Foo } from './Foo.js';
export const App = {
  render() {
    return h(
      'div',
      {
        id: 'test',
        style: 'color:pink',
        onClick() {
          console.log('click');
        }
      },
      [
        h('div', {}, `hi ${this.msg}`),
        h(
          Foo,
          {
            count: 1,
            onAdd(a, b) {
              console.log('a+b', a + b);
            }
          },
          {
            header: h('p', {}, '111'),
            footer: h('p', {}, '222')
          }
          // h('p', {}, '111')
        )
      ]
      // this.msg
      // [h('div', { style: 'red' }, [h('div', {}, '你好'), h('div', {}, 'listen')]), h('div', {}, 'hh' + this.msg)]
    );
  },
  setup() {
    return {
      msg: 'mini-213vue123'
    };
  }
};
