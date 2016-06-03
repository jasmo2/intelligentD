/**
 * Created by jasmo2 on 6/3/16.
 */
angular.module("intellimining")
    .directive('confusionMatrix', function () {
        var confutionMatrix = {
            restrict: 'E',
            //this is important,
            //we don't want to overwrite our directive declaration
            //in the HTML mark-up
            replace: false,
            scope: {
                matrix: '=data',
                labels: "=labels"
            },
            link: function (scope, element, attrs) {
                //in D3, any selection[0] contains the group
                //selection[0][0] is the DOM node
                //but we won't need that this time
                console.log("confusion matrix directive ");
                var matrix = d3.select(element[0]);
                //to our original directive markup bars-chart
                //we add a div with out chart stling and bind each
                //data entry to the chart

                // var width = matrix.width,
                // height = matrix.height,
                // gridWidth = 850,
                // gridHeight = 850; //whether cell is square or not
                //a little of magic: setting it's width based
                //on the data value (d)
                //and text all with a smooth transition
            }
        };
        return confutionMatrix
    });