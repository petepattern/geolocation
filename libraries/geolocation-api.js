window.LVGeolocation = (function () {
    'use strict';

    var geolocationOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximunAge: 0
    };

    function _checkCompatibility() {
        return navigator.geolocation;
    }

    return {
        getLocation: function () {

            return new Promise(function (resolve, reject) {

                if (!_checkCompatibility()) {
                    reject('Browser does not support geolocation Javascript api');
                }

                // Bust the call stack so Safari doesn't choke.
                setTimeout(function () {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            resolve(position);
                        },
                        function (err) {
                            reject(err);
                        },
                        geolocationOptions
                    );
                });
            });
        }
    };
})();