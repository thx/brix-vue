/* global define */
/* global document, console */
define(
    [
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
            if (dir.frags && dir.frags.length) {
                _.each(dir.frags, function(item /*, index*/ ) {
                    if (item && item.node && item.node.nodeType === 1) nodes.push(item)
                })
            }
            if (dir.nodes && dir.nodes.length) {
                _.each(dir.nodes, function(item /*, index*/ ) {
                    if (item && item.node && item.node.nodeType === 1) nodes.push(item)
                })
            }
            return nodes
        }

        function beforeUpdate(hook, value) {
            if (!hook) return
            if (!this.el || this.el.nodeType === 3 || this.el.nodeType === 8) return

            var nodes = related(this)
            hook.call(this, nodes, value)

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
            hook.call(this, nodes, value)

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
)