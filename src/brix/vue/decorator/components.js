/* global define, Event */
define(
    [
        'brix/loader'
    ],
    function(
        Loader
    ) {

        function fixComponents(context) {
            var hooks = {
                'components/dropdown': ['change', 'dropdown'],
                'components/datepickerwrapper': ['change', 'datepickerwrapper']
            }

            for (var moduleId in hooks) {
                fixComponentEvent(moduleId, hooks[moduleId][0], hooks[moduleId][1], context)
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