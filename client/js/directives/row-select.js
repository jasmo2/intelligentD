/**
 * Created by jasmo2 on 5/28/16.
 */
function rowSelect() {
    return {
        require: '^stTable',
        template: '<input type="checkbox">',
        scope: {
            row: '=rowSelect'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind('click', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');

                });
            });

            scope.$watch('row.isSelected', function (newValue) {
                if (newValue === true /*|| scope.row.is_checked*/) {
                    element.parent().addClass('st-selected');
                    element.find('input')[0].checked =  true;

                } else {
                    element.parent().removeClass('st-selected');
                    element.find('input')[0].checked =  false;
                }
            });
        }
    };
}

angular
    .module('intellimining')
    .directive('rowSelect', rowSelect)