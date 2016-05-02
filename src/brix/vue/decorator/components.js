/* global define, Event */
define(
    [
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
)