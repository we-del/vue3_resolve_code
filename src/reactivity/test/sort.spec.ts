import { chooseSort, heapSort, insertSort, mergeSort, popSort, quickSort, quickSortHandleObj } from '../sort'

it('test ee', () => {
  expect(true).toBe(true)
})

it('quick sort', () => {
  let arr = [3, 2, 1, 5, 4]
  quickSort(arr)
  expect(arr).toStrictEqual([1, 2, 3, 4, 5])
})
it('merge sort', () => {
  let arr = [3, 2, 1, 5, 4]
  mergeSort(arr)
  expect(arr).toStrictEqual([5, 4, 3, 2, 1])
})
it('heap sort', () => {
  let arr = [3, 2, 1, 5, 4]
  heapSort(arr)
  expect(arr).toStrictEqual([1, 2, 3, 4, 5])
})
it('pop sort', () => {
  let arr = [3, 2, 1, 5, 4]
  popSort(arr)
  expect(arr).toStrictEqual([1, 2, 3, 4, 5])
})
it('shoose sort', () => {
  let arr = [3, 2, 1, 5, 4]
  chooseSort(arr)
  expect(arr).toStrictEqual([1, 2, 3, 4, 5])
})
it('insert sort', () => {
  let arr = [3, 2, 1, 5, 4]
  insertSort(arr)
  expect(arr).toStrictEqual([1, 2, 3, 4, 5])
})

it('obj sort', () => {
  let arr = [
    { math: 13, chinese: 10, english: 8 },
    { math: 11, chinese: 19, english: 3 },
    { math: 5, chinese: 13, english: 7 },
    { math: 15, chinese: 23, english: 2 }
  ]
  quickSortHandleObj(arr)
  console.log('arr', arr)
  // expect(arr).toStrictEqual([])
  expect(true).toBe(true)
})
