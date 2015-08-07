var modal = function(el, expandX, expandY){

    //define a scope variable to deal with javascripts stupid scope failures.
    //-----------------------------------------------------------------------
    var $scope = this;

    $scope.el = el;

    $scope.show = function(timing,callback){
        //make this an animation.
        timing = timing || 0;
        $scope.el.show(timing);
    }
    $scope.hide = function(timing,callback){
        //make this an animation.
        timing = timing || 0;
        $scope.el.hide(timing);
        console.log($scope.el.css,'hide called');
    }


}
module.exports = modal;
