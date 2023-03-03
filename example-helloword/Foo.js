import { h, renderSlots } from '../lib/guide-mini-vue.esm.js';
export const Foo = {
  setup(props, { emit }) {
    console.log('props', props);
    const emitAdd = () => {
      console.log('emit add ');
      emit('add', 1, 2);
      return;
    };
    return {
      emitAdd
    };
  },
  render() {
    const btn = h(
      'button',
      {
        onClick: this.emitAdd
      },
      'emitAdd'
    );
    console.log('this.$slots', this.$slots);
    // this.$slots
    return h('div', {}, [
      renderSlots(this.$slots, 'header'), 
      h('div', {}, 'foo:' + this.count),
       btn, 
      renderSlots(this.$slots, 'footer')
    ]);
  }
};
