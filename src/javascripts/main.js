'use strict';


/*  ------------------------------------------------------------
  Since we'll no longer be using an explicit framework. 
  Please make sure all code is contained in the jquery 
  document ready function below
---------------------------------------------------------------- */

//var UIModal = require('./UI/modal');
var SimpleSprite 		= require('./UI/simpleSprite',{expose: 'SimpleSprite'});
	
var animations 			= require('./UI/animations',['./UI/simpleSprite']),
	familyRotator		= require('./UI/familyRotator'),
    formModals          = require('./UI/formModals'),
	simpleValidation	= require('./forms/simpleValidation'),
    videoInjector        = require('./UI/videoInjector'),
    gallery             = require('./UI/gallery');


var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


window.onYouTubeIframeAPIReady = function() {
    videoInjector.startAPI();
}
$(function() {

	//-- Family Rotator Setup
	familyRotator.init();
    gallery.loadJSON();
    videoInjector.init('#main-video');
    setInterval(videoInjector.resize,1000);
    
	//-- Scrolling Animations Events 
	$(window).on('scroll', animations);
	$(window).trigger('scroll');
	
	
	//-- Form Validation
	simpleValidation();
	$('a.registerSubmit, a.signinSubmit').on('click', function() {
		$('.signedOut').fadeOut(100);
		$('.dashboard').fadeIn(100);
        $('body').removeClass('overlay-view');
        return false;
	});

   //-- Dashboard Container Flip setup
    $('.dashSMS').on('click', function(){
        $('#dashMMS').delay(150).fadeIn(100);
        $('.dashboard').fadeOut(100);
        $('.flip-container').addClass('flip');
        event.preventDefault(); 
    });
    $('.dashHanesCode').on('click', function(){
        $('#poNumber').delay(150).fadeIn(100);
        $('.dashboard').fadeOut(100);
        $('.flip-container').addClass('flip');
        event.preventDefault(); 
    });
    $('.dashEmail').on('click', function(){
        $('#emailShare').delay(150).fadeIn(100);
        $('.dashboard').fadeOut(100);
        $('.flip-container').addClass('flip');
        event.preventDefault(); 

    });   
    $('.backToDash').on('click', function(){
        $('.dashForms').fadeOut(100);
        $('.dashboard').delay(150).fadeIn(100);
        $('.flip-container').removeClass('flip');
        event.preventDefault(); 
    });   


    $('.mobileNav').on('click', function() {
        $(this).toggleClass('menu');
    });

});










