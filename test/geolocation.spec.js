var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

var geolocation = LV.JsLibs.Geolocation.create();

describe("Geolocation", function () {

    it("Should get location on user authorization", function (done) {
        // Delete completely the timeout for responses.
        this.timeout(0);
        geolocation.on('LVGeolocation', function (location) {
            var latitude = location.coords.latitude;
            var longitude = location.coords.longitude;
            var accuracy = location.coords.accuracy;

            expect(latitude).to.be.a('number');
            expect(longitude).to.be.a('number');
            expect(accuracy).to.be.a('number');

            setTimeout(function () {
                var firstTestElement = document.querySelectorAll('li.test')[0];
                var preElement = document.createElement('pre');

// In order to have multilines in output, this format is needed :(.
                var preElementText = document.createTextNode(
`Latitude: ${latitude}
Longitude: ${longitude}
Accuracy: ${accuracy} mtrs`)
                preElement.appendChild(preElementText);
                firstTestElement.appendChild(preElement);
            })

            done();
        });

        geolocation.getLocation();
    });

});