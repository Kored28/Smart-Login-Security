(function () {
    if (typeof smartLoginSecuritySession === 'undefined') {
        return;
    }

    var timeoutMinutes = parseInt(smartLoginSecuritySession.timeoutMinutes, 10) || 30;
    var timeoutMs = timeoutMinutes * 60 * 1000;
    var logoutUrl = smartLoginSecuritySession.logoutUrl;
    var lastActivity = Date.now();

    ['mousemove', 'keydown', 'click', 'scroll'].forEach(function (eventName) {
        document.addEventListener(eventName, function () {
            lastActivity = Date.now();
        });
    });

    setInterval(function () {
        if (Date.now() - lastActivity >= timeoutMs) {
            window.location.href = logoutUrl;
        }
    }, 30000);
})();