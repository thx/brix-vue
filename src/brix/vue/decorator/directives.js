var Vue = require('vue')
var $ = require('jquery')
var _ = require('underscore')

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
            var nodes = beforeUpdate.call(this, hooks.before, value)
        }

        update.call(this, value)

        if (this.vm._isReady) {
            var that = this
            Vue.nextTick(function() {
                afterUpdate.call(that, hooks.after, value, nodes)
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

function diff(afterNodes, beforeNodes) {
    var nodes = []
    _.each(beforeNodes, function(item /*, index*/ ) {
        if (_.indexOf(afterNodes, item) === -1) nodes.push(item)
    })
    return nodes
}

function beforeUpdate(hook, value) {
    if (!hook) return
    if (!this.el || this.el.nodeType === 3 || this.el.nodeType === 8) return

    var nodes = related(this)
    if (nodes.length) hook.call(this, nodes, value)

    return nodes
}

function afterUpdate(hook, value, beforeNodes) {
    if (!hook) return
    if (!this.el || this.el.nodeType === 3 || this.el.nodeType === 8) return

    var nodes = related(this)
    var removed = diff(nodes, beforeNodes)
    hook.call(this, nodes, value, removed)
}

module.exports = fixDirectives