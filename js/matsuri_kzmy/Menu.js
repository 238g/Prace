BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.isPlaying=this.inputEnabled=!1;
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.genBg();

		var title=this.add.sprite(this.world.centerX,this.world.height*.4,'title');
		title.anchor.setTo(.5);
		this.M.T.beatA(title,{duration:1200,start:!0});

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.width*.73,this.world.height*.85,this.start,this.curWords.Start,styl,0x00ff00);
		this.M.S.lbl(this.world.width*.27,this.world.height*.85,this.credit,'Credit',styl,0xffd700);

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genBg:function(){
		this.add.sprite(0,0,'bg_1');
		var odanobu=this.add.sprite(this.world.width*.53,this.world.height*.2,'odanobu_1');
		var tw=this.M.T.moveA(odanobu,{xy:{x:'-'+50},duration:3E3,start:!0});
		tw.repeat(-1);
		tw.yoyo(!0);
		this.add.sprite(0,0,'bg_2');
		this.Tamaki=this.add.sprite(this.world.width*.2,this.world.height*.7,'tamaki_1');
		this.Tamaki.anchor.setTo(.5);
		this.Matsuri=this.add.sprite(this.world.width*.8,this.world.height*.7,'matsuri_1');
		this.Matsuri.anchor.setTo(.5);
		this.Ball=this.add.sprite(this.world.width*.3,this.world.height*.5,'ball_'+this.rnd.between(1,2));
		this.Ball.firstx=this.Ball.x;
		this.Ball.firsty=this.Ball.y;
		this.Ball.anchor.setTo(.5);

		this.rstx=this.world.width*.57;
		this.rsty=this.world.height*.52;
		this.rx=this.world.width*.18;
		this.ry=this.world.height*.15;
		this.rcx=this.rstx+this.rx/2;
		this.rcy=this.rsty+this.ry/2;
		this.time.events.add(500,this.nmeHit,this);
	},
	nmeHit:function(){
		this.M.T.moveB(this.Ball,{xy:{x:this.rcx},duration:1600,start:!0});
		this.mvTw1=this.M.T.moveX(this.Ball,{xy:{y:'-'+this.world.height*.2},start:!0,duration:800,easing:Phaser.Easing.Cubic.Out});
		this.mvTw2=this.M.T.moveX(this.Ball,{xy:{y:this.rcy},duration:800,easing:Phaser.Easing.Sinusoidal.In});
		this.mvTw1.chain(this.mvTw2);
		this.mvTw2.onComplete.add(this.playerHit,this);
		this.charJump(this.Tamaki);
	},
	playerHit:function(){
		this.M.T.moveB(this.Ball,{xy:{x:this.Ball.firstx},duration:1600,start:!0});
		this.mvTw1=this.M.T.moveX(this.Ball,{xy:{y:'-'+this.world.height*.2},start:!0,duration:800,easing:Phaser.Easing.Cubic.Out});
		this.mvTw2=this.M.T.moveX(this.Ball,{xy:{y:this.Ball.firsty},duration:800,easing:Phaser.Easing.Sinusoidal.In});
		this.mvTw1.chain(this.mvTw2);
		this.mvTw2.onComplete.add(this.nmeHit,this);
		this.charJump(this.Matsuri);
	},
	charJump:function(char){this.M.T.moveB(char,{xy:{y:'-'+this.world.height*.05},start:!0,duration:150}).yoyo(!0);},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.G.playCount++;
				this.M.SE.play('OnBtn',{volume:1});
				var wp=this.add.sprite(0,0,'wp');
				wp.width=this.world.width;
				wp.height=this.world.height;
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
				this.Tween.start();
				myGa('start','Title','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	credit:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=__VTUBER_GAMES+'?page=credit';
		if(this.curLang=='en')url+='&lang=en';
		window.open(url,'_blank');
		myGa('external_link','Title','Credit',this.M.G.playCount);
	},
	genHUD:function(){
		var y=this.world.height*.1;
		this.M.S.vol(this.world.width*.1,y,0xff00ff);
		this.M.S.flsc(this.world.width*.9,y,0xff00ff);
	},
};
