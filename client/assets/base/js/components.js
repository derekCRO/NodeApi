/**
 Core layout handlers and component wrappers
 **/

var Component = function () {
	// BEGIN: Layout Brand
	var LayoutBrand = function () {

		return {
			//main function to initiate the module
			init: function () {
				$('body').on('click', '.c-hor-nav-toggler', function () {
					var target = $(this).data('target');
					$(target).toggleClass("c-shown");
				});
			}

		};
	}();
	// END

	// BEGIN: Layout Header
	var LayoutHeader = function () {
		var offset = parseInt($('.c-layout-header').attr('data-minimize-offset') > 0 ? parseInt($('.c-layout-header').attr('data-minimize-offset')) : 0);
		var _handleHeaderOnScroll = function () {
			if ($(window).scrollTop() > offset) {
				$("body").addClass("c-page-on-scroll");
			} else {
				$("body").removeClass("c-page-on-scroll");
			}
		}

		var _handleTopbarCollapse = function () {
			$('.c-layout-header .c-topbar-toggler').on('click', function (e) {
				$('.c-layout-header-topbar-collapse').toggleClass("c-topbar-expanded");
			});
		}

		return {
			//main function to initiate the module
			init: function () {
				if ($('body').hasClass('c-layout-header-fixed-non-minimized')) {
					return;
				}

				_handleHeaderOnScroll();
				_handleTopbarCollapse();

				$(window).scroll(function () {
					_handleHeaderOnScroll();
				});
			}
		};
	}();
	// END

	// BEGIN: Layout Go To Top
	var LayoutGo2Top = function () {

		var handle = function () {
			var currentWindowPosition = $(window).scrollTop(); // current vertical position
			if (currentWindowPosition > 300) {
				$(".c-layout-go2top").show();
			} else {
				$(".c-layout-go2top").hide();
			}
		};

		return {

			//main function to initiate the module
			init: function () {

				handle(); // call headerFix() when the page was loaded

				if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
					$(window).bind("touchend touchcancel touchleave", function (e) {
						handle();
					});
				} else {
					$(window).scroll(function () {
						handle();
					});
				}

				$(".c-layout-go2top").on('click', function (e) {
					e.preventDefault();
					$("html, body").animate({
						scrollTop: 0
					}, 600);
				});
			}

		};
	}();
	// END: Layout Go To Top

	// BEGIN : SCROLL TO VIEW DETECTION
	function isScrolledIntoView(elem)
	{
	    var $elem = $(elem);
	    var $window = $(window);

	    var docViewTop = $window.scrollTop();
	    var docViewBottom = docViewTop + $window.height();

	    var elemTop = $elem.offset().top;
	    var elemBottom = elemTop + $elem.height();

	    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}
	// END : SCROLL TO VIEW FUNCTION

	// BEGIN: OwlCarousel
	var ContentOwlcarousel = function () {

		var _initInstances = function () {
			$("[data-slider='owl'] .owl-carousel").each(function () {

				var parent = $(this);

				var items;
				var itemsDesktop;
				var itemsDesktopSmall;
				var itemsTablet;
				var itemsTabletSmall;
				var itemsMobile;

				var rtl_mode = (parent.data('rtl')) ? parent.data('rtl') : false ; 
				var items_loop = (parent.data('loop')) ? parent.data('loop') : true ; 
				var items_nav_dots = (parent.data('navigation-dots')) ? parent.data('navigation-dots') : true ; 
				var items_nav_label = (parent.data('navigation-label')) ? parent.data('navigation-label') : false ; 

				if (parent.data("single-item") == true) {
					items = 1;
					itemsDesktop = 1;
					itemsDesktopSmall = 1;
					itemsTablet = 1;
					itemsTabletSmall = 1;
					itemsMobile = 1;
				} else {
					items = parent.data('items');
					itemsDesktop = parent.data('desktop-items') ? parent.data('desktop-items') : items;
					itemsDesktopSmall = parent.data('desktop-small-items') ? parent.data('desktop-small-items') : 3;
					itemsTablet = parent.data('tablet-items') ? parent.data('tablet-items') : 2;
					itemsMobile = parent.data('mobile-items') ? parent.data('mobile-items') : 1;
				}

				$(this).owlCarousel({

					rtl: rtl_mode,
					loop: items_loop,
					items: items,
					responsive: {
						0:{
							items: itemsMobile
						},
						480:{
							items: itemsMobile
						},
						768:{
							items: itemsTablet
						},
						980:{
							items: itemsDesktopSmall
						},
						1200:{
							items: itemsDesktop
						}
					},

					dots: items_nav_dots,
					nav: items_nav_label,
					navText: false,
					autoplay: (parent.data("auto-play")) ? parent.data("auto-play") : true,
					autoplayTimeout: parent.data('slide-speed'),
					autoplayHoverPause: (parent.data('auto-play-hover-pause')) ? parent.data('auto-play-hover-pause') : false,
					dotsSpeed: parent.data('slide-speed'),				
				});
			});
		};

		return {

			//main function to initiate the module
			init: function () {

				_initInstances();
			}

		};
	}();
	// END: OwlCarousel

	return {

		//main function to initiate the module
		init: function () {

			LayoutBrand.init();
			LayoutHeader.init();
			LayoutGo2Top.init();
			ContentOwlcarousel.init();
		}
	};
}();
