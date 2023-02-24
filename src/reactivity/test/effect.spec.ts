import { effect, stop } from '../effect'
import { reactive } from '../reactive'
it('effect', () => {
  let foo = 10
  const runner = effect(() => {
    foo++
    return 'foo'
  })
  expect(foo).toBe(11)
  const r = runner()
  expect(foo).toBe(12)
  expect(r).toBe('foo')
})

it('scheduler', () => {
  // 功能：1. effect接受两个参数，第一个为Fn，第二个为配置对象，有一个参数scheduler是一个方法
  // 2. 初次加载时,fn调用，响应数据改变时，scheduler调用(如果有) , 返回的runner调用时，fn调用
  let dummy
  let run
  const scheduler: any = jest.fn(() => {
    run = runner
  })
  const obj: any = reactive({ foo: 1 })
  const runner = effect(
    () => {
      dummy = obj.foo
    },
    { scheduler }
  )
  expect(scheduler).not.toHaveBeenCalled()
  expect(dummy).toBe(1)
  obj.foo++
  expect(scheduler).toHaveBeenCalledTimes(1)
  expect(dummy).toBe(1)
  run()
  expect(dummy).toBe(2)
})

it('stop', () => {
  // 功能：可以从effect中抽离出来stop函数，当调用后(传入对应runner)，则该响应状态在改变后不会进行通知，在runner()调用后才会进行通知
  // 实现： 抽离一个stop方法，当调用时，将收集指定的runner给删除掉，等到重新调用runner时，在进行加入
  let dummy
  const obj: any = reactive({ prop: 1 })
  const runner: any = effect(() => {
    dummy = obj.prop
  })
  obj.prop = 2
  expect(dummy).toBe(2)
  stop(runner)
  // obj.prop = 3
  // ++ 先get在set?
  obj.prop++
  expect(dummy).toBe(2)
  runner()
  expect(dummy).toBe(3)
})

it('onStop', () => {
  // 在stop被调用时,onStop将作为stop完成后的回调函数被执行
  const obj: any = reactive({
    foo: 1
  })
  const onStop = jest.fn()
  let dummy
  const runner = effect(
    () => {
      dummy = obj.foo
    },
    { onStop }
  )
  stop(runner)
  expect(onStop).toBeCalledTimes(1)
})
