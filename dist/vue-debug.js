
/* global define */
define(
    'brix/vue/decorator/filters',[
        'vue',
        'accounting', 'moment'
    ],
    function(
        Vue,
        Accounting, moment
    ) {

        function fixFilters() {
            // 
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
        }

        return fixFilters
    }
);
/* global define */
define(
    'brix/vue/decorator/transitions',[],
    function() {
        function fixTransitions( /*hooks*/ ) {}
        return fixTransitions
    }
);
/* global define */
/* global document, console */
define(
    'brix/vue/decorator/directives',[
        'vue',
        'jquery', 'underscore',
    ],
    function(
        Vue,
        $, _
    ) {

        function fixDirectives(hooks) {
            _.each(
                [
                    Vue.options.directives,
                    Vue.options.elementDirectives,
                    Vue.options.directives.model.handlers
                ],
                function(directives) {
                    _.each(directives, function(dir /*, name*/ ) {
                        fixDirective(dir, hooks || {})
                    })
                }
            )
        }

        function fixDirective(dir, hooks) {
            if (!dir.update) return
            if (!dir.__brix) dir.__brix = {}
            if (dir.__brix.bound) return

            var update = dir.update

            dir.update = function(value) {
                if (this.vm._isReady) {
                    if (Vue.config.debug) {
                        console.group('[ Directive Update ] ' + this.name)
                        console.log('value ', arguments)
                        console.log('el    ', this.el)
                        console.log('nodes ', this.nodes)
                        console.log('frags ', this.frags)
                        console.log('before')
                    }
                    beforeUpdate.call(this, hooks.before, value)
                }

                update.call(this, value)

                if (this.vm._isReady) {
                    var that = this
                    Vue.nextTick(function() {
                        afterUpdate.call(that, hooks.after, value)
                    })
                    if (Vue.config.debug) {
                        console.log('after ')
                        console.groupEnd('[ Directive Update ] ' + this.name)
                    }
                }
            }

            dir.__brix.bound = true
        }

        function related(dir) {
            var nodes = []
            if ($.contains(document.body, dir.el)) {
                nodes.push(dir.el)
            }
            if (dir.frag && dir.frag.node && dir.frag.node.nodeType === 1) {
                nodes.push(dir.frag.node)
            }
            if (dir.frag && dir.frag.end) {
                Vue.util.mapNodeRange(dir.frag.node, dir.frag.end, function(node) {
                    if (node && node.nodeType === 1) nodes.push(node)
                })
            }
            if (dir.frags && dir.frags.length) {
                _.each(dir.frags, function(item /*, index*/ ) {
                    if (item && item.node && item.node.nodeType === 1) nodes.push(item.node)
                    if (item && item.end) {
                        Vue.util.mapNodeRange(item.node, item.end, function(node) {
                            if (node && node.nodeType === 1) nodes.push(node)
                        })
                    }
                })
            }
            if (dir.nodes && dir.nodes.length) {
                _.each(dir.nodes, function(item /*, index*/ ) {
                    if (item && item.node && item.node.nodeType === 1) nodes.push(item.node)
                })
            }
            return nodes
        }

        function beforeUpdate(hook, value) {
            if (!hook) return
            if (!this.el || this.el.nodeType === 3 || this.el.nodeType === 8) return

            var nodes = related(this)
            if (nodes.length) hook.call(this, nodes, value)

            // Loader.destroy(false, this.el);
            // view.undelegateEvents('#' + view.id)
            // view.owner.unmountZoneVframes(this.el)
            // Loader.destroy(false, this.el, function() {})
            // Loader.destroy(false, this.nodes)
        }

        function afterUpdate(hook, value) {
            if (!hook) return
            if (!this.el || this.el.nodeType === 3 || this.el.nodeType === 8) return

            var nodes = related(this)
            if (nodes.length) hook.call(this, nodes, value)

            // if ($.contains(document.body, this.el)) {
            //     Loader.boot(this.el, function( /*records*/ ) {
            //         VueComponents()
            //     })
            // }
            // if (this.frags && this.frags.length) {
            //     _.each(this.frags, function(frag) {
            //         if (frag.node.nodeType === 1) Loader.boot(frag.node, function() {})
            //     })
            // }


            // if (this.nodes && this.nodes.length) {
            //     _.each(this.nodes, function(node) {
            //         if (node.nodeType === 1) Loader.boot(node, function() {})
            //     })
            // }
        }

        return fixDirectives
    }
);
/* global define, Event */
define(
    'brix/vue/decorator/components',[
        'jquery', 'brix/loader'
    ],
    function(
        $, Loader
    ) {

        function fixComponents(context/*, value*/) {
            var EVENT_HOOKS = {
                'components/dropdown': ['change', 'dropdown'],
                'components/datepickerwrapper': ['change', 'datepickerwrapper'],
                'components/switch': ['change', 'switch']
            }
            for (var moduleId in EVENT_HOOKS) {
                fixComponentEvent(moduleId, EVENT_HOOKS[moduleId][0], EVENT_HOOKS[moduleId][1], context)
            }

            var UPDATE_HOOKS = {
                'components/dropdown': function(context) {
                    var elements = $(context).closest('select[bx-name]')
                    for (var i = 0; i < elements.length; i++) {
                        var el = elements[i]
                        var instance = Loader.query(el)[0]
                        if (!instance) continue
                        instance._fillSelect = $.noop
                        instance.data(
                            instance._parseDataFromSelect(instance.$element)
                        )
                        instance.val(
                            $(el).val()
                        )
                    }
                },
                'components/switch': function(context) {
                    var elements = $(context).closest('input[bx-name]')
                    for (var i = 0; i < elements.length; i++) {
                        var el = elements[i]
                        var instance = Loader.query(el)[0]
                        if (!instance) continue
                        instance.checked(
                            el.checked
                        )
                    }
                }
            }
            for (moduleId in UPDATE_HOOKS) {
                UPDATE_HOOKS[moduleId](context)
            }
        }

        function fixComponentEvent(moduleId, type, namespace, context) {
            var instances = Loader.query(moduleId, context)
            if (!instances.length) return

            instances.off(type + '.' + namespace + '.vue')
                .on(type + '.' + namespace + '.vue', function(event /*, extra*/ ) {
                    if (event.namespace !== namespace) return
                    event.component.element.dispatchEvent(new Event(type))
                })
        }

        return fixComponents
    }
);
/* global define */
define('brix/vue/decorator',[
        'brix/loader',
        './decorator/filters', './decorator/transitions',
        './decorator/directives', './decorator/components'
    ],
    function(
        Loader,
        fixFilters, fixTransitions,
        fixDirectives, fixComponents
    ) {

        fixFilters()
        fixTransitions()

        var hooks = {
            'if': function(nodes, value) {
                if (!value) {
                    Loader.destroy(false, nodes, function() {})
                }
            }
        }
        fixDirectives({
            // text html if show else for on bind model 
            // ref el pre cloak 
            before: function(nodes, value) { // this.vm.__owner
                var vm = this.vm
                var owner = vm.__owner

                // destroy or reserve
                if (hooks[this.name]) {
                    hooks[this.name].call(this, nodes, value)
                }

                // event
                if (owner.$manager) owner.$manager.undelegate(this.vm.$el)
            },
            after: function(nodes, value) { // this.vm.__owner
                var vm = this.vm
                var owner = vm.__owner

                // boot
                Loader.boot(nodes, function( /*records*/ ) {
                    // component
                    fixComponents(nodes, value)

                    // event
                    if (owner.$manager) owner.$manager.delegate(vm.$el, owner)
                })
            }
        })

        function Decorator(/* view, options { before, after } */ ) {}

        Decorator.prototype.ready = function() {}
        Decorator.prototype.watch = function() {}

        Decorator.fixFilters = fixFilters
        Decorator.fixTransitions = fixTransitions
        Decorator.fixDirectives = fixDirectives
        Decorator.fixComponents = fixComponents

        return Decorator
    }
);
/* global define */
define('brix/vue',[
        'vue',
        './vue/decorator'
    ],
    function(
        Vue,
        Decorator
    ) {
        // Decorator.fixFilters()
        // Decorator.fixDirectives()
        // Decorator.fixTransitions()
        // Decorator.fixComponents()

        Vue.Decorator = Decorator

        return Vue
    }
);