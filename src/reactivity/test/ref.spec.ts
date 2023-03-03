import { typeAssert } from '../../utils';
import { effect } from '../effect';
import { isRef, proxyRefs, qw, ref } from '../ref';

describe('ref test', () => {
  it('ref base on easy type', () => {
    const a = ref<number>(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it('ref base on complicated type', () => {
    const a = ref<{ count: number }>({
      count: 1,
      foo: { v: 1 }
    });
    let dummy;
    let val;
    effect(() => {
      dummy = a.value.count;
      val = a.value.foo.v;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
    expect(val).toBe(1);
    a.value.foo.v++;
    expect(val).toBe(2);
  });

  it('change quote type', () => {
    const a = ref<{ count: number }>({
      count: 1
    });
    let dummy;
    let val;
    effect(() => {
      dummy = a.value;
    });
    expect(dummy).toStrictEqual({ count: 1 });
    a.value = {
      count: 2
    };

    expect(dummy).toStrictEqual({ count: 2 });
    a.value.count = 5;
    expect(dummy).toStrictEqual({ count: 5 });
  });

  it('assert type', () => {
    expect(typeAssert('1')).toBe('String');
    expect(typeAssert(1)).toBe('Number');
    expect(typeAssert([])).toBe('Array');
    expect(typeAssert(new Set())).toBe('Set');
    expect(typeAssert(new Map())).toBe('Map');
  });

  it('isRef unRef', () => {
    const a = ref(1);
    const b = 1;
    expect(isRef(a)).toBe(true);
    expect(isRef(b)).toBe(false);
    expect(qw(a)).toBe(1);
    expect(qw(b)).toBe(1);
  });

  // vue3在jinx模板解析时使用了该代理，也就是为什么 模板中无需使用 refIntancce.value 得到指(地层使用proxy代理代理了ref，得到值时jinx解构，赋值时进行调用)
  it('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'xiaohong'
    };
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);
    expect(proxyUser.name).toBe('xiaohong');

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);
  });
});
