import { isProxy, isReactive, isReadonly, readonly, shallowReactive, shallowReadonly } from '../reactive';

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReactive(wrapped)).toBe(false);
    expect(wrapped.foo).toBe(1);
  });

  it('warn then call set', () => {
    console.warn = jest.fn();
    const user: any = readonly({
      age: 10
    });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });

  // 对一个对象的最外层属性添加代理，嵌套对象不会添加
  it('shallowReaadonly', () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);

    const observed = shallowReactive({ n: { foo: 1 } });
    expect(isReactive(observed)).toBe(true);
    expect(isReactive(observed.n)).toBe(false);
    expect(isProxy(props)).toBe(true);
    expect(isProxy(observed)).toBe(true);
    expect(isProxy({ name: 1 })).toBe(false);
  });
}); // 还不错 还不错，我很喜欢，这样避免了vim的收集工作