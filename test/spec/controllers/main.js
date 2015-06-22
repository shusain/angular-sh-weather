'use strict';

describe('Service : WeatherService', function () {

  var weatherService, $httpBackend;

  // load the controller's module
  beforeEach(module('myApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_weatherService_, _$httpBackend_) {
    weatherService = _weatherService_;
    $httpBackend = _$httpBackend_;
  }));

  it('it should request some data for Chicago, IL', function () {


    $httpBackend.whenGET('http://api.openweathermap.org/data/2.5/weather?q=Chicago, IL&units=imperial&cnt=5').respond(
      {
        'coord': {
          'lon':-87.63,
          'lat':41.88
        },
        'sys':{
          'type':1,
          'id':961,
          'message':0.3266,
          'country':'United States of America',
          'sunrise':1409743141,'sunset':1409790017
        },
        'weather':[
          {
            'id':500,
            'main':'Rain',
            'description':'light rain',
            'icon':'10d'
          }
        ],
        'base':'cmc stations',
        'main':{
          'temp':81.88,
          'pressure':1016,
          'humidity':48,
          'temp_min':78.8,
          'temp_max':84
        },
        'wind':{
          'speed':7.78,
          'deg':260,
          'gust':7.7
        },
        'rain':{
          '1h':0.25
        },
        'clouds':{
          'all':20
        },
        'dt':1409770382,
        'id':0,
        'name':'Chicago',
        'cod':200
      }
    );


    weatherService.getWeather('Chicago, IL').then(function(weatherData)
    {
      expect(weatherData.temp.current).toBe(81.88);
    });

    $httpBackend.flush();

  });
});
