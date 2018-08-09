// REVEAL ANIMATE

var Reveal = function () {
	var revealAnimate = function() {

		var _init = function() {

			wow = new WOW(
			{
				animateClass: 'animated',
				offset:100,
				live: true,
				mobile: false,
			});
		}

		return {
			//main function to initiate the module
			init: function() {

				_init();

			}
		};
	}();

	return {
		//main function to initiate the module
		init: function() {
			revealAnimate.init();
			new WOW().init();
			setTimeout(
				function() {
					$('.wow').css('opacity', '1');
				}, 500
			);
		}
	};
}();
