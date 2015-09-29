angular.module('imco.charts.bars', ['d3'])
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
                        scope.$apply();


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
                                return i * (barHeight + barPadding) + 15;
                            })
                            .attr("x", 15)
                            .text(function(d) {
                                return d.label;
                            });

                    };

                })
            }
        };
    }]);
