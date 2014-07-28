define([], function () {

    var Formatters = function() {};

    Formatters.prototype.formatBytes = function (size) {
        if (size < 1024) {
            return size + "kb";
        } else if (size < 1048576) {
            return (Math.round(((size * 10) / 1024) / 10)) + "KB";
        } else {
            return (Math.round(((size * 10) / 1048576) / 10)) + "MB";
        }
    };

    Formatters.prototype.toTitleCase = function (str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        });
    };

    Formatters.prototype.zeroPad = function (num, numZeros) {
        var n, zeroString, zeros;
        n = Math.abs(num);
        zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
            zeroString = '-' + zeroString;
        }
        return zeroString + n;
    };

    return Formatters;
});