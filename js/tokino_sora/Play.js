BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.curLevel=1;
		this.LevelInfo={
			1:{vel:.3,respawnTimer:1E3,nextLevel:20,},
			2:{vel:.35,respawnTimer:900,nextLevel:40,},
			3:{vel:.4,respawnTimer:800,nextLevel:60,},
			4:{vel:.45,respawnTimer:800,nextLevel:80,},
			5:{vel:.5,respawnTimer:800,nextLevel:100,},
			6:{vel:.55,respawnTimer:800,nextLevel:120,},
			7:{vel:.6,respawnTimer:800,nextLevel:140,},
			8:{vel:.7,respawnTimer:800,nextLevel:null,},
		};
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.score=0;



		// Obj
		this.HowToS=this.HUD=this.EndTS=this.ScoreTS=
		// this.HPTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';

		// this.genContents();
		// this.M.G.endTut?this.genStart():this.genTut();
		this.test();
	},
	updateT:function(){
		if(this.isPlaying){
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			// if(getQuery('level'))
		}
	},
	genContents:function(){
		// this.genHUD();
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.world.width*.75,this.world.height*.05,this.genScore(),this.M.S.styl(30,'#ff69b4'));
		this.HUD.add(this.ScoreTS);
		// this.HPTS=this.M.S.txt(this.world.width*.25,this.world.height*.05,this.curWords.HP+this.HP,this.M.S.styl(30,'#ff69b4'));
		// this.HUD.add(this.HPTS);
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*2,this.curWords.End,this.M.S.styl(50,'#ff0000'));
		this.EndTS.visible=!1;
		this.HUD.add(this.EndTS);
		this.HUD.visible=!1;
	},
	genScore:function(){return formatComma(this.score)+this.curWords.ScoreBack;},
	gameOver:function(){
		if(this.isPlaying){
			this.genEnd();
			this.end();
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
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.Start,this.M.S.styl(50,'#ffa500'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.onComplete.add(this.start,this);
		twA.onComplete.add(function(){this.destroy},s);
		this.HUD.visible=!0;
		// this.M.SE.play('start',{volume:1});
		// this.playBGM();
	},
	/*
	playBGM:function(){
		if(!this.M.SE.isPlaying('curBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('curBGM');
			var bgm=this.M.SE.play('PlayBGM_'+this.M.G.curBGMNum,{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBGM,this);
		}
	},
	loopBGM:function(){
		if(this.M.curScene=='Play'){
			this.M.G.curBGMNum++;
			if(this.M.G.curBGMNum==4)this.M.G.curBGMNum=1;
			var bgm=this.M.SE.play('PlayBGM_'+this.M.G.curBGMNum,{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBGM,this);
		}
	},
	*/
	genEnd:function(){
		this.EndTS.visible=!0;
		var tw=this.M.T.moveX(this.EndTS,{xy:{y:this.world.centerY},start:!0,easing:Phaser.Easing.Exponential.Out});
		tw.onComplete.add(this.genRes,this);
		// this.M.SE.play('end',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600,start:!0});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			this.HUD.visible=!1;
		},this);

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.15,this.curWords.Res,this.M.S.styl(40,'#ff00ff')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.4,this.genScore(),this.M.S.styl(50,'#ff00ff')));

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
			var e='************************************************************';
			var res=this.curWords.TwResF+this.genScore()+'\n';
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