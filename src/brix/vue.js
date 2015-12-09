/* global define */
define([
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
)