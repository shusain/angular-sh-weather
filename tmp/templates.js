angular.module('weather-templates', ['templates/basicWeatherDisplay.tpl.html', 'templates/currentWeatherDisplay.tpl.html', 'templates/forecastDisplay.tpl.html']);

angular.module("templates/basicWeatherDisplay.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/basicWeatherDisplay.tpl.html",
    "<div class=\"row\">\n" +
    "  <div class=\"col-xs-12\">\n" +
    "    \n" +
    "    <weather-icon-google\n" +
    "      cloudiness=\"{{ weather.clouds }}\"\n" +
    "      custom-size=\"customSize\"\n" +
    "      ng-if=\"useGoogleImages\">\n" +
    "    </weather-icon-google>\n" +
    "\n" +
    "    <weather-icon\n" +
    "      cloudiness=\"{{ weather.clouds }}\"\n" +
    "      custom-size=\"customSize\"\n" +
    "      ng-if=\"!useGoogleImages\">\n" +
    "    </weather-icon>\n" +
    "    \n" +
    "    <span style=\"display:inline-block; vertical-align:middle\">\n" +
    "      <h3 ng-show=\"weather.temp.current\">\n" +
    "        Current: <span ng-bind-html=\"weather.temp.current | temp:2\"></span>\n" +
    "      </h3>\n" +
    "      \n" +
    "      min: <span ng-bind-html=\"weather.temp.min | temp\"></span><br/>\n" +
    "      max: <span ng-bind-html=\"weather.temp.max | temp\"></span><br/>\n" +
    "\n" +
    "      <span ng-show=\"weather.rain\">\n" +
    "        <h6>\n" +
    "          {{weather.rain}}% Chance of rain\n" +
    "        </h6>\n" +
    "      </span>\n" +
    "\n" +
    "      <span ng-hide=\"weather.rain\">\n" +
    "        <h6>\n" +
    "          No rain expected.\n" +
    "        </h6>\n" +
    "      </span>\n" +
    "    </span>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/currentWeatherDisplay.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/currentWeatherDisplay.tpl.html",
    "<div>\n" +
    "    <weather-display\n" +
    "      weather=\"weather\"\n" +
    "      use-google-images=\"useGoogleImages\"\n" +
    "      custom-size=\"customSize\">\n" +
    "    </weather-display>\n" +
    "</div>");
}]);

angular.module("templates/forecastDisplay.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/forecastDisplay.tpl.html",
    "<div class=\"row\" style=\"border-top:1px solid #eee\">\n" +
    "    <div class=\"col-xs-6\">\n" +
    "      <div class=\"row\" ng-repeat=\"weather in forecast.list | limitTo:5\" style=\"border-bottom:1px solid #eee;border-right:1px solid #eee\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <h6 ng-bind-html=\"(findIndex(weather)+1)|daysInTheFuture\"></h6>\n" +
    "          <weather-display weather=\"weather\" custom-size=\"customSize\" use-google-images=\"useGoogleImages\">\n" +
    "          </weather-display>  \n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-xs-6\">\n" +
    "      <div class=\"row\" ng-repeat=\"weather in forecast.list | limitTo:-5\" style=\"border-bottom:1px solid #eee\">\n" +
    "        <div class=\"col-xs-12\">\n" +
    "          <h6 ng-bind-html=\"(findIndex(weather)+1)|daysInTheFuture\"></h6>\n" +
    "          <weather-display weather=\"weather\" custom-size=\"customSize\" use-google-images=\"useGoogleImages\">\n" +
    "          </weather-display>    \n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
