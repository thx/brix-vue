var Vue = require('vue')

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