import { computed } from '../computed';
import { reactive } from '../reactive';

describe('computed test', () => {
  // computed 可以缓存某个响应式数据的一个或多个值(并可以组成一个新的结果)，当该响应式数据变化后computed也会更新

  it('sezy test', () => {
    const user = reactive({
      age: 1
    });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(1);
  });

  it('cache computed', () => {
    const value = reactive({
      foo: 1
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);

    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);
    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });

  it('computed complicated', () => {
    const val = reactive({
      n1: 2,
      n2: 3
    });
    const pro = computed(() => val.n1 + val.n2);
    const a = pro.value;
    expect(a).toBe(5);
    val.n1 = 6;
    expect(pro.value).toBe(9);
  });
});
