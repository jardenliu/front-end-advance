describe('2. 断言', () => {
    //断言
    // Node.js 内置的assert
    const assert = require('assert')

    // assert.AssertionError 断言错误类 （Error的子类）
    // 10.x.x版本默认operator是strictEqual
    // assert.strictEqual默认运算符
    const DEFAULT_OPERATOR = process.version.match(/^v10\.\d\.\d$/) ? 'strictEqual' : ' === '

    const {
        message
    } = new assert.AssertionError({
        actual: 1, //实际值
        expected: 2, //期望值
        operator: DEFAULT_OPERATOR //运算符
    })

    describe('AssertError （assert 模块抛出的所有错误都是 AssertionError 类的实例）', () => {
        describe('验证assert抛出的Error', () => {
            try {
                assert.strictEqual(1, 2)
            } catch (err) {
                it('验证err是否为AssertionError的实例', () => {
                    assert(err instanceof assert.AssertionError) //true
                })
                it('验证err的默认运算符', () => {
                    assert.strictEqual(err.message, message) //信息对比
                })
                it('验证err的一些常用属性', () => {
                    assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]')
                    assert.strictEqual(err.actual, 1)
                    assert.strictEqual(err.expected, 2)
                    assert.strictEqual(err.code, 'ERR_ASSERTION')
                    assert.strictEqual(err.operator, DEFAULT_OPERATOR)
                    assert.strictEqual(err.generatedMessage, true)
                })

            }
        })

    })

    // strict模式 (legacy模式 被废弃)
    const assertStrict = assert.strict
    describe('assert strict模式 严谨模式', () => {
        describe('任何 assert 函数都会使用严格函数模式的等式', () => {
            it('assert.strict的deepEqual()相当于assert的deepStrictEqual()', () => {
                assert.strictEqual(assertStrict.deepEqual, assert.deepStrictEqual)
            })
        })
    })

    describe('assert(value,[,message])', () => {
        it('assert() 检查是否为真的值,相当于assert.ok()', () => {
            try {
                assert(1 === 2, ['1不等于2的啊^_^', '啦啦啦'])
            } catch (err) {
                assert.strictEqual(err.toString(), 'AssertionError [ERR_ASSERTION]: 1不等于2的啊^_^,啦啦啦')
            }

            try {
                assert.ok(1 === 2, ['1不等于2的啊^_^', '啦啦啦'])
            } catch (err) {
                assert.strictEqual(err.toString(), 'AssertionError [ERR_ASSERTION]: 1不等于2的啊^_^,啦啦啦')
            }
        })
    })


    describe('assert.deepEqual()和assert.deepStrictEqual() 深度相等', () => {
        describe('深度相等意味着子对象中可枚举的自身属性也会按以下规则递归地比较', () => {
            const obj1 = {
                a: {
                    b: 1
                }
            }
            const obj2 = {
                a: {
                    b: 2
                }
            }
            const obj3 = {
                a: {
                    b: 1
                }
            }
            const obj4 = Object.create(obj1)
            it('自身相等', () => {
                assert.deepEqual(obj1, obj1)
            })
            it('递归比较', () => {
                assert.deepEqual(obj1, obj3)
                try {
                    assert.deepEqual(obj1, obj2)
                } catch (err) {
                    //AssertionError [ERR_ASSERTION]: { a: { b: 1 } } deepEqual { a: { b: 2 } }
                    assert.strictEqual(err.toString(), 'AssertionError [ERR_ASSERTION]: { a: { b: 1 } } deepEqual { a: { b: 2 } }')
                }
            })
            it('指定原型的包含指定函数的对象', () => {
                try {
                    assert.deepEqual(obj1, obj4)
                } catch (err) {
                    //AssertionError [ERR_ASSERTION]: { a: { b: 1 } } deepEqual {}
                    assert.strictEqual(err.toString(), 'AssertionError [ERR_ASSERTION]: { a: { b: 1 } } deepEqual {}')
                }
            })
        })
    })

    describe('assert.doesNotReject 、assert.rejects、、assert.doesNotThrow 和assert.throws', () => {
        it('assert.doesNotReject 断言不会reject', () => {
            // 断言不会reject, reject的时候会报Got unwanted rejection
            assert.doesNotReject(() => new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject()
                }, 10)
            })).catch(err => {
                //[AssertionError [ERR_ASSERTION]: Got unwanted rejection
            })
        })

        it('assert.rejects 断言会reject', () => {
            // 断言会reject, resolve的时候会报 Missing expected rejection
            assert.rejects(() => new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 10)
            })).catch(err => {
                //[AssertionError [ERR_ASSERTION]: Got unwanted rejection
            })
        })

        it('assert.doesNotThrow 断言不会抛出错误', () => {
            // 断言不会抛出错误, 抛出错误的的时候会报Got unwanted exception.
            try {
                assert.doesNotThrow(() => {
                    throw new TypeError('错误信息')
                })
            } catch (err) {
                //[ERR_ASSERTION]: Got unwanted exception.
            }
        })

        it('assert.throws 断言会抛出错误', () => {
            // 断言会抛出错误, 不抛出的时候会报 Missing expected exception
            try {
                assert.throws(() => {})
            } catch (err) {
                //[ERR_ASSERTION]: Missing expected exception.
            }
        })
    })


})