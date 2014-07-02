/**
 * App filters
 * @author Martin Vach
 */
// Convert unix timastamp to date
angApp.filter('getTimestamp', function() {
    return Math.round(+new Date() / 1000);
});

/**
 * Strip HTML tags
 */
angApp.filter('stripTags', function() {
    return function(input) {
        return String(input).replace(/<[^>]+>/gm, '');
        //return  input.replace(/<\/?[^>]+(>|$)/g, "");
    };
});
/**
 * Display HTML tags in scope
 */
angApp.filter('toTrusted', ['$sce', function($sce){
        return function(text) {
            return $sce.trustAsHtml(text);
        };
    }]);
// Convert unix timastamp to date
angApp.filter('dateFromUnix', function() {
    return function(input) {
        var d = new Date(input * 1000);
        var day = d.getDate();
        var mon = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        var hrs = d.getHours();
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
        var time = day + '.' + mon + '.' + year + ' ' + hrs + ':' + min + ':' + sec;
        return time;
    };
});

// Get current date time
angApp.filter('getCurrentDate', function() {
    return function() {
        var d = new Date();
        var day = d.getDate();
        var mon = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        var hrs = d.getHours();
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
        var time = day + '.' + mon + '.' + year + ' ' + hrs + ':' + min + ':' + sec;
        return time;
    };
});

// Get current time
angApp.filter('getCurrentTime', function() {
    return function() {
        var d = new Date();
        var hrs = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours());
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
        var time = hrs + ':' + min + ':' + sec;
        return time;
    };
});

// Check for today
angApp.filter('isTodayFromUnix', function() {
    return function(input) {
        var d = new Date(input * 1000);
        var day = d.getDate();
        var mon = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        var hrs = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours());
        var min = (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
        var sec = (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());

        if (d.toDateString() == (new Date()).toDateString()) {
            //return hrs + ':' + min + ':' + sec;
            return hrs + ':' + min;

        } else {
            //return day + '.' + mon + '.' + year + ' ' + hrs + ':' + min + ':' + sec;
            return day + '.' + mon + '.' + year;
        }
    };
});

/**
 * Replace Lock state with text
 */
angApp.filter('lockStatus', function() {
    return function(input) {
        var mode = input;
        var mode_lbl;

        if (mode === '' || mode === null) {
            mode_lbl = '?';
        } else {
            switch (mode) {
                case 0x00:
                    mode_lbl = 'Open';
                    break;
                case 0x10:
                    mode_lbl = 'Open from inside';
                    break;
                case 0x20:
                    mode_lbl = 'Open from outside';
                    break;
                case 0xff:
                    mode_lbl = 'Closed';
                    break;
            }
            ;
        };
        return  mode_lbl;
    };
});

/**
 * Replace Lock state with text
 */
angApp.filter('lockIsOpen', function() {
    return function(input) {
        var mode = input;
        var status = true;

        if (mode === '' || mode === null) {
            status = false;
        } else {
            switch (mode) {
                case 0x00:
                   status = true;
                    break;
                case 0x10:
                    status = true;
                    break;
                case 0x20:
                    status = true;
                    break;
                case 0xff:
                   status = false;
                    break;
            }
            ;
        };
        return  status;
    };
});


/**
 * Set battery icon
 */
angApp.filter('batteryIcon', function() {
    return function(input) {
        var icon = '';
        if(input >= 80){
            icon = 'fa fa-star fa-lg text-success';
        }
        if(input > 50 && input < 80){
            icon = 'fa fa-star-half-o fa-lg text-success';
        }
        if(input > 10 && input <= 50){
            icon = 'fa fa-star-half-o fa-lg text-danger';
        }
        if(input <= 10){
            icon = 'fa fa-star-o fa-lg text-danger';
        }
        return  icon;
    };
});