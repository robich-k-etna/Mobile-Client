var Base64Factory = function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        },
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        }
    };
};

var RequestService = function($http, Base64) {
    this.$http = $http;
    this.Base64 = Base64;
    this.server = 'localhost';
    this.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    };
    this.protocol = 'http';
};
RequestService.prototype.setServer = function(host, port) {
    this.server = host;
    if (port && port != '') {
        this.server += ':' + port;
    }
};
RequestService.prototype.setBasicAuth = function(user, pass) {
    this.headers.Authorization = 'Basic ' + this.Base64.encode(user + ':' + pass);
};
RequestService.prototype.noBasicAuth = function() {
    delete this.headers.Authorization;
};
RequestService.prototype.request = function(method, route, args, success, error) {
    this.$http({
        method: method,
        url: this.protocol + '://' + this.server + route,
        headers: this.headers,
        data: $.param(args)
    })
    .success(function(data, status, headers, config) {
        if (success) {
            success(data);
        }
    })
    .error(function(data, status, headers, config) {
        if (error) {
            error(data);
        }
    });
};

var sizeFilter = function() {
    return function(number) {
        var tmp = number / 1024;
        if (tmp < 1) {
            return number.toString() + ' o';
        }
        number = tmp;
        tmp = number / 1024;
        if (tmp < 1) {
            return number.toFixed(1) + ' Ko';
        }
        number = tmp;
        tmp = number / 1024;
        if (tmp < 1) {
            return number.toFixed(1) + ' Mo';
        }
        number = tmp;
        return number.toFixed(1) + ' Go';
    }
};

angular
.module('shunt.services', [])
.factory('Base64', [Base64Factory])
.service('requestService', ['$http', 'Base64', RequestService])
.filter('size', sizeFilter)
