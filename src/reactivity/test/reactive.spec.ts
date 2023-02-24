import { effect } from '../effect';
import { isReactive, isReadonly, reactive } from '../reactive';

it('reactive', () => {
  const obj: any = reactive({
    age: 19,
    a: {
      b: {
        c: 1
      }
    }
  });
  let me;
  effect(() => {
    me = obj.age;
  });
  let exc;
  effect(() => {
    exc = obj.a.b.c;
  });
  expect(me).toBe(19);
  expect(exc).toBe(1);
  if (obj.age) {
    obj.age++;
  }
  // obj.a.b.c++
  expect(me).toBe(20);
  // expect(exc).toBe(2)
});

it('reactive deep', () => {
  const original = {
    nested: {
      foo: 1
    },
    array: [{ name: 'sc' }]
  };

  const observed: any = reactive(original);
  expect(isReactive(observed.nested)).toBe(true);
  expect(isReadonly(observed.nested.foo)).toBe(false);
  let fo = 0;
  effect(() => {
    fo = observed.nested.foo;
  });
  expect(fo).toBe(1);
  observed.nested.foo++;
  expect(fo).toBe(2);
  let obj;
  effect(() => {
    obj = observed.array;
  });
  expect(obj).toStrictEqual([{ name: 'sc' }]);
  // observed.array.push({ name: 'ls' });
  // expect(obj).toStrictEqual([{ name: 'sc' }, { name: 'ls' }]);
});
