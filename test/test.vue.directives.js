/* global window */
/* global chai, require */
/* global describe, before, it */
/* global Vue: true, $: true, _: true, container: true */
/* jshint multistr: true */
describe('Directives', function() {

    this.timeout(5000)
    var expect = chai.expect

    // 其他变量和模块的定义在文件 `./test.loader.init.js` 中。
    before(function(done) {
        require(['brix/vue', 'jquery', 'underscore'], function() {
            window.Vue = Vue = arguments[0]
            $ = arguments[1]
            _ = arguments[2]
            container = $('#container')
            done()
        })
    })

    // Go go go

    it('demo', function(done) {
        expect(Vue).to.not.equal(undefined)
        done()
    })

})