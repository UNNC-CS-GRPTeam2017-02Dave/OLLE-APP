/*	angular.module('ionicApp', ['ionic'])

    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('tabs', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
        })
        .state('tabs.home', {
          url: "/home",
          views: {
            'home-tab': {
              templateUrl: "templates/home.html",
              controller: 'HomeTabCtrl'
            }
          }
        })
        .state('tabs.facts', {
          url: "/facts",
          views: {
            'home-tab': {
              templateUrl: "templates/facts.html"
            }
          }
        })
        .state('tabs.facts2', {
          url: "/facts2",
          views: {
            'home-tab': {
              templateUrl: "templates/facts2.html"
            }
          }
        })
        .state('tabs.about', {
          url: "/about",
          views: {
            'about-tab': {
              templateUrl: "templates/about.html"
            }
          }
        })
        .state('tabs.navstack', {
          url: "/navstack",
          views: {
            'about-tab': {
              templateUrl: "templates/nav-stack.html"
            }
          }
        })
        .state('tabs.contact', {
          url: "/contact",
          views: {
            'contact-tab': {
              templateUrl: "templates/contact.html"
            }
          }
        });


       $urlRouterProvider.otherwise("/tab/home");

    })

    .controller('HomeTabCtrl', function($scope) {
      console.log('HomeTabCtrl');
    });
	
*/
	  angular.module('ionicApp', ['ionic'])

      .controller('RootCtrl', function($scope) {
        $scope.onControllerChanged = function(oldController, oldIndex, newController, newIndex) {
          console.log('Controller changed', oldController, oldIndex, newController, newIndex);
          console.log(arguments);
        };
      })


      .controller('HomeCtrl', function($scope, $timeout, $ionicModal, $ionicActionSheet) {
      

        $ionicModal.fromTemplateUrl('newTask.html', function(modal) {
          $scope.settingsModal = modal;
        });      

        $scope.onRefresh = function() {
          console.log('ON REFRESH');

          $timeout(function() {
            $scope.$broadcast('scroll.refreshComplete');
          }, 1000);
        }
        
        $scope.newTask = function() {
          $scope.settingsModal.show();
        };

        $scope.weeks = [
        	{value: 5, id: 5},
        	{value: 4, id: 4},
        	{value: 3, id: 3},
        	{value: 2, id: 2},
        	{value: 1, id: 1}
      	];
      })
      .controller('ChatRoomsCtrl', function($scope){

      	$scope.chatrooms = [
        	{ title: 'English', id: 1 },
        	{ title: 'Japanese', id: 2 },
        	{ title: 'Spanish', id: 3 },
        	{ title: 'Korean', id: 4 },
        	{ title: 'Chinese', id: 5 },
        	{ title: 'French', id: 6 }
      	];
      })
      .controller('TaskCtrl', function($scope) {
        $scope.close = function() {
          $scope.modal.hide();
        }
      })
      .controller('calenderCtrl', function ($scope, CalenderService) {


    	
    	
  		})

	
      .controller('AlertCtrl', function($scope, $ionicPopup){
      		$scope.showConfirm = function() {
             var confirmPopup = $ionicPopup.confirm({
               title: 'Log out',
               template: 'Are you sure you want to log out?'
             });
             confirmPopup.then(function(res) {
               if(res) {
                 window.location.href='index.html';
               } else {
                 console.log('You are not sure');
               }
             });
           };
      });