// 入门示例 对比数组的输出长度
// assert是Node.js内置断言模块
// 详尽api查看 https://nodejs.org/api/assert.html

let assert = require('assert')
describe('1. 入门示例', () => {
    describe('检验数组的长度', () => {
        it('[1,2,3,4,5] 的长度应该为5', () => {
            assert.equal(5, [1, 2, 3, 4, 5].length)
        })
    })
})