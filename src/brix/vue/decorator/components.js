var $ = require('jquery')
var _ = require('underscore')
var Loader = require('brix/loader')
var Vue = require('vue')

// 创建创建自定义事件，兼容 IE9 IE10
try {
    new window.Event('custom')
} catch (exception) {
    window.Event = function(type, bubbles, cancelable, detail) {
        var event = document.createEvent('CustomEvent') // MUST be 'CustomEvent'
        event.initCustomEvent(type, bubbles, cancelable, detail)
        return event
    }
}

var CLOSEST_HOOKS = {
    'components/dropdown': 'select[bx-name]',
    'components/switch': 'input[bx-name]',
    'components/pagination': '[bx-name="components/pagination"]',
    'components/table': '[bx-name="components/table"]'
}
var UPDATE_HOOKS = {
    'components/dropdown': function(el) {
        var instance = Loader.query(el)[0]
        if (!instance) return
        instance._fillSelect = function() {}
        instance.data(
            instance._parseDataFromSelect(instance.$element)
        )
        instance.val($(el).val(), false)
        instance.disabled(
            $(el).prop('disabled')
        )
    },
    'components/switch': function(el) {
        var instance = Loader.query(el)[0]
        if (!instance) return
        instance.checked(
            el.checked
        )
    },
    'components/pagination': function(el) {
        var instance = Loader.query(el)[0]
        if (!instance) return

        var total = $(el).attr('data-total')
        if (total != instance.total()) {
            instance.cursor(1)
            instance.total(total)
        }

        var cursor = $(el).attr('data-cursor')
        if (cursor != instance.cursor()) {
            instance.cursor(cursor)
        }
    },
    'components/table': function(el) {
        var instance = Loader.query(el)[0]
        if (!instance) return

        if (instance.columnRWDHandler) instance.columnRWDHandler.flush()
    }
}

var EVENT_HOOKS = {
    'components/dropdown': ['change', 'dropdown'],
    'components/pagination': ['change', 'pagination'],
    'components/datepickerwrapper': ['change', 'datepickerwrapper'],
    'components/switch': ['change', 'switch']
}

var __FIX_EXECUTING = false
var __FIX_BUFFER = []
var __FIX_TASK = function(elements) {
    _.each(elements, function(el, index) {
        if (Vue.config.debug) console.log(new Date(), index, el.id, $(el).attr('bx-name'))
        var moduleId = $(el).attr('bx-name')
        if (UPDATE_HOOKS[moduleId]) UPDATE_HOOKS[moduleId](el)
    })
}
var __FIX_EXECUTOR = function(el) {
    if (el) __FIX_BUFFER.push(el)

    if (!__FIX_EXECUTING && __FIX_BUFFER.length) {
        __FIX_EXECUTING = true

        window.setTimeout(function() {
            var elements = _.unique(__FIX_BUFFER)
            if (Vue.config.debug) console.log(__FIX_BUFFER.length, '=>', elements.length, __FIX_EXECUTING)
            __FIX_BUFFER = []
            __FIX_TASK(elements)
            __FIX_EXECUTING = false

            if (__FIX_BUFFER.length) {
                __FIX_EXECUTOR()
            }
        }, 4)
    }
}

function fixComponents(context /*, value*/ ) {
    var moduleId
    for (moduleId in EVENT_HOOKS) {
        fixComponentEvent(moduleId, EVENT_HOOKS[moduleId][0], EVENT_HOOKS[moduleId][1], context)
    }

    for (moduleId in CLOSEST_HOOKS) {
        var elements = $(context).closest(CLOSEST_HOOKS[moduleId])
        if (elements.length) {
            __FIX_EXECUTOR(elements[0])
        }
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

module.exports = fixComponents