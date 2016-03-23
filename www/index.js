$(function() {
    var startupView = "CapturePicture";
    var pushNotification;
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    if(DevExpress.devices.real().platform === "win") {
        $("body").css("background-color", "#000");
    }

    $(document).on("deviceready", function () {
        navigator.splashscreen.hide();
        if (window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function () {
            DevExpress.processHardwareBackButton();
        });
        $("#app-status-ul").append('<li>Before Init...</li>');
        
        //PushNotification.hasPermission(function (data) {
        //    if (data.isEnabled) {
        //        console.log('isEnabled');
        //        $("#app-status-ul").append('<li>Enable...</li>');
        //    } else {
        //        $("#app-status-ul").append('<li>Not Enable...</li>');
        //    }
        //});
        //var push;
        try {
            console.log("Init...");
            pushNotification = window.plugins.pushNotification;

            pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID": "256840931929",
                "ecb": "onNotification"
            });
        //    push = new PushNotification();
        //    push.register({
        //        "android": {
        //            "senderID": "256840931929"
        //        },
        //        "ios": {
        //            "alert": true,
        //            "badge": true,
        //            "sound": true
        //        },
        //        "windows": {
        //        }
        //    });
        }
        catch (e) {
            alert("tc AA:  " + e);
        }

        $("#app-status-ul").append('<li>Init...</li>');
        //push.on('registration', function (data) {
        //    // data.registrationId
        //    $("#app-status-ul").append('<li>registrationId:' + data.registrationId + '</li>');
        //});

        //push.on('notification', function (data) {
        //    // data.message,
        //    // data.title,
        //    // data.count,
        //    // data.sound,
        //    // data.image,
        //    // data.additionalData
        //    $("#app-status-ul").append('<li>message:' + data.message + '</li>');
        //    $("#app-status-ul").append('<li>title:' + data.title + '</li>');
        //});

        //push.on('error', function (e) {
        //    // e.message
        //    $("#app-status-ul").append('<li>error:' + e.message + '</li>');

        //});
    });

    function successHandler(result) {
        alert('result = ' + result);
    }
    function errorHandler(error) {
        alert('error = ' + error);
    }
    function onNotification(e) {
        $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                    // Your GCM push server needs to know the regID before it can push to this device
                    // here is where you might want to send it the regID for later use.
                    console.log("regID = " + e.regid);
                }
                break;

            case 'message':
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                if (e.foreground) {
                    $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                    // on Android soundname is outside the payload.
                    // On Amazon FireOS all custom attributes are contained within payload
                    var soundfile = e.soundname || e.payload.sound;
                    // if the notification contains a soundname, play it.
                    var my_media = new Media("/android_asset/www/" + soundfile);
                    my_media.play();
                }
                else {  // otherwise we were launched because the user touched a notification in the notification tray.
                    if (e.coldstart) {
                        $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    }
                    else {
                        $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    }
                }

                $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                //Only works for GCM
                $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                //Only works on Amazon Fire OS
                $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
                break;

            case 'error':
                $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

            default:
                $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
        }
    }

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !fyXallDemo.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch (DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }

    fyXallDemo.app = new DevExpress.framework.html.HtmlApplication({
        namespace: fyXallDemo,
        layoutSet: DevExpress.framework.html.layoutSets[fyXallDemo.config.layoutSet],
        animationSet: DevExpress.framework.html.animationSets[fyXallDemo.config.animationSet],
        navigation: fyXallDemo.config.navigation,
        commandMapping: fyXallDemo.config.commandMapping,
        navigateToRootViewMode: "keepHistory",
        useViewTitleAsBackText: true
    });

    $(window).unload(function() {
        fyXallDemo.app.saveState();
    });

    fyXallDemo.app.router.register(":view/:id", { view: startupView, id: undefined });
    fyXallDemo.app.on("navigatingBack", onNavigatingBack);
    fyXallDemo.app.navigate();
});