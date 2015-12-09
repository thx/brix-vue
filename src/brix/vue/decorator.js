/* global define */
define([
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
                    fixComponents(nodes)

                    // event
                    if (owner.$manager) owner.$manager.delegate(vm.$el, owner)
                })
            }
        })

        function Decorator(view, options /* { before, after } */ ) {}

        Decorator.prototype.ready = function() {}
        Decorator.prototype.watch = function() {}

        Decorator.fixFilters = fixFilters
        Decorator.fixTransitions = fixTransitions
        Decorator.fixDirectives = fixDirectives
        Decorator.fixComponents = fixComponents

        return Decorator
    }
)