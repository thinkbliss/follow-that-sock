"use strict"


var MODAL_ID = "#scrapbookModal";
var JSON_URL = "bin/json/gallery.json"
var photos;
var gallery = {
	
	modal:undefined,
	closeButton:undefined,
	currentIndex:undefined,
	nextIndex:undefined,
	currentPageIndex:-1,
	nextPageIndex:undefined,
	loadJSON:function(){
		console.log("load json",$.getJSON);
		$.getJSON( "bin/json/gallery.json", function(data){
			photos = data;
			gallery.init();
		});
	},

	init:function(){
	
		gallery.modal = $(MODAL_ID);
		gallery.closeButton = gallery.modal.find('.close');
		gallery.modal.fadeOut(0);

		gallery.cauroselPage(1);

		$('.pic a').click(function(e){
			gallery.showImage(e.currentTarget);
			return false;
		});
		gallery.closeButton.click(function(e){
			gallery.hide();	
			return false;
		});

		gallery.modal.find('.arrow').click(function(e){
			gallery.cauroselContent($(e.currentTarget).hasClass('next')?1:-1);
			return false;
		})
	

		var pages = Math.ceil(photos.length / 4);
		console.log('pages',pages);
		if(pages > 1){

			$('#gallery-prev-arrow').click(function(e){
				gallery.cauroselPage(-1);
				return false;
			})
			.css('display','block');
			
			$('#gallery-next-arrow').click(function(e){
				gallery.cauroselPage(1);
				return false;
			})
			.css('display','block');
		}

		//gallery.modal.find('img')
		var modalHammer = new Hammer(gallery.modal.find('img')[0]);
		modalHammer
		.on('swipeleft', function(ev) {
			gallery.cauroselContent(-1)
		})
		.on('swiperight', function(ev) {
			gallery.cauroselContent(1)
		});

		var modalHammer = new Hammer( $('#scrapbookPanel')[0] );
		modalHammer
		.on('swipeleft', function(ev) {
			gallery.cauroselPage(-1)
		})
		.on('swiperight', function(ev) {
			gallery.cauroselPage(1)
		});

	},

	showImage:function(el){
		gallery.currentIndex = Number($(el).attr('data-index'));

		console.log(el);
		var obj = photos[gallery.currentIndex];

		gallery.modal.find('img').attr('src',obj.imgPath);
		gallery.modal.find('p.copy').text(obj.caption);

		// gallery.modal.find('.modal-scapbook').css('top','-100%');
		// gallery.modal.find('.modal-scapbook').delay(200).animate({
		// 	top:'50%'
		// },100);
		gallery.modal.fadeIn(500);
	},
	cauroselPage:function(way){
		var pages = Math.ceil(photos.length / 4);
		gallery.nextPageIndex = Number(gallery.currentPageIndex) + way;
		gallery.nextPageIndex = (gallery.nextPageIndex < 0 )?pages-1:gallery.nextPageIndex;
		gallery.nextPageIndex = (gallery.nextPageIndex >= pages )?0:gallery.nextPageIndex;

		console.log('gallery.nextPageIndex',gallery.nextPageIndex);

		var prefix = "#gallery-img"
		for(var i=0; i < 4; i++){
			var index = (gallery.nextPageIndex * 4) + i;
			var $obj = $(prefix + (i+1))
			$obj.attr('data-index',index);
			var path = (photos[index] && photos[index].imgPath != null)?photos[index].imgPath:'img/vacation_pics/spacer.jpg';
			$obj.find('img').attr('src',path);
		}

		gallery.currentPageIndex =gallery.nextPageIndex;
	},




	cauroselContent:function(way){
		gallery.nextIndex = Number(gallery.currentIndex) + way;
		gallery.nextIndex = (gallery.nextIndex < 0 )?photos.length-1:gallery.nextIndex;
		gallery.nextIndex = (gallery.nextIndex >= photos.length )?0:gallery.nextIndex;

		gallery.modal.find('.image-scapbook').fadeOut(100,function(){
			var obj = photos[gallery.nextIndex];
			console.log('obj',obj);
			gallery.modal.find('img').attr('src',obj.imgPath);
			gallery.modal.find('p.copy').text(obj.caption);
 			gallery.currentIndex = gallery.nextIndex;
			
		});
		gallery.modal.find('.image-scapbook').delay(300).fadeIn(100);

	},

	hide:function(){
		gallery.modal.fadeOut(100);
	}

}
window.gallery = gallery;

module.exports = gallery;






