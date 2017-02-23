(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vue"), require("jquery"), require("underscore"), require("brix/loader"));
	else if(typeof define === 'function' && define.amd)
		define(["vue", "jquery", "underscore", "brix/loader"], factory);
	else if(typeof exports === 'object')
		exports["VueDecorator"] = factory(require("vue"), require("jquery"), require("underscore"), require("brix/loader"));
	else
		root["VueDecorator"] = factory(root["vue"], root["jquery"], root["underscore"], root["brix/loader"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var fixFilters = __webpack_require__(1)
	var fixTransitions = __webpack_require__(3)
	var fixDirectives = __webpack_require__(4)
	var fixComponents = __webpack_require__(7)
	var _ = __webpack_require__(6)
	var Loader = __webpack_require__(8)
	var Vue = __webpack_require__(2)

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Vue = __webpack_require__(2)

	function fixFilters() {
	    // 动态 filter
	    Vue.filter('apply', function(value, name) {
	        var filter = this.$options.filters[name] || Vue.options.filters[name]
	        var args = [value].concat(
	            [].slice.call(arguments, 2)
	        )
	        if (filter) return filter.apply(this, args)
	        return value
	    })
	}

	module.exports = fixFilters

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	function fixTransitions( /*hooks*/ ) {}
	module.exports = fixTransitions

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Vue = __webpack_require__(2)
	var $ = __webpack_require__(5)
	var _ = __webpack_require__(6)

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(5)
	var _ = __webpack_require__(6)
	var Loader = __webpack_require__(8)
	var Vue = __webpack_require__(2)

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

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }
/******/ ])
});
;