'use strict';
//This will be overridden later in the file after a build in order to load the templates, this is just a placeholder
//to keep the module happy during development
angular.module('weather-templates', []);
var weatherModule = angular.module('weatherModule', ['weather-templates']);
weatherModule.service('weatherService', [
  '$http',
  function ($http) {
    var service = {
        curWeather: {},
        forecast: {},
        getWeather: function (location) {
          location = location || 'Henry,IL';
          if (service.curWeather[location])
            return service.curWeather[location];
          service.curWeather[location] = {
            temp: {},
            clouds: null
          };
          $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + location + '&units=imperial&cnt=5').success(function (data) {
            if (data) {
              if (data.main) {
                service.curWeather[location].temp.current = data.main.temp;
                service.curWeather[location].temp.min = data.main.temp_min;
                service.curWeather[location].temp.max = data.main.temp_max;
              }
              service.curWeather[location].clouds = data.clouds ? data.clouds.all : undefined;
            }
          });
          return service.curWeather[location];
        },
        getForecast: function (location) {
          location = location || 'Henry,IL';
          if (service.forecast[location])
            return service.forecast[location];
          service.forecast[location] = {};
          $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=' + location + '&units=imperial&cnt=10').success(function (data) {
            if (data) {
              angular.copy(data, service.forecast[location]);
            }
          });
          return service.forecast[location];
        }
      };
    return service;
  }
]);
weatherModule.filter('temp', [
  '$filter',
  function ($filter) {
    return function (input, precision) {
      if (!precision) {
        precision = 1;
      }
      var numberFilter = $filter('number');
      return numberFilter(input, precision) + '&deg;';
    };
  }
]);
weatherModule.filter('daysInTheFuture', function () {
  return function (input) {
    return new moment().add(input, 'days').format('dddd<br/>MMM Do YYYY');
  };
});
weatherModule.directive('todaysWeather', [
  'weatherService',
  function (weatherService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        location: '@',
        useGoogleImages: '=',
        customSize: '=?'
      },
      templateUrl: 'templates/currentWeatherDisplay.tpl.html',
      link: function (scope, iElem, iAttr) {
        scope.customSize = scope.customSize || 75;
        scope.weather = weatherService.getWeather(scope.location);
      }
    };
  }
]);
weatherModule.directive('weatherForecast', [
  'weatherService',
  function (weatherService) {
    return {
      scope: {
        location: '@',
        useGoogleImages: '=',
        customSize: '=?'
      },
      restrict: 'E',
      replace: true,
      templateUrl: 'templates/forecastDisplay.tpl.html',
      link: function (scope) {
        scope.customSize = scope.customSize || 50;
        scope.findIndex = function (weatherObj) {
          return scope.forecast.list.indexOf(weatherObj);
        };
        scope.forecast = weatherService.getForecast(scope.location);  // console.log('loaded forecast:')
                                                                      // console.log(scope.forecast)
      }
    };
  }
]);
weatherModule.directive('weatherDisplay', function () {
  return {
    scope: {
      weather: '=',
      customSize: '=',
      useGoogleImages: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/basicWeatherDisplay.tpl.html'
  };
});
weatherModule.directive('weatherIcon', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      cloudiness: '@',
      customSize: '=',
      useGoogleImages: '='
    },
    link: function (scope) {
      scope.getIconClass = function () {
        if (scope.cloudiness < 20) {
          return 'wi-day-sunny';
        } else if (scope.cloudiness < 90) {
          return 'wi-day-cloudy';
        } else {
          return 'wi-cloudy';
        }
      };
    },
    template: '<i style=\'font-size:{{customSize}}px;margin-right:16px;margin-left:16px\' ng-class=\'getIconClass()\'></i>'
  };
});
weatherModule.directive('weatherIconGoogle', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      cloudiness: '@',
      customSize: '=',
      useGoogleImages: '='
    },
    link: function (scope) {
      scope.imgurl = function () {
        var baseUrl = 'https://ssl.gstatic.com/onebox/weather/128/';
        if (scope.cloudiness < 20) {
          return baseUrl + 'sunny.png';
        } else if (scope.cloudiness < 90) {
          return baseUrl + 'partly_cloudy.png';
        } else {
          return baseUrl + 'cloudy.png';
        }
      };
    },
    template: '<img style=\'height:{{customSize}}px;width:{{customSize}}px\' ng-src=\'{{ imgurl() }}\'>'
  };
});
;
angular.module('weather-templates', [
  'templates/basicWeatherDisplay.tpl.html',
  'templates/currentWeatherDisplay.tpl.html',
  'templates/forecastDisplay.tpl.html'
]);
angular.module('templates/basicWeatherDisplay.tpl.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/basicWeatherDisplay.tpl.html', '<div class="row">\n' + '  <div class="col-xs-12">\n' + '    \n' + '    <weather-icon-google\n' + '      cloudiness="{{ weather.clouds }}"\n' + '      custom-size="customSize"\n' + '      ng-if="useGoogleImages">\n' + '    </weather-icon-google>\n' + '\n' + '    <weather-icon\n' + '      cloudiness="{{ weather.clouds }}"\n' + '      custom-size="customSize"\n' + '      ng-if="!useGoogleImages">\n' + '    </weather-icon>\n' + '    \n' + '    <span style="display:inline-block; vertical-align:middle">\n' + '      <h3 ng-show="weather.temp.current">\n' + '        Current: <span ng-bind-html="weather.temp.current | temp:2"></span>\n' + '      </h3>\n' + '      \n' + '      min: <span ng-bind-html="weather.temp.min | temp"></span><br/>\n' + '      max: <span ng-bind-html="weather.temp.max | temp"></span><br/>\n' + '\n' + '      <span ng-show="weather.rain">\n' + '        <h6>\n' + '          {{weather.rain}}% Chance of rain\n' + '        </h6>\n' + '      </span>\n' + '\n' + '      <span ng-hide="weather.rain">\n' + '        <h6>\n' + '          No rain expected.\n' + '        </h6>\n' + '      </span>\n' + '    </span>\n' + '  </div>\n' + '</div>\n' + '');
  }
]);
angular.module('templates/currentWeatherDisplay.tpl.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/currentWeatherDisplay.tpl.html', '<div>\n' + '    <weather-display\n' + '      weather="weather"\n' + '      use-google-images="useGoogleImages"\n' + '      custom-size="customSize">\n' + '    </weather-display>\n' + '</div>');
  }
]);
angular.module('templates/forecastDisplay.tpl.html', []).run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/forecastDisplay.tpl.html', '<div class="row" style="border-top:1px solid #eee">\n' + '    <div class="col-xs-6">\n' + '      <div class="row" ng-repeat="weather in forecast.list | limitTo:5" style="border-bottom:1px solid #eee;border-right:1px solid #eee">\n' + '        <div class="col-xs-12">\n' + '          <h6 ng-bind-html="(findIndex(weather)+1)|daysInTheFuture"></h6>\n' + '          <weather-display weather="weather" custom-size="customSize" use-google-images="useGoogleImages">\n' + '          </weather-display>  \n' + '        </div>\n' + '      </div>\n' + '    </div>\n' + '\n' + '    <div class="col-xs-6">\n' + '      <div class="row" ng-repeat="weather in forecast.list | limitTo:-5" style="border-bottom:1px solid #eee">\n' + '        <div class="col-xs-12">\n' + '          <h6 ng-bind-html="(findIndex(weather)+1)|daysInTheFuture"></h6>\n' + '          <weather-display weather="weather" custom-size="customSize" use-google-images="useGoogleImages">\n' + '          </weather-display>    \n' + '        </div>\n' + '      </div>\n' + '    </div>\n' + '</div>');
  }
]);