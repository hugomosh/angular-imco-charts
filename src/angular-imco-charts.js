'use strict';

angular.module('imco.charts', [])
    .directive('imcoLineChart', function($window) {
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
                        yDomain: [d3.min(data, function(d) {
                            return Number(d.y);
                        }), d3.max(data, function(d) {
                            return Number(d.y);

                        })],
                        dataFormat: ",.2f"
                    };
                    //console.debug('Datos', data);
                    //console.log('Dominio', defaultConfig.yDomain);
                    if (!scope.config) {
                        scope.config = defaultConfig
                    }

                    var margin = {
                            top: 20,
                            right: 20,
                            bottom: 30,
                            left: 40
                        },
                        width = element.width() - margin.left - margin.right,
                        height = element.height() - margin.top - margin.bottom;

                    var format = scope.config.dataFormat ? scope.config.dataFormat : defaultConfig.dataFormat;
                    var numberFormat = d3.format(format);

                    var x = d3.scale.ordinal()
                        .domain(data.map(function(d) {
                            return d.x;
                        }))
                        //.attr('transform', 'translate(0,'+ )
                        .rangePoints([0, width]);

                    var y = d3.scale.linear()
                        .range([height, 0])
                        .domain(scope.config.yDomain ? scope.config.yDomain : defaultConfig.yDomain);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

                    var line = d3.svg.line()
                        .defined(function(d) {
                            return Number(d.y) != null;
                        })
                        .x(function(d) {
                            return x(d.x);
                        })
                        .y(function(d) {
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

                    var svg = d3.select(rawSvg)
                        .style('width', '100%')
                        .style('height', '100%')
                        .attr('viewBox', '0, 0, ' + largo + ', ' + largo)
                        .attr('preserveAspectRatio', 'xMinYMin')
                        .datum(data)
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    /* 
                     svg.append("path")
                          .attr("class", "area")
                          .attr("d", area);
                     */

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(-5,0)")
                        .call(yAxis);

                    svg.append("path")
                        .attr("class", "line")
                        .attr("d", line);

                    svg.selectAll(".dot")
                        .data(data.filter(function(d) {
                            return Number(d.y);
                        }))
                        .enter()
                        .append("circle")
                        .attr("class", "dot")
                        .attr("cx", line.x())
                        .attr("cy", line.y())
                        .attr("r", 3);

                    svg.selectAll(".text")
                        .data(data.filter(function(d) {
                            return Number(d.y);
                        }))
                        .enter()
                        .append("text")
                        .text(function(d) {
                            //console.log(d);
                            return numberFormat(d.y);
                        })
                        .attr("x", line.x())
                        .attr("y", line.y())
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "12px")
                        .attr("background-color", "white")
                        .attr("transform", "translate(-20,-10)")
                        .attr("fill", "#2E9FA3");
                };
                scope.$watch('chartData', function(newValue, oldValue) {
                    //console.log('chartData');
                    if (newValue && newValue !== '') {
                        //console.log('Build arc3');
                        build();
                    }
                });

            },
            /*compile: function compile(tElement, tAttrs, transclude) {
                tElement.html('<span>hello {{name}}</span>');
                return function postLink(scope, iElement, iAttrs, controller) {
                    scope.name = 'world';
                };
            }*/
        };

    }).directive('imcoBarChart', function($window) {
        return {
            restrict: 'EAC',
            scope: {
                charConfig: '=?',
                chartData: '=',
                barClickFunction: '&?'
            },
            template: '<svg class="bar-chart"></svg>',
            link: function postLink(scope, element, iAttrs, controller) {
                console.log(scope.chartData);
                var svg, x, y, data, xAxis;
                var tip;
                var sortTimeout;
                var d3 = $window.d3;
                var charConfigDefault = {
                    yAxis: {
                        visible: false,
                        text: 'Y',
                        space: 35,

                    },
                    format: 'g',
                    //onclick: function(){}
                };

                if (!scope.charConfig) {
                    scope.config = charConfigDefault;
                } else {
                    scope.config = scope.charConfig;
                }

                console.debug(scope.charConfig);

                if (scope.chartData) {
                    build();
                }

                function build() {

                    var margin = {
                            top: 20,
                            right: 0,
                            bottom: 10,
                            left: 0
                        },
                        width = element.width(),
                        height = element.height() - margin.top - margin.bottom;

                    console.log(width, height);


                    var formatPercent = d3.format(".0%");
                    var formatPercent = d3.format(scope.config.format || charConfigDefault.format);
                    var charConfigDefault = {
                        yAxis: {
                            visible: false,
                            text: 'Frequency',
                            format: '.0%'
                        }
                    };

                    var rawSvg = element.find('svg')[0];
                    //angular.element(rawSvg).html('');
                    x = d3.scale.ordinal()
                        .rangeRoundBands([scope.config.yAxis.space + 10, width], .1, 0);

                    y = d3.scale.linear()
                        .range([height, 0]);

                    xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .tickFormat(formatPercent);


                    svg = d3.select(rawSvg);

                    var minLength = Math.min(element.width(), element.height());
                    if (!minLength || minLength === 0) {
                        minLength = 100;
                    }

                    svg.attr("width", width + margin.left * 2 + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                    tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d) {
                            return d.tooltip;
                        });
                    svg.call(tip);

                    data = scope.chartData;
                    data.forEach(function(d) {
                        d.frequency = +d.frequency;
                    });

                    x.domain(data.map(function(d) {
                        return d.letter;
                    }));

                    y.domain([0, d3.max(data, function(d) {
                        return d.frequency;
                    })]);

                    svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    var a = svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .attr("transform", "translate(" + scope.config.yAxis.space + ",0)");
                    if (scope.config.yAxis.visible) {
                        a.append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text(scope.config.yAxis.text);
                    }

                    svg.selectAll(".bar")
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("class", function(d) {
                            return (d.selected ? "active" : "") + " bar ";
                        })
                        .attr("x", function(d) {
                            return x(d.letter);
                        })
                        .attr("width", x.rangeBand())
                        .attr("y", function(d) {
                            return y(d.frequency);
                        })
                        .attr("height", function(d) {
                            return height - y(d.frequency);
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide)
                        .on('click', function(ele) {
                            console.debug(ele, this, 'queueue');
                            if (scope.barClickFunction) {
                                scope.barClickFunction({
                                    ent: ele.entidad
                                });
                            }
                        });

                    d3.select("input").on("change", change);

                    sortTimeout = setTimeout(function() {
                        d3.select("input").property("checked", true).each(change);
                    }, 2000);
                }

                function change() {
                    clearTimeout(sortTimeout);

                    // Copy-on-write since tweens are evaluated after a delay.
                    var x0 = x.domain(data.sort(this.checked ? function(a, b) {
                                return b.frequency - a.frequency;
                            } : function(a, b) {
                                return d3.ascending(a.letter, b.letter);
                            })
                            .map(function(d) {
                                return d.letter;
                            }))
                        .copy();

                    svg.selectAll(".bar")
                        .sort(function(a, b) {
                            return x0(a.letter) - x0(b.letter);
                        });

                    var transition = svg.transition().duration(750),
                        delay = function(d, i) {
                            return i * 50;
                        };

                    transition.selectAll(".bar")
                        .delay(delay)
                        .attr("x", function(d) {
                            return x0(d.letter);
                        });

                    transition.select(".x.axis")
                        .call(xAxis)
                        .selectAll("g")
                        .delay(delay);
                }

                function update(newValue) {
                    data = newValue;
                    console.debug('update');
                    var x0 = x.domain(data.sort(d3.select("input").property("checked") ? function(a, b) {
                                return b.frequency - a.frequency;
                            } : function(a, b) {
                                return d3.ascending(a.letter, b.letter);
                            })
                            .map(function(d) {
                                return d.letter;
                            }))
                        .copy();

                    svg.selectAll(".bar")
                        .sort(function(a, b) {
                            return x0(a.letter) - x0(b.letter);
                        });
                    svg.selectAll(".bar")
                        .data(data)
                        .classed("active", function(d) {
                            (d.selected) ? console.debug(d.selected, d.letter): '';
                            return d.selected;
                        });


                }
                scope.$watch('chartData', function(newValue, oldValue) {
                    console.debug('chartData');
                    if (newValue && newValue !== '') {
                        update(newValue);
                    }
                });

            },

        };

    })
    .directive('imcoArcChart', [
        '$window',
        function($window) {
            var τ = 2 * Math.PI;
            var linkFunction = function link(scope, element, attrs) {
                if (!scope.value) {
                    scope.value = 50;
                }
                if (!scope.total || scope.total === 0) {
                    scope.total = 100;
                }
                scope.percentage = scope.value / scope.total;
                if (scope.color) {
                    scope.colorfun = function funcionColor() {
                        return String(scope.color).replace('\'', '');
                    };
                } else if (!scope.colorfun) {
                    scope.colorfun = function funcionColor(color) {
                        return 'orange';
                    };
                }

                function arcTween(transition, newAngle) {
                    transition.attrTween('d', function(d) {
                        var interpolate = d3.interpolate(d.endAngle, newAngle);
                        return function(t) {
                            d.endAngle = interpolate(t);
                            return arc(d);
                        };
                    });
                }
                var d3 = $window.d3;
                //Get the svg created on the template
                var rawSvg = element.find('svg')[0];
                //Get the manipulable object
                var svg = d3.select(rawSvg);
                var minLength = Math.min(element.width(), element.height());
                if (!minLength || minLength === 0) {
                    minLength = 100;
                }
                svg.style('width', '100%').style('height', '100%').attr('viewBox', '0, 0, ' + minLength + ', ' + minLength).attr('preserveAspectRatio', 'xMinYMin');
                var arco, resu, textoCentro;
                var frontArc, result, textCentered;
                var breadthPercentage = 0.05;
                var breadth = minLength * breadthPercentage;
                var paddingRadius = Math.ceil(breadth * 0.3);
                // TODO custum
                var radius = minLength / 2 - paddingRadius;
                // var arc = d3.svg.arc()
                //     .innerRadius(radio - amplitud)
                //     .outerRadius(radio)
                //     .startAngle(0);
                var arc = d3.svg.arc().innerRadius(radius - breadth).outerRadius(radius).startAngle(0);
                //Todo, remove
                var drawDout = function build() {
                    svg.select('g').remove();
                    //todo refactor
                    var g = svg.append('g').attr('transform', 'translate(' + minLength / 2 + ',' + minLength / 2 + ')');
                    var backgroundArc = d3.svg.arc().startAngle(0).endAngle(τ).innerRadius(radius + paddingRadius - breadth).outerRadius(radius - paddingRadius);
                    //TOdo
                    var frontArc = d3.svg.arc().startAngle(0).endAngle(τ).innerRadius(radius - breadth).outerRadius(radius);
                    //TOdo
                    //Append bacgroundArc first
                    g.append('path').attr('d', backgroundArc).attr('fill', function() {
                        return '#eee'; // Todo, customize
                    });
                    //Append arc with percentage
                    result = g.append('path').datum({
                        endAngle: 0
                    }).attr('d', frontArc).attr('fill', function() {
                        return scope.colorfun(scope.percentage);
                    });
                    result.transition().duration(2000).call(arcTween, scope.percentage * τ);
                    //Add text
                    if (scope.text) {
                        var fontSize = fontSize = radius / 2;
                        textCentered = g.append('text').text(scope.text).attr('text-anchor', 'middle').attr('dx', 2).attr('style', 'font-size : ' + fontSize + 'px');
                        textCentered.attr('dy', fontSize / 3);
                    }
                };
                drawDout();
                scope.$watch('value', function(newValue, oldValue) {
                    if (newValue) {
                        //console.log('Build arc3');
                        drawDout();
                    }
                });
            };
            return {
                restrict: 'EAC',
                scope: {
                    value: '=?',
                    total: '=',
                    text: '=?',
                    colorfun: '=?',
                    color: '@'
                },
                template: '<svg class="donout-chart-svg"></svg>',
                link: linkFunction
            };
        }
    ]);
