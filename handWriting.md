
# 手写

### 防抖 deboundcing
> 当一个事件发生时，事件处理器需要等一定阈值事件，如果这段时间过去之后，再也没有事件发生，就处理最后一次发生的事件。假设还差`0.01`秒就到达指定事件，这时由来了一个新事件，之前等待作废，需要重新等待阈值时间。

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