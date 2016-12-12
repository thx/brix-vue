/* global require, window, console */
require(
    [
        'brix/loader', 'brix/event', 'brix/vue',
        'vue', 'jquery', 'log', 'accounting', 'moment'
    ],
    function(
        Loader, EventManager, VueDecorator,
        Vue, $, log, Accounting, moment
    ) {
        window.Vue = Vue
        Vue.config.debug = true

        Vue.filter('tahoma', function(value) {
            return '<span class="font-bold">' + value + '</span>'
        })
        Vue.filter('bold', function(value) {
            return '<span class="font-num">' + value + '</span>'
        })
        Vue.filter('X.xx', function(value) {
            if (value === undefined) value = 0
            var isNumber = typeof value === 'number'
            var arr = (isNumber ? value.toFixed(2) : ('' + value)).split('.')
            return '<span class="fontsize-20 font-bold font-num">' + arr[0] + '</span>' +
                '<span class="fontsize-14 font-num">.' + arr[1] + '</span>'
        })

        // 
        Vue.filter('color.brand', function(value) {
            return '<span class="color-brand">' + value + '</span>'
        })
        Vue.filter('color.help', function(value) {
            return '<span class="color-help">' + value + '</span>'
        })
        Vue.filter('color.info', function(value) {
            return '<span class="color-info">' + value + '</span>'
        })
        Vue.filter('color.gray', function(value) {
            return '<span class="color-9">' + value + '</span>'
        })
        Vue.filter('color.border', function(value) {
            return '<span class="color-border">' + value + '</span>'
        })
        Vue.filter('color.warning', function(value) {
            return '<span class="color-warning">' + value + '</span>'
        })
        Vue.filter('color.danger', function(value) {
            return '<span class="color-danger">' + value + '</span>'
        })
        Vue.filter('color.success', function(value) {
            return '<span class="color-success">' + value + '</span>'
        })
        Vue.filter('color.fail', function(value) {
            return '<span class="color-fail">' + value + '</span>'
        })

        // 
        Vue.filter('accounting', function(value, precision) {
            return Accounting.formatNumber(value, precision)
        })
        Vue.filter('moment', {
            read: function(value, format) {
                format = format || 'YYYY-MM-DD HH:mm:ss'
                return moment(value).format(format)
            },
            /* jshint unused:false */
            write: function(value, oldValue, format) {
                return moment(value).toDate()
            }
        })

        // 
        Vue.filter('length', function(value) {
            return value.length
        })

        // 
        Vue.filter('popover', function(value, content) {
            return '<span bx-name="components/popover" data-content="' + content + '">' + value + '</span>'
        })

        Vue.filter('length', function(value) {
            return value.length
        })

        function View() {}

        View.prototype.init = function() {
            var view = this
            this.$manager = new EventManager('mx-')

            this.options = {
                el: '#hero',
                data: {
                    iamnull: null,
                    array: ['foo', 'bar', 'faz'],
                    object: {
                        foo: 0,
                        bar: 1,
                        faz: 2
                    },
                    number: 10,
                    string: 'foo',
                    model: {
                        checked3: [],
                        checked4: false
                    },
                    imageSrc: 'http://cn.vuejs.org/images/logo.png',
                    ifNested: '',

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
                    }],
                    icon: '&#xe623;'
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