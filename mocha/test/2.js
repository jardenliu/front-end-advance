describe('2. 断言', () => {
    //断言
    // Node.js 内置的assert

    /**
     * 当前示例目的是学习assert的常用方法
     * 所以捕获错误还是使用try catch
     * 后面示例中会使用 assert.notEqual 和 assert.throws书写示例
     */

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
                /**
                 * assert.strictEqual 先科普一下 strictEqual 是两个值严谨相等，后面有具体示例
                 * 
                 */
                assert.strictEqual(1, 2)
            } catch (err) {
                it('验证err是否为AssertionError的实例', () => {
                    assert(err instanceof assert.AssertionError) //true
                })
                it('验证err的默认运算符', () => {
                    assert.strictEqual(err.message, message) //err.message === message
                })
                it('验证err的一些常用属性', () => {
                    assert.strictEqual(err.name, 'AssertionError [ERR_ASSERTION]') //err.name: 'AssertionError [ERR_ASSERTION]'
                    assert.strictEqual(err.actual, 1) // err.actual === 1
                    assert.strictEqual(err.expected, 2) //err.expected === 2
                    assert.strictEqual(err.code, 'ERR_ASSERTION') //err.code === 'ERR_ASSERTION'
                    assert.strictEqual(err.operator, DEFAULT_OPERATOR) //err.operator === DEFAULT_OPERATOR
                    assert.strictEqual(err.generatedMessage, true) //err.generatedMessage === true
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
            } catch (error) {
                // error: 'AssertionError [ERR_ASSERTION]: 1不等于2的啊^_^,啦啦啦'
            }
            try {
                assert.ok(1 === 2, ['1不等于2的啊^_^', '啦啦啦'])
            } catch (error) {
                // error: 'AssertionError [ERR_ASSERTION]: 1不等于2的啊^_^,啦啦啦'
            }
        })
    })

    describe('assert.equal()和assert.strictEqual() 相等', () => {
        describe('浅比较 相当于 ==, assert.equal(actual, expected[, message])', () => {
            it('值比较', () => {
                assert.equal(1, '1')
                assert.equal(1, 1)
            })
            it('严谨比较', () => {
                try {
                    assert.strictEqual(1, '1')
                } catch (error) {
                    // error: AssertionError [ERR_ASSERTION]: Input A expected to strictly equal input B
                }
            })
            it('对象比较', () => {
                try {
                    assert.equal({
                        a: {
                            b: 1
                        }
                    }, {
                        a: {
                            b: 1
                        }
                    })
                } catch (error) {
                    // error: AssertionError [ERR_ASSERTION]: { a: { b: 1 } } == { a: { b: 1 } }
                }
            })

        })
    })

    describe('assert.notEqual()和assert.notStrictEqual() 值不相等', () => {
        describe('浅比较 相当于 ==, assert.equal(actual, expected[, message])', () => {
            it('值相等时候抛出错误', () => {
                assert.notEqual(1, '2')
                try {
                    assert.notEqual(1, '1')
                    assert.notEqual(1, 1)
                } catch (error) {
                    // error: AssertionError [ERR_ASSERTION]: 1 != '1'
                }
            })
            it('严谨比较, 不相等', () => {
                assert.notStrictEqual(1, '1')
            })
            it('对象比较', () => {
                assert.notEqual({
                    a: {
                        b: 1
                    }
                }, {
                    a: {
                        b: 1
                    }
                })
            })

        })
    })


    describe('assert.deepEqual()和assert.deepStrictEqual() 深度相等', () => {
        describe('深度相等意味着子对象中可枚举的自身属性也会按规则递归地比较', () => {
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
                assert.deepStrictEqual(obj1, obj1)
            })
            it('递归比较', () => {
                assert.deepEqual(obj1, obj3)
                assert.deepStrictEqual(obj1, obj3)

                try {
                    assert.deepEqual(obj1, obj2)
                } catch (error) {
                    // error: AssertionError [ERR_ASSERTION]: { a: { b: 1 } } deepEqual { a: { b: 2 } }
                }
            })
            it('指定原型的包含指定函数的对象', () => {
                try {
                    assert.deepEqual(obj1, obj4)
                } catch (error) {
                    // error: AssertionError [ERR_ASSERTION]: { a: { b: 1 } } deepEqual {}
                }
            })
        })
    })


    describe('assert.notDeepEqual()和assert.notDeepStrictEqual() 不深度相等', () => {
        describe('如果两个值深度全等，则抛出一个带有 message 属性的 AssertionError', () => {
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
            it('自身相等抛错', () => {
                try {
                    assert.notDeepEqual(obj1, obj1)
                    assert.notDeepStrictEqual(obj1, obj1)
                } catch (error) {
                    // error: AssertionError [ERR_ASSERTION]: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }
                }
            })
            it('递归比较', () => {
                try {
                    assert.notDeepEqual(obj1, obj3)
                    assert.notDeepStrictEqual(obj1, obj3)
                } catch (error) {
                    // error: AssertionError [ERR_ASSERTION]: { a: { b: 1 } } notDeepEqual { a: { b: 1 } }
                }
                assert.notDeepEqual(obj1, obj2)
                assert.notDeepStrictEqual(obj1, obj2)
            })
            it('指定原型的包含指定函数的对象不深度相等', () => {
                assert.notDeepEqual(obj1, obj4)
                assert.notDeepStrictEqual(obj1, obj4)
            })
        })
    })

    describe('assert.doesNotReject()、assert.rejects()、、assert.doesNotThrow() 和assert.throws()', () => {
        it('assert.doesNotReject 断言不会reject', () => {
            // 断言不会reject, reject的时候会报Got unwanted rejection
            assert.doesNotReject(() => new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject()
                }, 10)
            })).catch(err => {
                // error: [AssertionError [ERR_ASSERTION]: Got unwanted rejection
            })
        })

        it('assert.rejects 断言会reject', () => {
            // 断言会reject, resolve的时候会报 Missing expected rejection
            assert.rejects(() => new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 10)
            })).catch(err => {
                // error: [AssertionError [ERR_ASSERTION]: Got unwanted rejection
            })
        })

        it('assert.doesNotThrow 断言不会抛出错误', () => {
            // 断言不会抛出错误, 抛出错误的的时候会报Got unwanted exception.
            try {
                assert.doesNotThrow(() => {
                    throw new TypeError('错误信息')
                })
            } catch (error) {
                // error: [ERR_ASSERTION]: Got unwanted exception.
            }
        })

        it('assert.throws 断言会抛出错误', () => {
            // 断言会抛出错误, 不抛出的时候会报 Missing expected exception
            try {
                assert.throws(() => {})
            } catch (error) {
                // error: [ERR_ASSERTION]: Missing expected exception.
            }
        })
    })

    describe('assert.fail 抛出错误', () => {
        it('抛出默认错误', () => {
            try {
                assert.fail()
            } catch (error) {
                // error: AssertionError [ERR_ASSERTION]: Failed
            }
        })

        it('抛出传入值', () => {
            try {
                assert.fail('失败')
            } catch (error) {
                // error: AssertionError [ERR_ASSERTION]: 失败
            }
        })

        it('抛出错误', () => {
            try {
                assert.fail(new TypeError('失败'))
            } catch (error) {
                //如果 message 参数是 Error 的实例，则会抛出它而不是 AssertionError
                // error: TypeError: 失败
            }
        })
    })

    describe('assert.ifError() 有错误才抛出错误', () => {
        it('为null或undefined，验证通过', () => {
            assert.ifError(null)
        })
        it('有错抛出错误', () => {
            try {
                assert.ifError(0)
            } catch (error) {
                // error: AssertionError [ERR_ASSERTION]: ifError got unwanted exception: 0
            }

            try {
                assert.ifError('错误信息')
            } catch (error) {
                // error: AssertionError [ERR_ASSERTION]: ifError got unwanted exception: '错误信息'
            }

            try {
                assert.ifError(new Error())
            } catch (error) {
                // error: AssertionError [ERR_ASSERTION]: ifError got unwanted exception: Error
            }
        })
    })

})