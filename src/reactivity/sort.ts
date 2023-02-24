export function quickSort(arr: number[]) {
  function process(left: number, right: number) {
    if (left >= right) return
    let l = left
    let r = right
    let pivot = arr[left]
    while (true) {
      while (l < r && arr[r] >= pivot) r--
      while (l < r && arr[l] <= pivot) l++
      if (l === r) {
        arr[left] = arr[l]
        arr[l] = pivot
        break
      }
      arr[l] ^= arr[r]
      arr[r] ^= arr[l]
      arr[l] ^= arr[r]
    }
    process(left, l - 1)
    process(l + 1, right)
  }
  process(0, arr.length - 1)
}

export function mergeSort(arr: number[]) {
  function sep(left: number, right: number) {
    if (left >= right) return
    let middle = Math.floor((right + left) / 2)
    sep(left, middle)
    sep(middle + 1, right)
    process(left, right, middle)
  }

  sep(0, arr.length - 1)
  function process(left: number, right: number, middle: number) {
    let tmpArr = []
    let l = left
    let r = middle + 1
    while (l <= middle && r <= right) {
      if (arr[l] >= arr[r]) {
        tmpArr.push(arr[l])
        l++
      } else {
        tmpArr.push(arr[r])
        r++
      }
    }
    while (l <= middle) {
      tmpArr.push(arr[l])
      l++
    }
    while (r <= right) {
      tmpArr.push(arr[r])
      r++
    }
    let i = 0
    while (left <= right) {
      arr[left++] = tmpArr[i++]
    }
  }
}

export function heapSort(arr: number[]) {
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    process(i, arr.length)
  }
  for (let i = arr.length - 1; i > 0; i--) {
    arr[0] ^= arr[i]
    arr[i] ^= arr[0]
    arr[0] ^= arr[i]
    process(0, i)
  }

  function process(i, len) {
    let cache = arr[i]

    for (let j = i * 2 + 1; j < len; j = i * 2 + 1) {
      if (j + 1 < len && arr[j + 1] > arr[j]) j++
      if (arr[j] > cache) {
        arr[i] = arr[j]
        i = j
      } else {
        // 避免进了if判断i移动到最底部(此时j>len导致循环退出)导致 不能完成赋值的情况
        break
      }
    }
    arr[i] = cache
  }
}

// 冒泡排序

export function popSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        arr[j] ^= arr[j + 1]
        arr[j + 1] ^= arr[j]
        arr[j] ^= arr[j + 1]
      }
    }
  }
}

// 选择排序
export function chooseSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[i] < arr[j]) {
        arr[i] ^= arr[j]
        arr[j] ^= arr[i]
        arr[i] ^= arr[j]
      }
    }
  }
}
// 插入排序
export function insertSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j > 0 && arr[j] < arr[j - 1]; j--) {
      arr[j] ^= arr[j - 1]
      arr[j - 1] ^= arr[j]
      arr[j] ^= arr[j - 1]
    }
  }
}

// 希尔排序
function shellSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
  }
}

export function grace(array: { chinese: number; math: number; english: number }[]) {
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      const cur = array[i].chinese + array[i].english + array[i].math
      const compare = array[j].chinese + array[j].english + array[j].math
      if (compare > cur) {
        const tmp = array[i]
        array[i] = array[j]
        array[j] = tmp
      }
    }
  }
}

// 使用快速排序对复杂数据类型进行排序处理(对象和数组处理，仅限number类型)
export function quickSortHandleObj<T>(arr: T[]) {
  function process(left, right) {
    if (left >= right) {
      return
    }
    let l = left
    let r = right
    let pivot = ObjValHandler(arr[left])
    while (true) {
      while (l < r && ObjValHandler(arr[r]) >= pivot) {
        r--
      }
      while (l < r && ObjValHandler(arr[l]) <= pivot) {
        l++
      }
      if (l === r) {
        let tmp = arr[left]
        arr[left] = arr[l]
        arr[l] = tmp
        break
      }
      let tmp = arr[l]
      arr[l] = arr[r]
      arr[r] = tmp
      process(left, l - 1)
      process(l + 1, right)
    }
  }

  function ObjValHandler(obj) {
    let res = 0
    for (const key in obj) {
      res += obj[key]
    }
    return res
  }
  process(0, arr.length - 1)
}
