angular.module('jobhop.controllers')
    .controller('ProductsController', ProductsController);

ProductsController.$inject = ['$rootScope', '$location', '$http', '$cordovaSocialSharing', '$filter', '$ionicPopup', '$scope'];

function ProductsController($rootScope, $location, $http, $cordovaSocialSharing, $filter, $ionicPopup, $scope) {

    //Toggle 1 or 2 items per row
    $rootScope.viewClassName = 'two-per-row';
    $rootScope.changeView = function() {
        $rootScope.viewClassName = $rootScope.viewClassName == 'two-per-row' ? '' : 'two-per-row';
    };


    $rootScope.resetProducts = function() {
        $rootScope.items = [];
        $scope.no_more_data_to_load = false;
        $rootScope.loadMore();
    };


    $scope.shareProduct = function(product) {
        $cordovaSocialSharing.share(
            'עדכון מעניין מאפליקציית פריסייל על '
            +product.name+"\nhttp://google.com");
    };


    //Set which product info will be displayed in list
    $rootScope.setListDetails = function(listDetails) {
        $rootScope.listDetails = listDetails;
        $rootScope.closeDetailsPopup();
    };
    $rootScope.userType = 'wholesale';
    $rootScope.listDetails = 'price';
    $rootScope.setUserType = function(userType) {
        if ($location.path() != '/main/products-wholesale') {
            $location.path('/main/products-wholesale');
        }

        $rootScope.userType = userType;
    };
    $scope.topQualityPrice = function(item) {
        return parseFloat(item.topQuality[$scope.userType].price);
    };
    $scope.primeQualityPrice = function(item) {
        return parseFloat(item.primeQuality[$scope.userType].price);
    };
    $scope.topQualityAvgPrice = function(item) {
        return parseFloat(item.topQuality[$scope.userType].weeklyAvg);
    };
    $scope.primeQualityAvgPrice = function(item) {
        return parseFloat(item.primeQuality[$scope.userType].weeklyAvg);
    };
    $scope.topQualityPercentChange = function(item) {
        return parseFloat(item.topQuality[$scope.userType].percentChange);
    };
    $scope.primeQualityPercentChange = function(item) {
        return parseFloat(item.primeQuality[$scope.userType].percentChange);
    };



    //Load products
    $rootScope.items = [];
    $rootScope.filterName  = undefined;
    $rootScope.filterDate  = $filter('date')(new Date(), 'yyyy-MM-dd');
    $rootScope.filterType  = '';
    $rootScope.filterOrder = 'DAILY_CHANGE';
    $rootScope.filterSort  = undefined;
    $scope.no_more_data_to_load = false;
    $rootScope.loadMore = function() {
        console.trace();
        if ($scope.no_more_data_to_load) {
            return;
        }

        // Workaround to make sure productsNotifications are ready
        if ($rootScope.productsNotifications === undefined) {
            setTimeout($rootScope.loadMore, 300);
            return;
        }

        //todo $rootScope.filterName

        var url = 'http://62.219.7.38/api/Public?pwd=ck32HGDESf13ekcs&name=&item_type='+$rootScope.filterType+'&order='+$rootScope.filterOrder+'&date='+$rootScope.filterDate+'&page='+parseInt($rootScope.items.length/50);
        $http.get(url)
            .then(function(items) {
                if (items.data.length < 50) {
                    $scope.no_more_data_to_load = true;
                }

                for(var i =0; i<items.data.length; i++) {
                    items.data[i].percent = $rootScope.productsNotifications[items.data[i].id] ? $rootScope.productsNotifications[items.data[i].id].get('percent') : null;
                    $rootScope.items.push(items.data[i]);
                }

                $scope.$broadcast('scroll.infweeklyAvginiteScrollComplete');
            });
    };

    /*$scope.$on('$stateChangeSuccess', function(a,b) {
        console.log('$rootScope.items.length', $rootScope.items.length);
        console.log('$rootScope.moreDataCanBeLoaded', $rootScope.moreDataCanBeLoaded());
        if (b.name == 'withTabs.productsWholesale' && $rootScope.moreDataCanBeLoaded() && $rootScope.items.length == 0) {
            //$rootScope.loadMore();
        }
    });*/
    $rootScope.moreDataCanBeLoaded = function() {
        return ! $scope.no_more_data_to_load;
    };

    $scope.itemClicked = function(item) {
        item.checked = ! item.checked;
    };


    $rootScope.openNameFilter = function() {
        $rootScope.showSearchBar = true;
    };

    $rootScope.closeNameFilter = function() {
        $rootScope.showSearchBar = false;
        angular.element(document.getElementById('search')).val('');
        $rootScope.searchInput = '';
        $rootScope.searchResults = [];
    };

    $rootScope.hasSearchResults = function() {
        return $rootScope.searchResults.length;
    };

    $rootScope.showSearchBar = false;
    $rootScope.searchInput = '';
    $rootScope.searchResults = [ ];
    $rootScope.prepareSearchResults = function(newValue) {
        $rootScope.searchResults = [ 'בלהבלה','בלו בלו' ];
    };
    $rootScope.setNameFilter = function(newNameFilter) {
        $rootScope.filterName = newNameFilter;
        $rootScope.closeNameFilter();
    };

}
