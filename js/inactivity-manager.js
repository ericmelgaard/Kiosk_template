"use strict";

var InactivityManager = (function () {
    function InactivityManager(menuLayout) {
        this.menuLayout = menuLayout;
        this.inactivityTimeout = null;
        this.warningTimeout = null;
        this.countdownInterval = null;
        this.warningDuration = 10;
        this.inactivityDuration = 50;
        this.countdownSeconds = this.warningDuration;
        this.isWarningShown = false;

        this.init();
    }

    InactivityManager.prototype.init = function () {
        var _this = this;

        _this.setupEventListeners();
        _this.setupWarningHandlers();
        _this.resetTimer();
    };

    InactivityManager.prototype.setupEventListeners = function () {
        var _this = this;
        var events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        events.forEach(function(event) {
            document.addEventListener(event, function() {
                _this.resetTimer();
            }, true);
        });
    };

    InactivityManager.prototype.setupWarningHandlers = function () {
        var _this = this;

        $(document).on('click', '#continue-browsing-btn', function() {
            _this.dismissWarning();
        });

        $(document).on('click', '#return-home-btn', function() {
            _this.returnToHome();
        });
    };

    InactivityManager.prototype.resetTimer = function () {
        var _this = this;

        if (_this.menuLayout.currentView === 'welcome' || _this.menuLayout.currentView === 'landing') {
            _this.clearTimers();
            return;
        }

        if (_this.isWarningShown) {
            _this.dismissWarning();
        }

        _this.clearTimers();

        _this.inactivityTimeout = setTimeout(function() {
            _this.showWarning();
        }, _this.inactivityDuration * 1000);
    };

    InactivityManager.prototype.showWarning = function () {
        var _this = this;
        _this.isWarningShown = true;
        _this.countdownSeconds = _this.warningDuration;

        $('#inactivity-warning').show();
        _this.updateCountdown();

        _this.countdownInterval = setInterval(function() {
            _this.countdownSeconds--;
            _this.updateCountdown();

            if (_this.countdownSeconds <= 0) {
                _this.returnToHome();
            }
        }, 1000);
    };

    InactivityManager.prototype.updateCountdown = function () {
        var _this = this;
        $('#countdown-seconds').text(_this.countdownSeconds);
        $('.countdown-text').text(_this.countdownSeconds);

        var circumference = 2 * Math.PI * 54;
        var progress = (_this.countdownSeconds / _this.warningDuration) * circumference;
        $('.countdown-progress').css({
            'stroke-dasharray': circumference,
            'stroke-dashoffset': circumference - progress
        });
    };

    InactivityManager.prototype.dismissWarning = function () {
        var _this = this;
        _this.isWarningShown = false;
        $('#inactivity-warning').hide();
        _this.clearTimers();
        _this.resetTimer();
    };

    InactivityManager.prototype.returnToHome = function () {
        var _this = this;
        _this.isWarningShown = false;
        $('#inactivity-warning').hide();
        $('#nutrition-modal').hide();
        _this.clearTimers();
        _this.menuLayout.renderWelcomeScreen();
    };

    InactivityManager.prototype.clearTimers = function () {
        var _this = this;

        if (_this.inactivityTimeout) {
            clearTimeout(_this.inactivityTimeout);
            _this.inactivityTimeout = null;
        }

        if (_this.warningTimeout) {
            clearTimeout(_this.warningTimeout);
            _this.warningTimeout = null;
        }

        if (_this.countdownInterval) {
            clearInterval(_this.countdownInterval);
            _this.countdownInterval = null;
        }
    };

    return InactivityManager;
})();
