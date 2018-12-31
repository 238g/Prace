BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		// Val
		this.speed=.2;
		this.score=0;
		this.turnCount=1;
		// Obj
		this.Tamaki=this.Nobuhime=this.Docking=this.Delight=this.Splash=
		this.HowToS=this.HUD=this.EndTS=this.ScoreTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.M.SE.playBGM('PlayBGM',{volume:1});

		this.genContents();
		this.M.G.endTut?this.genStart():this.genTut();
		this.test();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			if(getQuery('speed'))this.speed=getQuery('speed');
		}
	},
	update:function(){
		if(this.isPlaying){
			this.Nobuhime.x-=this.speed*this.time.physicsElapsedMS;
			if(this.Nobuhime.x<0)this.Nobuhime.x=this.world.width;
		}
	},
	genContents:function(){
		this.Tamaki=this.add.sprite(this.world.centerX,this.world.height*.75,'tamaki');
		this.Tamaki.anchor.setTo(.5);
		this.Nobuhime=this.add.sprite(this.world.width*.8,this.world.height*.25,'nobuhime');
		this.Nobuhime.anchor.setTo(.5);
		this.Nobuhime.visible=!1;
		this.Docking=this.add.sprite(this.world.centerX,this.Tamaki.y,'docking');
		this.Docking.anchor.setTo(.5);
		this.Docking.visible=!1;
		this.Delight=this.add.sprite(this.world.width*2,this.world.height,'delight');
		this.Delight.anchor.setTo(1);
		this.Splash=this.add.sprite(0,this.world.height,'splash');
		this.Splash.anchor.setTo(.5,1);
		this.Splash.visible=!1;
		var styl=this.M.S.styl(30,'#ff00ff');
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.world.width*.2,this.world.height*.9,this.genScore(),styl);
		this.HUD.add(this.ScoreTS);
		this.HUD.visible=!1;
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*2,this.curWords.End,this.M.S.styl(50,'#ff0000'));
		this.EndTS.visible=!1;
	},
	play:function(){
		this.input.onDown.add(this.stopBar,this);
	},
	stopBar:function(){
		if(this.isPlaying&&this.inputEnabled){
			this.end();
			var addScore=0;
			if(this.Tamaki.left<this.Nobuhime.x&&this.Nobuhime.x<this.Tamaki.right){
				var tw=this.M.T.moveA(this.Nobuhime,{xy:{y:this.Tamaki.y},duration:500,start:!0});
				tw.onComplete.add(this.docking,this);
				addScore=this.Tamaki.width-Math.abs(this.Nobuhime.x-this.Tamaki.x);
				addScore*=addScore;
			}else{
				var tw1=this.M.T.moveB(this.Nobuhime,{xy:{y:this.world.height},duration:200,start:!0});
				tw1.onComplete.add(this.miss,this);
				var tw2=this.M.T.moveB(this.Nobuhime,{xy:{y:this.world.height*1.5},duration:300});
				tw1.chain(tw2);
				tw2.onComplete.add(this.next,this);
				addScore=100;
			}
			addScore*=(this.turnCount*this.turnCount*this.turnCount);

			this.score+=Math.floor(addScore/10);
			this.ScoreTS.chT(this.genScore());
			this.M.SE.play('fall',{volume:1});
		}
	},
	genScore:function(){return formatComma(this.score)+this.curWords.ScoreBack;},
	docking:function(){
		this.Nobuhime.visible=!1;
		this.Tamaki.visible=!1;
		this.Docking.visible=!0;
		var tw1=this.M.T.moveX(this.Delight,{xy:{x:this.world.width},duration:500,delay:500,start:!0,easing:Phaser.Easing.Exponential.Out});
		var tw2=this.M.T.moveB(this.Delight,{xy:{x:this.world.width*2},duration:300,delay:500});
		tw1.chain(tw2);
		tw2.onComplete.add(this.next,this);
		this.time.events.add(500,function(){
			this.M.SE.play('people',{volume:1});
		},this);
	},
	miss:function(){
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		this.M.SE.play('death',{volume:1});
		this.Splash.x=this.Nobuhime.x;
		this.Splash.visible=!0;
		this.Splash.alpha=1;
		this.add.tween(this.Splash).to({alpha:0},800,null,!0);
	},
	next:function(){
		this.time.events.add(500,function(){
			this.speed*=2;
			this.turnCount++;
			if(this.turnCount==6)return this.gameOver();
			this.Nobuhime.visible=!0;
			this.Nobuhime.y=this.world.height*.25;
			this.Nobuhime.x=this.world.randomX;
			this.Tamaki.visible=!0;
			this.Docking.visible=!1;
			this.start();
		},this);
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'twp');
		this.HowToS.tint=0x000000;
		this.HowToS.addChild(this.M.S.txt(this.world.centerX,this.world.centerY,this.curWords.HowTo,this.M.S.styl(30)));
		this.time.events.add(300,function(){
			this.input.onDown.addOnce(function(){
				this.M.G.endTut=!0;
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);
	},
	genStart:function(){
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.Start,this.M.S.styl(50,'#0080FF'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.onComplete.add(function(){
			this.inputEnabled=!0;
			this.start();
		},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.play();
		this.HUD.visible=!0;
		this.Nobuhime.visible=!0;
		this.M.SE.play('start',{volume:1});
	},
	genEnd:function(){
		this.EndTS.visible=!0;
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY},start:!0});
		tw.onComplete.add(this.genRes,this);
		this.M.SE.play('end',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600,start:!0});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			this.HUD.visible=!1;
			this.EndTS.visible=!1;
		},this);

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.3,this.genScore(),this.M.S.styl(40,'#ff00ff')));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		s.addChild(this.M.S.lbl(lX,this.world.height*.6,this.again,this.curWords.Again,this.M.S.styl(25,'#00fa9a'),0x00fa9a));
		s.addChild(this.M.S.lbl(rX,this.world.height*.6,this.tweet,this.curWords.TwBtn,this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(lX,this.world.height*.75,this.back,this.curWords.Back,this.M.S.styl(25,'#8a2be2'),0x8a2be2));
		s.addChild(this.M.S.lbl(rX,this.world.height*.75,this.othergames,this.curWords.OtherGames,this.M.S.styl(25,'#ffa500'),0xffa500));
		s.addChild(this.M.S.lbl(lX,this.world.height*.9,this.tw,'Twitter',this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(rX,this.world.height*.9,this.yt,'YouTube',this.M.S.styl(25,'#ff0000'),0xff0000));
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			this.M.G.playCount++;
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='🐶💙🍡🍡💙🐶';
			var res=this.genScore()+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('othergames','Play','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
};