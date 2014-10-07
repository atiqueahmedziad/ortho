function getSrv(name) {
  return angular.element(document.body).injector().get(name);
}
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'ortho' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'ortho.services' is found in services.js
// 'ortho.controllers' is found in controllers.js
angular.module('ortho', ['ionic'])

.run(["$ionicPlatform", function($ionicPlatform) {
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
}]);
angular.module('ortho')
.factory('Words', function() {

  // Might use a resource here that returns a JSON array
  var id=0, words = _.chain(window.words).map(function(meaning, word){
    return meaning.name = word, meaning.id=id++, meaning;
  }).toArray().value();

  return {
    all: function() {
      return words;
    },
    paginate: function(page, count, words) {
      var from = (page-1)*count,
          to = page*count;

      return words.slice(from, to);
    },
    getByName: function(word) {
      return _.findWhere(words, {name: angular.lowercase(word)});
    },
    get: function(id) {
      return _.findWhere(words, {id: parseInt(id)});
    },
  };
});
angular.module('ortho')
.controller('AlphabetWordsCtrl', ["$scope", "Words", "$stateParams", "$state", function($scope, Words, $stateParams, $state){
    $scope.alphabet = $stateParams.alphabet;
    $scope.page =  $stateParams.page;
    $scope.perPage = 10;

    $scope.thisAlphWords = Words.all().filter(function(word){
        return word.name.indexOf(angular.lowercase($scope.alphabet)) === 0;
    });


    $scope.paginate = function(page){
        $state.go('tab.alphabet-words', {alphabet: $scope.alphabet, page: $scope.page });
    };

    $scope.prev = function(){
        if( --$scope.page === 0 ) $scope.page--;
        $scope.paginate();
    };

    $scope.next = function(){
        if( ++$scope.page === 0 ) $scope.page++;
        $scope.paginate();
    };
    console.log('we are in page '+$scope.page);

    $scope.words = Words.paginate($scope.page, $scope.perPage, $scope.thisAlphWords);
}]);
angular.module('ortho')
.controller('AlphabetsCtrl', ["$scope", "$state",
    function($scope, $state){
        $scope.alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
}]);
angular.module('ortho')
.controller('DashCtrl', ["$scope", "Words", "$timeout", "$state",
    function($scope, Words, $timeout, $state) {
    $scope.search = function(word){
        $scope.word = Words.getByName(word);
        if (!$scope.word) {
            alert('word does not exist in the dictionary');
            return;
        }

        $state.go('tab.dash-meaning', {wordId: $scope.word.id});
    };
}]);
angular.module('ortho')
.controller('SettingsCtrl', ["$scope",
    function($scope) {

}]);
angular.module('ortho')
.controller('WordMeaningCtrl', ["$scope", "$stateParams", "Words",
    function($scope, $stateParams, Words) {
        $scope.word = Words.get($stateParams.wordId);
}]);
angular.module('ortho')
.config(["$stateProvider", "$urlRouterProvider", "$compileProvider",
	function($stateProvider, $urlRouterProvider, $compileProvider) {

		//fixes issues with ffos
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);

		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/tab/dash');

		// Ionic uses AngularUI Router which uses the concept of states
		// Learn more here: https://github.com/angular-ui/ui-router
		// Set up the various states which the app can be in.
		$stateProvider
		// setup an abstract state for the tabs directive
		.state('tab', {
			url: "/tab",
			abstract: true,
			templateUrl: "templates/tabs.html"
		})




		// Each tab has its own nav history stack:
		.state('tab.dash', {
			url: '/dash',
			views: {
				'tab-dash': {
					templateUrl: 'templates/dash/dash.html',
					controller: 'DashCtrl'
				}
			}
		})
		.state('tab.dash-meaning', {
			url: '/dash/meaning/:wordId',
			views: {
				'tab-dash': {
					templateUrl: 'templates/word/meaning.html',
					controller: 'WordMeaningCtrl'
				}
			}
		})




		// Each tab has its own nav history stack:
		.state('tab.alphabets', {
			url: '/alphabets',
			views: {
				'tab-alphabets': {
					templateUrl: 'templates/alphabet/alphabets.html',
					controller: 'AlphabetsCtrl'
				}
			}
		})

		.state('tab.alphabet-words', {
			url: '/alphabet/:alphabet/:page',
			views: {
				'tab-alphabets': {
					templateUrl: 'templates/alphabet/words.html',
					controller: 'AlphabetWordsCtrl'
				}
			}
		})

		.state('tab.alphabet-word', {
			url: '/meaning/:wordId',
			views: {
				'tab-alphabets': {
					templateUrl: 'templates/word/meaning.html',
					controller: 'WordMeaningCtrl'
				}
			}
		})





		.state('tab.setting', {
			url: '/setting',
			views: {
				'tab-setting': {
					templateUrl: 'templates/tab-settings.html',
					controller: 'SettingsCtrl'
				}
			}
		});


}]);