/**
 * Created by jasmo2 on 5/28/16.
 */
function rowSelectAll() {

  return {
    // restrict: 'AC',
    require: '^stTable',
    template: '<input type="checkbox">',
    scope: {
      all: '=rowSelectAll',
      selected: '='
    },
    link: function (scope, element, attr) {

      scope.isAllSelected = false;

      element.bind('click', function (evt) {

        scope.$apply(function () {

          scope.all.forEach(function (val) {

            val.isSelected = scope.isAllSelected;

          });

        });

      });

      scope.$watchCollection('selected', function(newVal) {
        var s = newVal.length;
        var a = scope.all.length;

        if ((s == a) && s > 0 && a > 0) {

          element.find('input')[0].checked =  true
          scope.isAllSelected = false;

        } else {

           element.find('input')[0].checked =  false;
          scope.isAllSelected = true;

        }

      });
    }
  };
}

angular
  .module('intellimining')
  .directive('rowSelectAll', rowSelectAll);