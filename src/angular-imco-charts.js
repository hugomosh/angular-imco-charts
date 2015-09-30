'use strict';

angular.module('d3', [])
    .factory('d3Service', ['$document', '$q', '$rootScope',
        function($document, $q, $rootScope) {
            var d = $q.defer();

            function onScriptLoad() {
                // Load client in the browser
                $rootScope.$apply(function() {
                    d.resolve(window.d3);
                });
            }
            // Create a script tag with d3 as the source
            // and call our onScriptLoad callback when it
            // has been loaded
            var scriptTag = $document[0].createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.async = true;
            scriptTag.src = 'bower_components/d3/d3.min.js';
            scriptTag.src = 'http://d3js.org/d3.v3.min.js';
            scriptTag.onreadystatechange = function() {
                if (this.readyState == 'complete') onScriptLoad();
            }
            scriptTag.onload = onScriptLoad;

            var s = $document[0].getElementsByTagName('body')[0];
            s.appendChild(scriptTag);

            return {
                d3: function() {
                    return d.promise;
                }
            };
        }
    ]);

angular.module('imco.charts.bars', ['d3'])
    .directive('imcoBarsHor', ['d3Service', function(d3Service) {
        // b
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                chartData: '=',
                sortData: '=?'
            }, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function(scope, ele, attrs, controller) {
                d3Service.d3().then(function(d3) {

                    var margin = parseInt(attrs.margin) || 20,
                        barHeight = parseInt(attrs.barHeight) || 20,
                        barPadding = parseInt(attrs.barPadding) || 5;

                    var svg = d3.select(ele[0])
                        .append('svg')
                        .style('width', '100%');

                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();
                    };


                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.chartData);
                    });
                    scope.$watch('sortData', function(newValue, oldValue) {

                        console.debug('Sort values', newValue);
                        scope.chartData.sort(newValue ? function(a, b) {
                            return b.val - a.val;
                        } : function(a, b) {
                            return d3.ascending(a.label, b.label);
                        });
                        scope.render(scope.chartData);

                    });

                    scope.render = function(data) {
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        // setup variables
                        var width = d3.select(ele[0]).node().offsetWidth - margin,
                            // calculate the height
                            height = data.length * (barHeight + barPadding),
                            // Use the category20() scale function for multicolor support
                            color = d3.scale.category20(),
                            // our xScale
                            xScale = d3.scale.linear()
                            .domain([0, d3.max(data, function(d) {
                                return d.val;
                            })])
                            .range([0, width]);

                        // set the height based on the calculations above
                        svg.attr('height', height);

                        //create the rectangles for the bar chart
                        svg.selectAll('rect')
                            .data(data).enter()
                            .append('rect')
                            .attr('height', barHeight)
                            .attr('width', 140)
                            .attr('x', Math.round(margin / 2))
                            .attr('y', function(d, i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr('fill', function(d) {
                                return color(d.val);
                            })
                            .transition()
                            .duration(1000)
                            .attr('width', function(d) {
                                return xScale(d.val);
                            });

                        svg.selectAll("text")
                            .data(data)
                            .enter()
                            .append("text")
                            .attr("fill", "#fff")
                            .attr("y", function(d, i) {
                                return i * (barHeight + barPadding) + 12;
                            })
                            .attr("x", 15)
                            .text(function(d) {
                                return d.label;
                            });

                    };

                })
            }
        };
    }])
    .directive('imcoBars', ['d3Service', function(d3Service) {
        // b
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                chartData: '=',
                sortData: '=?'
            }, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function(scope, ele, attrs, controller) {
                d3Service.d3().then(function(d3) {

                    var margin = parseInt(attrs.margin) || 20,
                        chartHeight = parseInt(attrs.chartHeight) || 300,
                        barPadding = parseInt(attrs.barPadding) || 5;

                    var svg = d3.select(ele[0])
                        .append('svg')
                        .style('width', '100%');

                    // Browser onresize event
                    window.onresize = function() {
                        scope.$apply();

                    };


                    // Watch for resize event
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.chartData);
                    });

                    scope.$watch('sortData', function(newValue, oldValue) {
                        console.debug('Sort values', newValue);
                        scope.chartData.sort(newValue ? function(a, b) {
                            return b.val - a.val;
                        } : function(a, b) {
                            return d3.ascending(a.label, b.label);
                        });
                        scope.render(scope.chartData);

                    });

                    scope.render = function(data) {
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        // setup variables
                        var width = d3.select(ele[0]).node().offsetWidth - margin,
                            // calculate the height
                            height = chartHeight,
                            // Use the category20() scale function for multicolor support
                            color = d3.scale.category20(),
                            // our xScale
                            yScale = d3.scale.linear()
                            .domain([0, d3.max(data, function(d) {
                                return d.val;
                            })])
                            .range([10, height]),
                            x = d3.scale.ordinal()
                            .rangeRoundBands([0, width], 0.1, 1),
                            xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom"),
                            barWidth = (width / data.length) - barPadding;

                        x.domain(data.map(function(d) {
                            return d.label;
                        }));
                        // set the height based on the calculations above
                        svg.attr('height', height + 100);

                        //create the rectangles for the bar chart
                        svg.selectAll('rect')
                            .data(data).enter()
                            .append('rect')
                            .attr('height', 0)
                            .attr('width', x.rangeBand())
                            .attr('y', function(d, i) {
                                return chartHeight;
                            })
                            .attr('x', function(d, i) {
                                return x(d.label);
                                //return i * (barWidth + barPadding);
                            })
                            .attr('fill', function(d) {
                                return color(d.val);
                            })
                            .transition()
                            .duration(1000)
                            .attr('height', function(d) {
                                return yScale(d.val);
                            })
                            .attr('y', function(d, i) {
                                return chartHeight - yScale(d.val);
                            });


                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + chartHeight + ")")
                            .call(xAxis)
                            .selectAll("text")
                            .style("text-anchor", "end")
                            .attr("dx", "-.8em")
                            .attr("dy", ".15em")
                            .attr("transform", function(d) {
                                return "rotate(-65)"
                            });

                        /* svg.append("g")
                             .attr("transform", function(d) {
                                 return "rotate(-88)"
                             })
                         svg.selectAll("text")
                             .data(data)
                             .enter()
                             .append("text")
                             .attr("fill", "#000")
                             .attr("transform", function(d) {
                                 return "rotate(-88)"
                             })
                             .attr("dy", function(d, i) {
                                 return i * (barWidth + barPadding) + 15;
                             })
                             .attr("dx", function(d, i) {
                                 return -chartHeight - 100;
                             })
                             .text(function(d) {
                                 return d.label;
                             });*/

                    };

                })
            }
        };
    }]);

angular.module('imco.charts', ['imco.charts.bars'])
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
                        scope.config = defaultConfig;
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
                            return Number(d.y) !== null;
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
    })
    .directive('imcoBarChart', function($window) {
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

                function build() {

                    var margin = {
                            top: 20,
                            right: 0,
                            bottom: 10,
                            left: 0
                        },
                        width = element.width(),
                        height = element.height() - margin.top - margin.bottom;

                    //console.log(width, height);


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
                            //console.debug(ele, this, 'queueue');
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


                if (!scope.charConfig) {
                    scope.config = charConfigDefault;
                } else {
                    scope.config = scope.charConfig;
                }

                //console.debug(scope.charConfig);

                if (scope.chartData) {
                    build();
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
                    //console.debug('update');
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
                            //(d.selected) ? console.debug(d.selected, d.letter): '';
                            return d.selected;
                        });


                }
                scope.$watch('chartData', function(newValue, oldValue) {
                    //console.debug('chartData');
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
