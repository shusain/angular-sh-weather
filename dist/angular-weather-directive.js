'use strict';

//This will be overridden later in the file after a build in order to load the templates, this is just a placeholder
//to keep the module happy during development
angular.module("weather-templates", []);

var weatherModule = angular.module('weatherModule', ["weather-templates"]);

weatherModule.service('weatherService', function($http) {
    var service = {
      curWeather: {},
      forecast: {},
      
      getWeather: function(location, units) {
        location = location || 'Henry,IL';

        if(service.curWeather[location])
          return service.curWeather[location];
        
        service.curWeather[location] = { temp: {}, clouds: null };
        $http.get('http://api.openweathermap.org/data/2.5/weather?q='+location+'&units='+units+'&cnt=5').success(function(data) {
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
      getForecast: function(location, units) {
        location = location || 'Henry,IL';

        if(service.forecast[location])
          return service.forecast[location];
        
        service.forecast[location] = {}

        $http.get('http://api.openweathermap.org/data/2.5/forecast/daily?q='+location+'&units='+units+'&cnt=10').success(function(data) {
            if (data) {
              angular.copy(data,service.forecast[location]);
            }
        });

        return service.forecast[location];
      }
      
      
      
    };
    return service;
});

weatherModule.filter('temp', function($filter) {
  return function(input, precision, units) {
    if (!precision) {
        precision = 1;
    }

    var unitDisplay;

    switch (units){
      case "imperial":
        unitDisplay = "F"
        break;
      case "metric":
        unitDisplay = "C"
        break;
      default:
        unitDisplay = "F"
        break;
    }

    var numberFilter = $filter('number');
    return numberFilter(input, precision) + '&deg;' + unitDisplay;
  };
});

weatherModule.filter('daysInTheFuture', function(){
  return function(input){
    return new moment().add(input,'days').format('dddd<br/>MMM Do YYYY');
  };
});

weatherModule.directive('todaysWeather', function(weatherService){
  return {
    restrict:'E',
    replace:true,
    scope: {
      location:'@',
      useGoogleImages: '=',
      customSize: '=?',
      units: '@?'
    },
    templateUrl:'templates/currentWeatherDisplay.tpl.html',
    link: function(scope, iElem, iAttr){
      scope.customSize = scope.customSize || 75;
      scope.units = scope.units || "imperial";
      scope.weather = weatherService.getWeather(scope.location, scope.units);
    }
  };
});


weatherModule.directive('weatherForecast', function(weatherService){
  return {
    scope:{
      location:'@',
      useGoogleImages:'=',
      customSize:'=?',
      units:'@?'
    },
    restrict:'E',
    replace:true,
    templateUrl:'templates/forecastDisplay.tpl.html',
    link: function(scope){
      scope.customSize = scope.customSize || 50;
      scope.units = scope.units || "imperial";

      scope.findIndex = function(weatherObj){
        return scope.forecast.list.indexOf(weatherObj);
      };
      scope.forecast = weatherService.getForecast(scope.location, scope.units);
      // console.log('loaded forecast:')
      // console.log(scope.forecast)
    }
  };
});


weatherModule.directive('weatherDisplay', function(){
  return {
    scope:{
      weather:'=',
      customSize:'=',
      useGoogleImages:'=',
      units:'='
    },
    restrict:'E',
    replace:true,
    templateUrl:'templates/basicWeatherDisplay.tpl.html'
  };
});


weatherModule.directive('weatherIcon', function() {
    return {
        restrict: 'E', replace: true,
        scope: {
            cloudiness: '@',
            customSize:'=',
            useGoogleImages:'='
        },
        link: function(scope){
            scope.getIconClass = function() {
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


weatherModule.directive('weatherIconGoogle', function() {
    return {
        restrict: 'E', replace: true,
        scope: {
            cloudiness: '@',
            customSize:'=',
            useGoogleImages:'='
        },
        link: function(scope){
            scope.imgurl = function() {


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
