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
		this.speed=.3;
		this.score=0;
		this.turnCount=1;
		// Obj
		this.BgS=this.GaugeS=this.LineS=this.BarS=
		this.HUD=this.HowToS=this.ScoreTS=
		this.Haruto=this.Nobuhime=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';

		this.genContents();
		this.M.G.endTut?this.genStart():this.genTut();
		this.test();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
		}
	},
	update:function(){
		if(this.isPlaying){
			this.BarS.x-=this.speed*this.time.physicsElapsedMS;
			if(this.BarS.x<0){
				this.BarS.x=this.world.width;
			}
		}
	},
	genContents:function(){
		this.add.sprite(0,0,'bg1');
		this.BgS=this.add.sprite(this.world.centerX,this.world.centerY,'bg2');
		this.BgS.anchor.setTo(.5);
		this.BgS.visible=!1;
		this.Haruto=this.add.sprite(this.world.centerX,this.world.centerY,'haruto2');
		this.Haruto.anchor.setTo(.5);
		this.Nobuhime=this.add.sprite(this.world.width*.8,this.world.height*.75,'nobuhime1');
		this.Nobuhime.anchor.setTo(.5);
		this.HUD=this.add.group();
		this.GaugeS=this.add.sprite(this.world.centerX,this.world.height*.8,'gauge');
		this.GaugeS.anchor.setTo(.5);
		this.HUD.add(this.GaugeS);
		this.LineS=this.add.sprite(this.world.randomX,this.world.height,'nobuhime2');
		this.LineS.anchor.setTo(.5,1);
		this.HUD.add(this.LineS);
		this.BarS=this.add.sprite(this.world.randomX,this.world.height*.8,'bar');
		this.BarS.anchor.setTo(.5);
		this.HUD.add(this.BarS);
		this.ScoreTS=this.M.S.txt(this.world.width*.2,this.world.height*.1,this.score+this.curWords.ScoreBack,this.M.S.styl(25,'#3cb371'));
		this.HUD.add(this.ScoreTS);
		this.HUD.visible=!1;
	},
	play:function(){
		this.input.onDown.add(this.stopBar,this);
	},
	stopBar:function(){
		if(this.isPlaying&&this.inputEnabled){
			this.end();
			var dist=Math.abs(this.BarS.x-this.LineS.x);
			var baseScore=this.world.width-dist*.1;
			var addScore=Math.floor(baseScore*baseScore*baseScore*this.speed*.0001);
			this.score+=addScore;
			var ts=this.M.S.txt(this.BarS.x,this.BarS.y,'+'+formatComma(addScore),this.M.S.styl(25,'#3cb371'));
			var tw=this.M.T.moveA(ts,{xy:{x:this.ScoreTS.x,y:this.ScoreTS.y},start:!0});
			tw.onComplete.add(this.next,this);
			tw.onComplete.add(function(ts){ts.destroy()});
			this.M.SE.play('StopBar',{volume:1});
		}
	},
	next:function(){
		this.ScoreTS.chT(formatComma(this.score)+this.curWords.ScoreBack);
		this.speed*=2;
		this.turnCount++;
		if(this.turnCount==6){
			this.time.events.add(500,this.gameOver,this);
		}else{
			this.start();
			this.LineS.x=this.world.randomX;
		}
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
		this.HUD.visible=!0;
		this.play();
		this.M.SE.playBGM('PlayBGM',{volume:1});
	},
	gameOver:function(){
		this.end();
		this.HUD.visible=!1;
		this.Haruto.visible=!1;
		this.M.SE.stop('PlayBGM');
		this.M.SE.play('Last',{volume:1});
		this.time.events.add(4500,function(){
			this.Haruto.visible=!0;
		},this);
		this.time.events.add(6E3,function(){
			var duration=200;
			var tw=this.M.T.moveB(this.Nobuhime,{xy:{x:this.world.width*.6,y:this.world.centerY},duration:duration,start:!0});
			this.add.tween(this.Nobuhime.scale).to({x:.5,y:.5},duration,null,!0);
			tw.onComplete.add(function(){
				this.Haruto.loadTexture('haruto1');
				var duration=400;
				var tw=this.M.T.moveB(this.Nobuhime,{xy:{x:this.world.centerX},duration:duration,start:!0});
				this.add.tween(this.Nobuhime.scale).to({x:0,y:0},duration,null,!0);
				this.add.tween(this.Haruto.scale).to({x:0,y:0},duration,null,!0);
				tw.onComplete.add(function(){
					this.BgS.visible=!0;
					this.camera.shake(.03,600,!0,Phaser.Camera.SHAKE_BOTH);
					this.time.events.add(500,this.genRes,this);
				},this);
			},this);
		},this);
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.start();

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.3,formatComma(this.score)+this.curWords.ScoreBack,this.M.S.styl(40,'#dc143c')));

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
			this.M.SE.play('OnStart',{volume:1});
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
			var e='🎮🎮🎮🎮🎮🎮';
			var res=formatComma(this.score)+this.curWords.ScoreBack+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('Back',{volume:1});
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