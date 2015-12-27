angular.module('jobhop.controllers')
.controller('MainController', MainController);

MainController.$inject = ['$location', '$ionicTabsDelegate', '$cordovaSocialSharing', '$rootScope', '$ionicPopup', '$filter'];

function MainController($location, $ionicTabsDelegate, $cordovaSocialSharing, $rootScope, $ionicPopup, $filter) {

    $rootScope.selectTabWithIndex = function(index) {
        $ionicTabsDelegate.select(index);
    }

    $rootScope.isItemActive = function(item) {
        return item == $location.path();
    };

    $rootScope.showDetailsPopup = function() {
        $rootScope.DetailsPopup = $ionicPopup.show({
            templateUrl: 'views/list/details-popup.html',
            cssClass: 'details',
            scope: $rootScope
        });
    }
    $rootScope.closeDetailsPopup = function() {
        $rootScope.DetailsPopup.close();
    }

    $rootScope.showPushNotificationPopup = function(item) {
        $rootScope.pushNotificationPercent = item.percent > 0 ? item.percent : 20; // Default 20%
        $rootScope.pushNotificationEnabled = Boolean(item.percent);
        $rootScope.itemTitleForPushNotificationPopup = item.name;
        $rootScope.itemForPushNotificationPopup = item;
        $rootScope.PushNotificationPopup = $ionicPopup.show({
            templateUrl: 'views/list/push-popup.html',
            cssClass: 'push-notification',
            scope: $rootScope
        });
    }
    $rootScope.closePushNotificationPopup = function() {
        $rootScope.PushNotificationPopup.close();
    }
    $rootScope.setPushNotificationPercent = function(item, isEnabled, percent) {

        if (item.percent) {
            if ($rootScope.productsNotifications[item.id]) {
                // Destroy existing
                $rootScope.productsNotifications[item.id].destroy();
            }
        }

        if (isEnabled) {
            var ProductNotify = Parse.Object.extend("product_notify");
            var productNotify = new ProductNotify();
            productNotify.set('productID', item.id);
            productNotify.set('percent', parseInt(percent));
            productNotify.save(null, function(object) {
                $rootScope.productsNotifications[item.id] = object;
            });
        }
        item.percent = isEnabled ? percent : null;

        $rootScope.closePushNotificationPopup();
    }

    // TODO
    var APP_NAME = 'jobhopapp';
    var APP_COUNTRY = 'il';
    var APP_ID = '1020643523';

    $rootScope.shareApp = function() {
        $cordovaSocialSharing.share(
            'מצורף קישור לאפליקציית פריסייל החדשה',
            false,
            false,
            'http://itunes.apple.com/' + APP_COUNTRY + '/app/' + APP_NAME + '/id' + APP_ID + '?mt=8'
        );
    };


    //Filter popup
    $rootScope.showFilterPopup = function() {
        $rootScope.typeFilter = $rootScope.filterType;
        $rootScope.orderFilter = $rootScope.filterOrder;
        $rootScope.FilterPopup = $ionicPopup.show({
            templateUrl: 'views/list/filter-popup.html',
            cssClass: 'list-filter',
            scope: $rootScope
        });
    };
    $rootScope.closeFilterPopup = function() {
        $rootScope.FilterPopup.close();
    };
    $rootScope.setFilters = function(order, type) {
        $rootScope.filterOrder = order;
        $rootScope.filterType = type;
        $rootScope.resetProducts();
        $rootScope.closeFilterPopup();
    };

    $rootScope.showDatePopup = function() {
        $rootScope.dateFilter = new Date($filter('date')($rootScope.filterDate, 'yyyy-MM-dd'));
        $rootScope.DatePopup = $ionicPopup.show({
            templateUrl: 'views/list/date-popup.html',
            cssClass: 'date-filter',
            scope: $rootScope
        });
    };
    $rootScope.closeDatePopup = function() {
        $rootScope.DatePopup.close();
    };
    $rootScope.setDate = function(date) {
        $rootScope.filterDate = $filter('date')(date, 'yyyy-MM-dd');
        $rootScope.resetProducts();
        $rootScope.closeDatePopup();
    };

};
