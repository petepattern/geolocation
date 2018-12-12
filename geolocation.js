LV.JsLibs.Geolocation = (function () {
    'use strict';

	var baseLibrary = LV.JsLibs.Core.BaseLibrary;
    var eventTarget = LV.JsLibs.Core.EventTarget;

    var LVWebGeoLocation = baseLibrary.extend({
        _class: 'LVWebGeoLocation',
        _events: [
            'LVGeolocation'
        ],
        init: function () {
            // Implementation
        },
        getLocation: function () {
            var _this = this;
            window.LVGeolocation.getLocation().then( function (location) {
                _this.notify('LVGeolocation', location);
            });
        }
    });
    
    LVWebGeoLocation.mixin(eventTarget);

    return LVWebGeoLocation;

})();