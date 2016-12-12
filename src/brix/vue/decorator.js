var fixFilters = require('./decorator/filters')
var fixTransitions = require('./decorator/transitions')
var fixDirectives = require('./decorator/directives')
var fixComponents = require('./decorator/components')
var _ = require('underscore')
var Loader = require('brix/loader')
var Vue = require('vue')

var Decorator = {
    fixFilters: fixFilters,
    fixTransitions: fixTransitions,
    fixDirectives: fixDirectives,
    fixComponents: fixComponents
}

Vue.Decorator = Decorator

Decorator.fixFilters()
Decorator.fixTransitions()

var NOW = +(new Date())
var DESTROY_HOOKS = {
    'if': function(nodes, value) {
        if (!value) {
            Loader.destroy(false, nodes, function() {})
        }
    }
}

Decorator.fixDirectives({
    // text html if show else for on bind model ref el pre cloak 
    before: function(nodes, value) { // this.vm.__owner
        var vm = this.vm
        var owner = vm.__owner
        if (!owner) return

        // destroy or reserve
        if (DESTROY_HOOKS[this.name]) {
            DESTROY_HOOKS[this.name].call(this, nodes, value)
        }

        // event
        // if (owner.$manager) owner.$manager.undelegate(this.vm.$el)

        // Magix unmount
        if (owner.unmountZoneVframes) {
            _.each(nodes, function(item /*, index*/ ) {
                owner.unmountZoneVframes(item)
            })
        }
    },
    after: function(nodes, value /* jshint unused:false */ , removed) { // this.vm.__owner
        var vm = this.vm
        var owner = vm.__owner
        if (!owner) return

        if (removed && removed.length) Loader.destroy(false, removed, function() {})

        // reboot
        Loader.boot(nodes, function( /*records*/ ) {
            // component
            Decorator.fixComponents(nodes)

            // event
            // if (owner.$manager) owner.$manager.delegate(vm.$el, owner)

            // Magix mount
            _.each(nodes, function(item /*, index*/ ) {
                if (item.getAttribute('mx-vframe')) {
                    if (!owner.owner || !owner.owner.mountVframe) return
                    if (!item.id) item.id = 'mx_n_' + NOW++;
                    owner.owner.mountVframe(item.id, item.getAttribute('mx-view'))
                    return
                }
                if (!owner.owner || !owner.owner.mountZoneVframes) return
                owner.owner.mountZoneVframes(item)
            })
        })
    }
})

module.exports = Decorator