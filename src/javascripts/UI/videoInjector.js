
var VIDEO_URL = 'https://www.youtube.com/watch?v=uF2i19XgWtc';


var videoInjector = {
	videoTag:undefined,
	maskObj:undefined,
	player:undefined,
	playButton:$('<div>').attr('id','video-play-button'),
	init:function(maskId){
		console.log("init");
		videoInjector.maskObj = $(maskId);
		videoInjector.videoTag = $('#main-iframe')
		$(window).on('resize',function(){
			videoInjector.resize();
		})

		videoInjector.videoTag.parent().before(videoInjector.playButton);

		videoInjector.resize();


	},
	startAPI:function(){
		
		videoInjector.player = new YT.Player(videoInjector.videoTag[0],{});
		console.log("startAPI",videoInjector.player);
		videoInjector.playButton.click(function(e){
			videoInjector.player.playVideo();
			videoInjector.resize();
			return false;
		});
		videoInjector.playButton.on("touchstart",function(e){
			videoInjector.player.playVideo();
			videoInjector.resize();
			return false;
		});

	},
	resize:function(){
		if(videoInjector.player == undefined || videoInjector.player.getPlayerState == undefined) return false;

		if(videoInjector.player.getPlayerState() == 1){
			videoInjector.playButton.css('display','none');
		}else{
			videoInjector.playButton.css('display','block');
		}
		videoInjector.videoTag.css({
			width: 		(videoInjector.maskObj.width()) + 'px',
			height: 	(videoInjector.maskObj.height()) + 'px'
			// top: 		videoInjector.maskObj.position().top,
			// left: 		videoInjector.maskObj.position().left,
		});
	}
}

module.exports = videoInjector;