/* global define */
define(
    [
        'vue',
        'accounting', 'moment'
    ],
    function(
        Vue,
        Accounting, moment
    ) {

        function fixFilters() {
            // 
            Vue.filter('tahoma', function(value) {
                return '<span class="font-bold">' + value + '</span>'
            })
            Vue.filter('bold', function(value) {
                return '<span class="font-num">' + value + '</span>'
            })
            Vue.filter('X.xx', function(value) {
                if (value === undefined) value = 0
                var isNumber = typeof value === 'number'
                var arr = (isNumber ? value.toFixed(2) : ('' + value)).split('.')
                return '<span class="fontsize-20 font-bold font-num">' + arr[0] + '</span>' +
                    '<span class="fontsize-14 font-num">.' + arr[1] + '</span>'
            })

            // 
            Vue.filter('color.brand', function(value) {
                return '<span class="color-brand">' + value + '</span>'
            })
            Vue.filter('color.help', function(value) {
                return '<span class="color-help">' + value + '</span>'
            })
            Vue.filter('color.info', function(value) {
                return '<span class="color-info">' + value + '</span>'
            })
            Vue.filter('color.gray', function(value) {
                return '<span class="color-9">' + value + '</span>'
            })
            Vue.filter('color.border', function(value) {
                return '<span class="color-border">' + value + '</span>'
            })
            Vue.filter('color.warning', function(value) {
                return '<span class="color-warning">' + value + '</span>'
            })
            Vue.filter('color.danger', function(value) {
                return '<span class="color-danger">' + value + '</span>'
            })
            Vue.filter('color.success', function(value) {
                return '<span class="color-success">' + value + '</span>'
            })
            Vue.filter('color.fail', function(value) {
                return '<span class="color-fail">' + value + '</span>'
            })

            // 
            Vue.filter('accounting', function(value, precision) {
                return Accounting.formatNumber(value, precision)
            })
            Vue.filter('moment', {
                read: function(value, format) {
                    format = format || 'YYYY-MM-DD HH:mm:ss'
                    return moment(value).format(format)
                },
                /* jshint unused:false */
                write: function(value, oldValue, format) {
                    return moment(value).toDate()
                }
            })

            // 
            Vue.filter('length', function(value) {
                return value.length
            })

            // 
            Vue.filter('popover', function(value, content) {
                return '<span bx-name="components/popover" data-content="' + content + '">' + value + '</span>'
            })
        }

        return fixFilters
    }
)