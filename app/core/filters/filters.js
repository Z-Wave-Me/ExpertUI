/**
 * App filters
 * @author Martin Vach
 * @author Martin Hartnagel
 */
/**
 * Convert unix timastamp to date
 */
angApp.filter('getTimestamp', function() {
    return function() {
        return Math.round(+new Date() / 1000);
    };
});

/**
 * Calculates difference between two dates in days
 */
angApp.filter('days_between', function() {
    return function(date1, date2) {
        return Math.round(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
    };
});

/**
 * Return string with date in smart format: "hh:mm" if current day, "hh:mm dd" if this week, "hh:mm dd mmmm" if this year, else "hh:mm dd mmmm yyyy"
 */ 
angApp.filter('getTime', function($filter) {
    return function(timestamp, invalidReturn) {
        var d = new Date(parseInt(timestamp, 10)*1000);
        if (timestamp === 0 || isNaN(d.getTime()))
            return invalidReturn

            var cd = new Date();

        var fmt;
        if ($filter('days_between')(cd, d) < 1 && cd.getDate() == d.getDate()) // this day
            fmt = 'HH:MM';
        else if ($filter('days_between')(cd, d)  < 7 && ((cd < d) ^ (cd.getDay() >= d.getDay()))) // this week
            fmt = 'dddd HH:MM';
        else if (cd.getFullYear() == d.getFullYear()) // this year
            fmt = 'dddd, d mmmm HH:MM';
        else // one upon a time
            fmt = 'dddd, d mmmm yyyy HH:MM';

        return ""+d;//TODO with jquery.dateformat.js: .format(fmt);
    };
});


/**
 * Return "red" if the data is outdated or "" if up to date
 */
angApp.filter('getUpdated', function() {
    return function(data) {
        return ((data.updateTime > data.invalidateTime) ?'':'red');
    };
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
//Convert unix timastamp to date
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

//Get current date time
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

//Get current time
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

//Check for today
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

/**
 * Count Routes
 */
angApp.filter('getRoutesCount', function($filter) {
    return function(ZWaveAPIData, nodeId) {
        var in_array=function(v, arr, return_index){
            for (var i=0; i<arr.length; i++)
                if (arr[i]==v) 
                    return return_index?i:true;
            return false;
        };
        var getFarNeighbours=function(nodeId, exludeNodeIds, hops) {
            if (hops === undefined) {
                var hops = 0;
                var exludeNodeIds = [nodeId];
            };

            if (hops > 2) // Z-Wave allows only 4 routers, but we are interested in only 2, since network becomes unstable if more that 2 routers are used in communications
                return [];

            var nodesList = [];
            angular.forEach(ZWaveAPIData.devices[nodeId].data.neighbours.value, function(nnodeId, index) {
                if (!(nnodeId in ZWaveAPIData.devices))
                    return; // skip deviced reported in routing table but absent in reality. This may happen after restore of routing table.
                if (!in_array(nnodeId, exludeNodeIds)) {
                    nodesList.push({ nodeId: nnodeId, hops: hops });
                    if (ZWaveAPIData.devices[nnodeId].data.isListening.value && ZWaveAPIData.devices[nnodeId].data.isRouting.value)
                        $.merge(nodesList, getFarNeighbours(nnodeId, $.merge([nnodeId], exludeNodeIds) /* this will not alter exludeNodeIds */, hops + 1));
                }
            });
            return nodesList;
        };

        var routesCount = {};
        angular.forEach(getFarNeighbours(nodeId), function(nnode, index) {
            if (nnode.nodeId in routesCount) {
                if (nnode.hops in routesCount[nnode.nodeId])
                    routesCount[nnode.nodeId][nnode.hops]++;
                else
                    routesCount[nnode.nodeId][nnode.hops] = 1;
            } else {
                routesCount[nnode.nodeId] = new Array();
                routesCount[nnode.nodeId][nnode.hops] = 1;
            }
        });
        return routesCount;
    };
});

/*
 * Set security icon
 */
angApp.filter('securityIcon', function() {
    return function(input) {
        var icon = 'fa fa-minus';
        if(input === false){
            icon = 'fa fa-check fa-lg text-danger';
        }
        if(input === true){
            icon = 'fa fa-check fa-lg text-success';
        }
        return  icon;
    };
});

/**
 * Set zWavePlus icon
 */
angApp.filter('zWavePlusIcon', function() {
    return function(input) {
        var icon = 'fa fa-minus';
        if(input === true){
            icon = 'fa fa-plus fa-lg text-success';
        }
        return  icon;
    };
});
