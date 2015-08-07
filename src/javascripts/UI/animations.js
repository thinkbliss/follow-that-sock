var Animations = function(event) {
	var offset = $(window).scrollTop() + $(window).height(),
	$animatables = $('.animatable');
	$animatables.each(function(i) {
		var $animatable = $(this);
		if (($animatable.offset().top + $animatable.height() - 20) < offset) {
			$animatable.addClass('animate');
		}else{
			$animatable.removeClass('animate');
		}
	});
};


module.exports = Animations;
