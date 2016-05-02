define("brix/vue/decorator/filters",["vue","accounting","moment"],function(n,e,o){function t(){n.filter("tahoma",function(n){return'<span class="font-bold">'+n+"</span>"}),n.filter("bold",function(n){return'<span class="font-num">'+n+"</span>"}),n.filter("X.xx",function(n){void 0===n&&(n=0);var e="number"==typeof n,o=(e?n.toFixed(2):""+n).split(".");return'<span class="fontsize-20 font-bold font-num">'+o[0]+'</span><span class="fontsize-14 font-num">.'+o[1]+"</span>"}),n.filter("color.brand",function(n){return'<span class="color-brand">'+n+"</span>"}),n.filter("color.help",function(n){return'<span class="color-help">'+n+"</span>"}),n.filter("color.info",function(n){return'<span class="color-info">'+n+"</span>"}),n.filter("color.gray",function(n){return'<span class="color-9">'+n+"</span>"}),n.filter("color.border",function(n){return'<span class="color-border">'+n+"</span>"}),n.filter("color.warning",function(n){return'<span class="color-warning">'+n+"</span>"}),n.filter("color.danger",function(n){return'<span class="color-danger">'+n+"</span>"}),n.filter("color.success",function(n){return'<span class="color-success">'+n+"</span>"}),n.filter("color.fail",function(n){return'<span class="color-fail">'+n+"</span>"}),n.filter("accounting",function(n,o){return e.formatNumber(n,o)}),n.filter("moment",{read:function(n,e){return e=e||"YYYY-MM-DD HH:mm:ss",o(n).format(e)},write:function(n,e,t){return o(n).toDate()}}),n.filter("length",function(n){return n.length}),n.filter("popover",function(n,e){return'<span bx-name="components/popover" data-content="'+e+'">'+n+"</span>"})}return t}),define("brix/vue/decorator/transitions",[],function(){function n(){}return n}),define("brix/vue/decorator/directives",["vue","jquery","underscore"],function(n,e,o){function t(e){o.each([n.options.directives,n.options.elementDirectives,n.options.directives.model.handlers],function(n){o.each(n,function(n){r(n,e||{})})})}function r(e,o){if(e.update&&(e.__brix||(e.__brix={}),!e.__brix.bound)){var t=e.update;e.update=function(e){if(this.vm._isReady&&(n.config.debug&&(console.group("[ Directive Update ] "+this.name),console.log("value ",arguments),console.log("el    ",this.el),console.log("nodes ",this.nodes),console.log("frags ",this.frags),console.log("before")),a.call(this,o.before,e)),t.call(this,e),this.vm._isReady){var r=this;n.nextTick(function(){c.call(r,o.after,e)}),n.config.debug&&(console.log("after "),console.groupEnd("[ Directive Update ] "+this.name))}},e.__brix.bound=!0}}function i(t){var r=[];return e.contains(document.body,t.el)&&r.push(t.el),t.frag&&t.frag.node&&1===t.frag.node.nodeType&&r.push(t.frag.node),t.frag&&t.frag.end&&n.util.mapNodeRange(t.frag.node,t.frag.end,function(n){n&&1===n.nodeType&&r.push(n)}),t.frags&&t.frags.length&&o.each(t.frags,function(e){e&&e.node&&1===e.node.nodeType&&r.push(e.node),e&&e.end&&n.util.mapNodeRange(e.node,e.end,function(n){n&&1===n.nodeType&&r.push(n)})}),t.nodes&&t.nodes.length&&o.each(t.nodes,function(n){n&&n.node&&1===n.node.nodeType&&r.push(n.node)}),r}function a(n,e){if(n&&this.el&&3!==this.el.nodeType&&8!==this.el.nodeType){var o=i(this);o.length&&n.call(this,o,e)}}function c(n,e){if(n&&this.el&&3!==this.el.nodeType&&8!==this.el.nodeType){var o=i(this);o.length&&n.call(this,o,e)}}return t}),define("brix/vue/decorator/components",["jquery","brix/loader"],function(n,e){function o(o){var r={"components/dropdown":["change","dropdown"],"components/datepickerwrapper":["change","datepickerwrapper"],"components/switch":["change","switch"]};for(var i in r)t(i,r[i][0],r[i][1],o);var a={"components/dropdown":function(o){for(var t=n(o).closest("select[bx-name]"),r=0;r<t.length;r++){var i=t[r],a=e.query(i)[0];a&&(a._fillSelect=n.noop,a.data(a._parseDataFromSelect(a.$element)),a.val(n(i).val()))}},"components/switch":function(o){for(var t=n(o).closest("input[bx-name]"),r=0;r<t.length;r++){var i=t[r],a=e.query(i)[0];a&&a.checked(i.checked)}}};for(i in a)a[i](o)}function t(n,o,t,r){var i=e.query(n,r);i.length&&i.off(o+"."+t+".vue").on(o+"."+t+".vue",function(n){n.namespace===t&&n.component.element.dispatchEvent(new Event(o))})}return o}),define("brix/vue/decorator",["brix/loader","./decorator/filters","./decorator/transitions","./decorator/directives","./decorator/components"],function(n,e,o,t,r){function i(){}e(),o();var a={"if":function(e,o){o||n.destroy(!1,e,function(){})}};return t({before:function(n,e){var o=this.vm,t=o.__owner;a[this.name]&&a[this.name].call(this,n,e),t.$manager&&t.$manager.undelegate(this.vm.$el)},after:function(e,o){var t=this.vm,i=t.__owner;n.boot(e,function(){r(e,o),i.$manager&&i.$manager.delegate(t.$el,i)})}}),i.prototype.ready=function(){},i.prototype.watch=function(){},i.fixFilters=e,i.fixTransitions=o,i.fixDirectives=t,i.fixComponents=r,i}),define("brix/vue",["vue","./vue/decorator"],function(n,e){return n.Decorator=e,n});