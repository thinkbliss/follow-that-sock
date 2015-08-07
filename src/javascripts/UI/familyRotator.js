"use strict"

//- Constants --
var CANVAS_ID = 'characters';
//--------------

var familyrotator = {
	//- member variables --
	stage:undefined,
	fContainer: undefined,
	frontPanel: undefined,
	backpanel: undefined,
	family:[
		
		{
			name: "Sylvia",
			bio: "She’s the daughter with tons o’ ’tude and permanent earbuds. Because selective hearing is totally in this season.",
			src:'img/bio-sylvia.png',
			bmp:undefined
		},
		{
			name: "Stan",
			bio: "He’s the Dad with a good sole, tons of arch support, and well-groomed facial hair to boot.",
			src:'img/bio-stan.png',
			bmp:undefined
		},
		{
			name: "Cousin Edwin",
			bio: "The lovable little cousin visiting his Aunt, Uncle and cousins, who also just might’ve been the one who gave socks the reputation for getting lost.",
			src:'img/bio-irwin.png',
			bmp:undefined
		},
		{
			name: "Sophie",
			bio: "She’s the Mom, who is caring, nurturing, and known in fashion circles for inventing the wristwatch belt!",
			src:'img/bio-sophie.png',
			bmp:undefined
		},
		{
			name: "Sid",
			bio: "He’s the son, an All-American little sock dude with the surfer haircut, even though he hasn’t ever seen a real ocean yet.",
			src:'img/bio-sid.png',
			bmp:undefined
		}
		

		
	],
	positions:[
		{ 	x:190, 	y:350, 	r:-22, 	z:0, 	s:0.6 	},
		{ 	x:250, 	y:290, 	r:-12, 	z:0, 	s:0.6 	},
		{ 	x:350, 	y:450, 	r:0, 	z:2, 	s:1 	},
		{ 	x:450, 	y:320, 	r:22, 	z:0, 	s:0.6 	},
		{ 	x:510, 	y:370, 	r:30, 	z:0, 	s:0.6 	}
	],
	animating: false,
	currentIndex: 2,
	nextIndex:2,

	//---------------------
	init: function(){
		console.log('Family Rotator Initilization',this);
		createjs.Ticker.addEventListener("tick", function(){ familyrotator.update(); });
		this.stage = new createjs.Stage(CANVAS_ID);
		this.stage.width = 680;
		this.stage.height = 600;

		this.fContainer = new createjs.Container();
		this.stage.addChild(this.fContainer);
		this.stage.enableMouseOver( 10 );

		
		
		var img = new Image();
			img.onload = function(){
				familyrotator.backpanel = new createjs.Bitmap(img);
				familyrotator.backpanel.x = (familyrotator.stage.width - img.width) /2;
				familyrotator.backpanel.y = (familyrotator.stage.height - img.height) /2;
				familyrotator.fContainer.addChild(familyrotator.backpanel);
				var img2 = new Image();
					img2.onload = function(){
						familyrotator.frontPanel = new createjs.Bitmap(img2);
						familyrotator.frontPanel.x = (familyrotator.stage.width - img2.width) /2;
						familyrotator.frontPanel.y = 331;
						familyrotator.fContainer.addChild(familyrotator.frontPanel);
						
						familyrotator.zPosition();
						familyrotator.update();
						
					}
					img2.src = "img/bio-foreground.png";
			}
			img.src = "img/bio-background.png";

		this.loadMembers();
	},
	
	loadMembers: function(){
		for(var i=0; i < this.family.length; ++i){
			var member = this.family[i];
				member.index = i;
				member.bmp = new createjs.Bitmap(member.src);
				member.bmp.index = i;
				member.bmp.posIndex = i;
				member.bmp.x = familyrotator.positions[i].x;
				member.bmp.y = familyrotator.positions[i].y;
				member.bmp.scaleX = 
				member.bmp.scaleY = familyrotator.positions[i].s;
				member.bmp.rotation = familyrotator.positions[i].r;
				member.bmp.regY = 560;
				member.bmp.regX = 129;
				member.bmp.addEventListener("click",function(e){
					familyrotator.showMember(e.currentTarget.index);
				});
				member.bmp.cursor = 'pointer';
				
				familyrotator.fContainer.addChild(member.bmp);
		}
		// familyrotator.zPosition();
	},
	zPosition:function(){
		for(var i=0; i < this.family.length; ++i){
			this.fContainer.setChildIndex(this.family[i].bmp,this.positions[this.family[i].bmp.posIndex].z);
		}
		if(this.backpanel != undefined){
			this.fContainer.setChildIndex(this.backpanel,4);
			if(this.frontPanel != undefined){
				this.fContainer.setChildIndex(this.frontPanel,20);
			}
		}
	},
	getMemberAngle: function(memberIndex){
		return (Math.PI / 180) * (this.family[memberIndex].bmp.rotation - 90);
	},
	showMember: function(memberIndex){
		if(this.animating || this.nextIndex == memberIndex) return false;

		this.animating = true;
		console.log('show member', this.family[memberIndex]);
		this.nextIndex = memberIndex;
		var nextAngle = this.getMemberAngle(this.nextIndex);
		var curAngle = this.getMemberAngle(this.currentIndex);
		var nextbmp = this.family[this.nextIndex].bmp;
		var curbmp = this.family[this.currentIndex].bmp;
		
		var nextPos = this.positions[2];
		var prevPos = this.positions[nextbmp.posIndex];

		console.log('nextbmp.posIndex',nextbmp.posIndex);
		console.log('curbmp.posIndex',curbmp.posIndex);
		createjs.Tween.get(nextbmp)
			.to({
				x:nextbmp.x - (230 * Math.cos(nextAngle)),
				y:nextbmp.y - (230 * Math.sin(nextAngle))
			},200,createjs.Ease.getPowInOut(5))
			.to({
				rotation:nextPos.r,
				scaleX:.001,
				scaleY:.001
			},100,createjs.Ease.getPowIn(5))
			.to({
				x:nextPos.x,
				y:nextPos.y,
				scaleX:nextPos.s,
				scaleY:nextPos.s
			},250,createjs.Ease.getBackOut(1));
		setTimeout(function(){
			console.log('swap children');
			familyrotator.fContainer.swapChildren(nextbmp,curbmp);
			var cpi = nextbmp.posIndex;
			nextbmp.posIndex = 2;
			curbmp.posIndex = cpi;
			familyrotator.currentIndex = familyrotator.nextIndex;

			$('#character-text').html ( "<h1>" + familyrotator.family[familyrotator.nextIndex].name + "</h1> <p>" + familyrotator.family[familyrotator.nextIndex].bio + "</p>" );

		},250);

		createjs.Tween.get(curbmp)
			.to({
				x:curbmp.x - (100 * Math.cos(curAngle)),
				y:curbmp.y - (100 * Math.sin(curAngle)),
				scaleX:.4,
				scaleY:.4
			},500,createjs.Ease.getPowInOut(4))
			.wait(200)
			.to({
				x:prevPos.x,
				y:prevPos.y,
				rotation:prevPos.r,
				scaleX:prevPos.s,
				scaleY:prevPos.s
			},200,createjs.Ease.getBackOut(1))
			.call(function(){
				familyrotator.animating = false;
			});
	},
	update: function(force){
		// this.zPosition();
		this.stage.update();
		// remember to turn this off when no animations are happening.
	}
};


// EXPORT --------------------------------------------
module.exports = familyrotator;
// ---------------------------------------------------


