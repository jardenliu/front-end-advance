function PromiseA(executor) {
  this.state = "pending"; // 初始化state为等待态
  this.value = undefined; // 成功的值
  this.reason = undefined; // 失败的原因

  this.onResolvedCallbacks = []; // 存储成功的回调
  this.onRejectedCallbacks = []; // 存储失败的回调

  let resolve = (value) => {
    if (this.state === "pending") {
      this.state = "fulfilled";
      this.value = value;
      this.onResolvedCallbacks.forEach((fn) => fn());
    }
  };
  let reject = (reason) => {
    if (this.state === "pending") {
      this.state = "rejected";
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
    }
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

PromiseA.prototype.then = function (onFulfilled, onReject) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (val) => value;

  onReject =
    typeof onReject === "function"
      ? onReject
      : (err) => {
          throw err;
        };

  let promise = new PromiseA((resolve, reject) => {
    if (this.state === "fulfilled") {
      queueMicrotask(() => {
        try {
          let res = onFulfilled(this.value);
          resolvePromise(promise, res, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    if (this.state === "rejected") {
      queueMicrotask(() => {
        try {
          let res = onReject(this.reason);
          resolvePromise(promise, res, resolve, reject);
        } catch (error) {
          reject(error);
        }
      });
    }

    if (this.state === "pending") {
      this.onResolvedCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            let res = onFulfilled(this.value);
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });

      this.onRejectedCallbacks.push(() => {
        queueMicrotask(() => {
          try {
            let res = onReject(this.reason);
            resolvePromise(promise, res, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      });
    }
  });

  return promise;
};

PromiseA.prototype.catch = function (reject) {
  return this.then(null, reject);
};

PromiseA.resolve = function (val) {
  return new PromiseA((resolve) => resolve(val));
};

PromiseA.reject = function (val) {
  return new PromiseA((resolve, reject) => reject(val));
};

PromiseA.race = function (promises) {
  return new PromiseA((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      promise[i].then(resolve, reject);
    }
  });
};

PromiseA.all = function (promises) {
  let arr = [];
  function processData(index, data, resolve) {
    arr[index] = data;
    if (index + 1 === promises.length) {
      resolve(arr);
    }
  }

  return new PromiseA((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];
      promise.then((data) => {
        console.log("🚀 ~ file: tmp.js ~ line 109 ~ promise.then ~ data", data);
        processData(i, data, resolve);
      }, reject);
    }
  });
};

function resolvePromise(promise, res, resolve, reject) {
  if (res === promise) {
    return reject(new TypeError("Promis循环调用"));
  }

  let called = null;

  if (res !== null && (typeof res === "object" || typeof res === "function")) {
    try {
      let then = res.then;
      if (then === PromiseA.prototype.then) {
        then.call(
          res,
          (val) => {
            if (called) return;
            called = true;
            resolvePromise(promise, val, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(res);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(res);
  }
}

let a = new PromiseA((resolve, reject) => {
  console.log("copy");
  resolve("res");
})
  .then((res) => {
    console.log("copy", res);
    return new PromiseA((resolve, reject) => {
      resolve("copy");
    });
  })
  .then((res) => {
    console.log(res);
    return PromiseA.resolve("copy 2");
  })
  .then((res) => {
    console.log(res);
    return PromiseA.reject("copy 3 err");
  })
  .catch((err) => {
    console.log(err);
  });

new Promise((resolve, reject) => {
  console.log("origin");
  resolve("res");
})
  .then((res) => {
    console.log("origin", res);
    return new Promise((res) => res("origin"));
  })
  .then((res) => {
    console.log(res);
    return Promise.resolve("origin 2");
  })
  .then((res) => {
    console.log(res);
    return Promise.reject("origin 3 err");
  })
  .catch((err) => {
    console.log(err);
  });
