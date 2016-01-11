/* global require, window, console */
require(
    [
        'brix/loader', 'brix/event', 'brix/vue',
        'jquery', 'log'
    ],
    function(
        Loader, EventManager, Vue,
        $, log
    ) {
        window.Vue = Vue
        Vue.config.debug = true

        Vue.filter('length', function(value) {
            return value.length
        })

        function View() {}

        View.prototype.init = function() {
            var view = this
            this.$manager = new EventManager('mx-')

            this.options = {
                el: '#tmp',
                data: {
                    array: ['foo', 'bar', 'faz'],
                    object: {
                        foo: 0,
                        bar: 1,
                        faz: 2
                    },
                    number: 10,
                    string: 'foo',
                    model: {
                        checked3: []
                    },
                    imageSrc: 'http://cn.vuejs.org/images/logo.png',

                    msg: Math.random(),
                    html: $('<div>').html(Math.random()).html(),
                    // pagination
                    total: 100,
                    cursor: 1,
                    limit: 10,
                    list: [0, 1, 2],
                    name: '',
                    users: [{
                        name: 'Bruce'
                    }, {
                        name: 'Chuck'
                    }, {
                        name: 'Jackie'
                    }]
                },
                computed: {},
                methods: {},
                created: function() {
                    log('[ LifeCycle     ] _created_        ', arguments)
                },
                compiled: function() {
                    log('[ LifeCycle     ] _compiled_       ', arguments)
                },
                ready: function() {
                    log('[ LifeCycle     ] _ready_          ', arguments)
                    var vm = this
                    Loader.boot(this.el, function() {
                        Vue.Decorator.fixComponents()
                        view.$manager.delegate(vm.$el, view)
                    })
                },
                beforeDestroy: function() {
                    log('[ LifeCycle     ] _beforeDestroy_  ', arguments)
                },
                destroyed: function() {
                    log('[ LifeCycle     ] _destroyed_      ', arguments)
                    this.view = undefined
                }
            }
            return this
        }

        View.prototype.render = function() {
            this.vm = new Vue(this.options)
            this.vm.__owner = this
            return this
        }

        View.prototype.handler = function(event, extra) {
            console.log(event.type, event.namespace, extra)
        }

        var view = new View()
        view.init()
        view.render()

        window.view = view
    }
)