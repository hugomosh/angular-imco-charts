'use strict';
angular.module('imco.charts', []).directive('imcoLineChart', [
  '$window',
  function ($window) {
    return {
      restrict: 'EAC',
      scope: {
        config: '=?',
        chartData: '='
      },
      template: '<svg></svg>',
      link: function postLink(scope, element, iAttrs, controller) {
        var d3 = $window.d3;
        var rawSvg = element.find('svg')[0];
        var build = function build(argument) {
          var data = scope.chartData.data;
          var defaultConfig = {
              yDomain: [
                d3.min(data, function (d) {
                  return Number(d.y);
                }),
                d3.max(data, function (d) {
                  return Number(d.y);
                })
              ],
              dataFormat: ',.2f'
            };
          //console.debug('Datos', data);
          //console.log('Dominio', defaultConfig.yDomain);
          if (!scope.config) {
            scope.config = defaultConfig;
          }
          var margin = {
              top: 20,
              right: 20,
              bottom: 30,
              left: 40
            }, width = element.width() - margin.left - margin.right, height = element.height() - margin.top - margin.bottom;
          var format = scope.config.dataFormat ? scope.config.dataFormat : defaultConfig.dataFormat;
          var numberFormat = d3.format(format);
          var x = d3.scale.ordinal().domain(data.map(function (d) {
              return d.x;
            })).rangePoints([
              0,
              width
            ]);
          var y = d3.scale.linear().range([
              height,
              0
            ]).domain(scope.config.yDomain ? scope.config.yDomain : defaultConfig.yDomain);
          var xAxis = d3.svg.axis().scale(x).orient('bottom');
          var yAxis = d3.svg.axis().scale(y).orient('left');
          var line = d3.svg.line().defined(function (d) {
              return Number(d.y) != null;
            }).x(function (d) {
              return x(d.x);
            }).y(function (d) {
              return y(Number(d.y));
            });
          // var area = d3.svg.area()
          //     .defined(line.defined())
          //     .x(line.x())
          //     .y1(line.y())
          //     .y0(y(0));
          var largo = Math.min(element.width(), element.height());
          if (!largo || largo === 0) {
            largo = 100;
          }
          var svg = d3.select(rawSvg).style('width', '100%').style('height', '100%').attr('viewBox', '0, 0, ' + largo + ', ' + largo).attr('preserveAspectRatio', 'xMinYMin').datum(data).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          /* 
                     svg.append("path")
                          .attr("class", "area")
                          .attr("d", area);
                     */
          svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
          svg.append('g').attr('class', 'y axis').attr('transform', 'translate(-5,0)').call(yAxis);
          svg.append('path').attr('class', 'line').attr('d', line);
          svg.selectAll('.dot').data(data.filter(function (d) {
            return Number(d.y);
          })).enter().append('circle').attr('class', 'dot').attr('cx', line.x()).attr('cy', line.y()).attr('r', 3);
          svg.selectAll('.text').data(data.filter(function (d) {
            return Number(d.y);
          })).enter().append('text').text(function (d) {
            //console.log(d);
            return numberFormat(d.y);
          }).attr('x', line.x()).attr('y', line.y()).attr('font-family', 'sans-serif').attr('font-size', '12px').attr('background-color', 'white').attr('transform', 'translate(-20,-10)').attr('fill', '#2E9FA3');
        };
        scope.$watch('chartData', function (newValue, oldValue) {
          //console.log('chartData');
          if (newValue && newValue !== '') {
            //console.log('Build arc3');
            build();
          }
        });
      }
    };
  }
]).directive('imcoBarChart', [
  '$window',
  function ($window) {
    return {
      restrict: 'EAC',
      scope: {
        config: '=?',
        chartData: '='
      },
      template: '<svg></svg>',
      link: function postLink(scope, element, iAttrs, controller) {
        var d3 = $window.d3;
        var rawSvg = element.find('svg')[0];
        var build = function build(argument) {
          var data = scope.chartData.data;
          var defaultConfig = {
              yDomain: [
                d3.min(data, function (d) {
                  return Number(d.y);
                }),
                d3.max(data, function (d) {
                  return Number(d.y);
                })
              ],
              dataFormat: ',.2f'
            };
          //console.debug('Datos', data);
          //console.log('Dominio', defaultConfig.yDomain);
          if (!scope.config) {
            scope.config = defaultConfig;
          }
          var margin = {
              top: 20,
              right: 20,
              bottom: 30,
              left: 40
            }, width = element.width() - margin.left - margin.right, height = element.height() - margin.top - margin.bottom;
          var format = scope.config.dataFormat ? scope.config.dataFormat : defaultConfig.dataFormat;
          var numberFormat = d3.format(format);
          var x = d3.scale.ordinal().domain(data.map(function (d) {
              return d.x;
            })).rangePoints([
              0,
              width
            ]);
          var y = d3.scale.linear().range([
              height,
              0
            ]).domain(scope.config.yDomain ? scope.config.yDomain : defaultConfig.yDomain);
          var xAxis = d3.svg.axis().scale(x).orient('bottom');
          var yAxis = d3.svg.axis().scale(y).orient('left');
          var line = d3.svg.line().defined(function (d) {
              return Number(d.y) != null;
            }).x(function (d) {
              return x(d.x);
            }).y(function (d) {
              return y(Number(d.y));
            });
          // var area = d3.svg.area()
          //     .defined(line.defined())
          //     .x(line.x())
          //     .y1(line.y())
          //     .y0(y(0));
          var largo = Math.min(element.width(), element.height());
          if (!largo || largo === 0) {
            largo = 100;
          }
          var svg = d3.select(rawSvg).style('width', '100%').style('height', '100%').attr('viewBox', '0, 0, ' + largo + ', ' + largo).attr('preserveAspectRatio', 'xMinYMin').datum(data).attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          /* 
                     svg.append("path")
                          .attr("class", "area")
                          .attr("d", area);
                     */
          svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(xAxis);
          svg.append('g').attr('class', 'y axis').attr('transform', 'translate(-5,0)').call(yAxis);
          svg.append('path').attr('class', 'line').attr('d', line);
          svg.selectAll('.dot').data(data.filter(function (d) {
            return Number(d.y);
          })).enter().append('circle').attr('class', 'dot').attr('cx', line.x()).attr('cy', line.y()).attr('r', 3);
          svg.selectAll('.text').data(data.filter(function (d) {
            return Number(d.y);
          })).enter().append('text').text(function (d) {
            //console.log(d);
            return numberFormat(d.y);
          }).attr('x', line.x()).attr('y', line.y()).attr('font-family', 'sans-serif').attr('font-size', '12px').attr('background-color', 'white').attr('transform', 'translate(-20,-10)').attr('fill', '#2E9FA3');
        };
        scope.$watch('chartData', function (newValue, oldValue) {
          //console.log('chartData');
          if (newValue && newValue !== '') {
            //console.log('Build arc3');
            build();
          }
        });
      }
    };
  }
]);