fyXallDemo.CapturePicture = function (params) {
    "use strict";
    var onSuccess = function (imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
    };

    var onFail = function (message) {
        alert('Failed because: ' + message);
    };

    var onSuccessLocation = function (position) {
        var locationInfo = document.getElementById('locationInfo');
        
        locationInfo.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
          'Longitude: ' + position.coords.longitude + '<br />' +
          'Altitude: ' + position.coords.altitude + '<br />' +
          'Accuracy: ' + position.coords.accuracy + '<br />' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
          'Heading: ' + position.coords.heading + '<br />' +
          'Speed: ' + position.coords.speed + '<br />' +
          'Timestamp: ' + position.timestamp + '<br />';
    };

    var onFailLocation = function (error) {
        alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    };

    var viewModel = {
        capturePicture: function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });
        },
        
        getLocation: function () {
            navigator.geolocation.getCurrentPosition(onSuccessLocation, onFailLocation, { enableHighAccuracy: true });
        },

        getData: function () {
            try {
                //$("#app-status-ul").append('<li>Starting</li>');
                $.ajaxSetup({
                    "error": function (error) { alert("On Error: " + JSON.stringify(error)); }
                });
                $.getJSON("http://192.168.1.78:8888/rest/category", function (response) {
                    $("#datainfo").append('<div>' + JSON.stringify(response) + '</div>');
                    alert(response);
                })
                .success(function () { alert("second success"); })
                .error(function (error) { alert("error: " + JSON.stringify(error)) })
                .complete(function () { alert("complete"); });
                //$("#app-status-ul").append('<li>End</li>');
            } catch (ig) {
                $("#app-status-ul").append('<li>Error</li>');
                alert("error:" + ig.message);
            }

        }
        
    };

    //var push = PushNotification.init({
    //    android: {
    //        senderID: "12345679"
    //    },
    //    ios: {
    //        alert: "true",
    //        badge: "true",
    //        sound: "true"
    //    },
    //    windows: {}
    //});

    //push.on('registration', function (data) {
    //    // data.registrationId
    //    alert(data.registrationId);
    //});

    //push.on('notification', function (data) {
    //    // data.message,
    //    // data.title,
    //    // data.count,
    //    // data.sound,
    //    // data.image,
    //    // data.additionalData
    //    alert(data.message);
    //});

    //push.on('error', function (e) {
    //    // e.message
    //    alert(e.message);
    //});

    return viewModel;
};