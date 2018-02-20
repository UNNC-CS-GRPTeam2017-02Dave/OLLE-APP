angular.module('ionicApp', ['ionic'])

    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    })

    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('tabs', {
          url: "/tab",
          abstract: true,
          templateUrl: "templates/tabs.html"
        })

        

        .state('tabs.forum', {
        	
          
          views: {
            'forum-tab': {
              templateUrl: "templates/sideNav.html",
              controller: 'HomeCtrl'
            }
          },
          url: "/forum",
          abstract: true    
        })

         .state('tabs.forum.tasks', {
          url: "/tasks",
          views: {
            'sideNav': {
              templateUrl: "templates/forum.html",
              controller: 'HomeCtrl'
            }
          }
        })
               
        .state('tabs.calendar', {
          url: "/calendar",
          views: {
            'calendar-tab': {
              templateUrl: "templates/calendar.html"
            }
          }
        })
        
        .state('tabs.chats', {
          url: "/chats",
          views: {
            'chats-tab': {
              templateUrl: "templates/chats.html",
              controller: 'ChatRoomsCtrl' 
            }
          }
        })

        .state('tabs.me', {
          url: "/me",
          views: {
            'me-tab': {
              templateUrl: "templates/me.html"
            }
          }
        })

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/forum/tasks');
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
    
        $scope.weeks = [
        	{value: 5, id: 5},
        	{value: 4, id: 4},
        	{value: 3, id: 3},
        	{value: 2, id: 2},
        	{value: 1, id: 1}
      	];

        $scope.newTask = function() {
          	$scope.settingsModal.show();
        };
  
        $scope.onItemDelete = function(week) {
	    	$scope.weeks.splice($scope.weeks.indexOf(week), 1);
	  	};

	  	$scope.edit = function(week) {
	    	alert('Edit week: ' + week.id);
	  	};

     })
     .controller('TaskCtrl', function($scope) {
        $scope.close = function() {
          $scope.modal.hide();
        }
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