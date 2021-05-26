
# 手写

### 防抖 deboundcing
> 当一个事件发生时，事件处理器需要等一定阈值事件，如果这段时间过去之后，再也没有事件发生，就处理最后一次发生的事件。假设还差`0.01`秒就到达指定事件，这时由来了一个新事件，之前等待作废，需要重新等待阈值时间。

可以理解为不断重新计时，延迟区间

```ts
    function deboundccing(wait=50, immediate = false, fn: Function ) {
        let timer: number;

        return function() {
            if(immediate) {
                fn.apply(this, arguments)
            }

            if(timer) {
                clearTimeout(timer)
            }

            timer = setTimeout(()=>{
                fn.apply(this, arguments)
            },wait)

        }
    }
```


### 节流 throttling
> 可以理解为事件在一个管道中传输，加上这个节流阀以后，事件流速减慢，实际上这个函数的作用就是如实，他可以将调用频率限制在一个阈值内，例如1s，这就是说1s内不会调用两次

可以理解为固定区间，区间内只有一次事件调用

```ts
function throttling(wait = 50, noTrailing = false, fn: Function) {
  let prev: number = 0;
  let timer: number;
  return function () {
    const now = +new Date();
    if (now - prev > wait) {
      if (noTrailing) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          fn.apply(this, arguments);
        }, wait);
      } else {
        fn.apply(this, arguments);
      }
      prev = +new Date();
    }
  };
}

```

### flat 扁平化
> 可以理解为将一个多层的数组变成少层的数组

```js

function flaten(arr, depth) {
  let a = [];
  if (depth === 0) return arr;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (Array.isArray(item)) {
      a = a.concat(flaten(item, depth - 1));
    } else {
      a.push(item);
    }
  }

  return a;
}

Array.prototype._flat = function (depth) {
  let arr = this;
  const dep = Number(depth);
  depth = isNaN(dep) ? 1 : Math.floor(dep);
  depth = depth >= 0 ? depth : 0;

  return flaten(arr, depth);
};
```