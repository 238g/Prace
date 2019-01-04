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
			1:{mind:700,maxd:900,nextLevel:10,tintA:0xff7f50,tintB:0xff7f50},
			2:{mind:400,maxd:600,nextLevel:25,tintA:0xff6347,tintB:0xff6347},
			3:{mind:400,maxd:800,nextLevel:60,tintA:0x000080,tintB:0xc71585},
			4:{mind:300,maxd:500,nextLevel:90,tintA:0x191970,tintB:0x1e90ff},
			5:{mind:300,maxd:800,nextLevel:120,tintA:0x00bfff,tintB:0x1e90ff},
			6:{mind:200,maxd:500,nextLevel:null,tintA:0xffffff,tintB:0xffffff},
		};
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.score=0;
		this.duration=0;
		this.curBGMNum=1;

		this.rstx=this.world.width*.57;
		this.rsty=this.world.height*.52;
		this.rx=this.world.width*.18;
		this.ry=this.world.height*.15;
		this.rcx=this.rstx+this.rx/2;
		this.rcy=this.rsty+this.ry/2;

		this.arrHP=[];
		this.curHP=0;
		this.curBallNum=2;

		// Obj
		this.Tamaki=this.Matsuri=this.Ball=
		this.HowToS=this.HUD=this.EndTS=this.ScoreTS=
		this.Odanobu_1=this.Odanobu_2=this.EffBg=this.MtBg=this.SkyBg=
		null;
		this.Tween={};
		this.mvTw1={};
		this.mvTw2={};
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
			if(getQuery('level')){
				this.curLevel=getQuery('level');
				this.curLevelInfo=this.LevelInfo[this.curLevel];
				this.SkyBg.tint=this.curLevelInfo.tintA;
				this.MtBg.tint=this.curLevelInfo.tintB;
				this.score=this.curLevelInfo.nextLevel-1;
			}
			// this.M.S.bmpSq(this.rstx,this.rsty,this.rx,this.ry,'#ff0000').alpha=.5;
		}
	},
	genContents:function(){
		this.genBg();
		this.genChar();
		this.genHUD();
	},
	genBg:function(){
		this.SkyBg=this.add.sprite(0,0,'bg_1');
		this.EffBg=this.add.sprite(this.world.width*.4,this.world.height*.2,'bg_3');
		this.EffBg.anchor.setTo(.5);
		this.EffBg.visible=!1;
		this.Odanobu_1=this.add.sprite(this.world.width*.4,this.world.height*.4,'odanobu_2');
		this.Odanobu_1.anchor.setTo(.5);
		this.Odanobu_1.visible=!1;
		this.Odanobu_2=this.add.sprite(this.world.width*.53,this.world.height*.2,'odanobu_1');
		var tw=this.M.T.moveA(this.Odanobu_2,{xy:{x:'-'+50},duration:3E3,start:!0});
		tw.repeat(-1);
		tw.yoyo(!0);
		this.MtBg=this.add.sprite(0,0,'bg_2');
		this.Burn=this.add.sprite(this.world.centerX,this.world.centerY,'burn');
		this.Burn.visible=!1;
	},
	genChar:function(){
		this.Tamaki=this.add.sprite(this.world.width*.2,this.world.height*.7,'tamaki_1');
		this.Tamaki.anchor.setTo(.5);
		this.Matsuri=this.add.sprite(this.world.width*.8,this.world.height*.7,'matsuri_1');
		this.Matsuri.anchor.setTo(.5);
		this.Ball=this.add.sprite(this.world.width*.3,this.world.height*.5,'ball_'+this.curBallNum);
		this.Ball.firstx=this.Ball.x;
		this.Ball.firsty=this.Ball.y;
		this.Ball.anchor.setTo(.5);
	},
	play:function(){
		this.nmeHit();
		this.input.onDown.add(this.swing,this);
	},
	nmeHit:function(){
		this.start();
		this.duration=this.rnd.between(this.curLevelInfo.mind,this.curLevelInfo.maxd);
		if(this.duration<400){
			this.M.SE.play('criticalhit',{volume:1});
		}else{
			this.M.SE.play('hit_'+this.rnd.between(1,2),{volume:1});
		}
		this.M.T.moveB(this.Ball,{xy:{x:this.rcx},duration:this.duration*2,start:!0});
		this.mvTw1=this.M.T.moveX(this.Ball,{xy:{y:'-'+this.world.height*.2},start:!0,duration:this.duration,easing:Phaser.Easing.Cubic.Out});
		this.mvTw2=this.M.T.moveX(this.Ball,{xy:{y:this.rcy},duration:this.duration,easing:Phaser.Easing.Sinusoidal.In});
		this.mvTw1.chain(this.mvTw2);
		this.mvTw2.onComplete.add(function(){
			this.mvTw1=this.M.T.moveX(this.Ball,{xy:{y:this.world.height},duration:this.duration*1.6,easing:Phaser.Easing.Sinusoidal.Out,start:!0});
			this.mvTw2=this.M.T.moveB(this.Ball,{xy:{x:this.Matsuri.x},duration:this.duration*1.6,start:!0});
			this.mvTw2.onComplete.add(this.miss,this);
		},this);
		this.charJump(this.Tamaki);
	},
	swing:function(){
		if(this.isPlaying&&this.inputEnabled){
			this.end();
			if(
				(this.mvTw1.isRunning||this.mvTw2.isRunning)
				&&this.rstx<=this.Ball.x
				&&this.Ball.x<=this.rstx+this.rx
				&&this.rsty<=this.Ball.y
				&&this.Ball.y<=this.rsty+this.ry
			){
				this.playerHit();
			}else{
				this.charJump(this.Matsuri);
				this.M.SE.play('missswing',{volume:2});
			}
		}
	},
	playerHit:function(){
		this.mvTw1.stop();
		this.mvTw2.stop();
		this.M.T.moveB(this.Ball,{xy:{x:this.Ball.firstx},duration:this.duration*2,start:!0});
		this.mvTw1=this.M.T.moveX(this.Ball,{xy:{y:'-'+this.world.height*.2},start:!0,duration:this.duration,easing:Phaser.Easing.Cubic.Out});
		this.mvTw2=this.M.T.moveX(this.Ball,{xy:{y:this.Ball.firsty},duration:this.duration,easing:Phaser.Easing.Sinusoidal.In});
		this.mvTw1.chain(this.mvTw2);
		this.mvTw2.onComplete.add(this.nmeHit,this);
		this.charJump(this.Matsuri);
		this.score++;
		this.ScoreTS.chT(this.genScore());
		if(this.curLevelInfo.nextLevel!=null&&this.score==this.curLevelInfo.nextLevel){
			this.curLevel++;
			this.curLevelInfo=this.LevelInfo[this.curLevel];
			this.SkyBg.tint=this.curLevelInfo.tintA;
			this.MtBg.tint=this.curLevelInfo.tintB;
		}
		this.M.SE.play('hit_'+this.rnd.between(1,2),{volume:1});
	},
	charJump:function(char){this.M.T.moveB(char,{xy:{y:'-'+this.world.height*.05},start:!0,duration:150}).yoyo(!0);},
	genHP:function(){
		var sx=this.world.centerX,bnum=2,w=this.world.width*.1;
		for(var i=0;i<4;i++){
			var s=this.add.sprite(sx+w*i,10,'ball_'+bnum);
			s.width=s.height=w;
			bnum=bnum==1?2:1;
			this.HUD.add(s);
			this.arrHP.push(s);
		}
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.world.width*.25,this.world.height*.05,this.genScore(),this.M.S.styl(25,'#ff00ff'));
		this.HUD.add(this.ScoreTS);
		this.genHP();
		this.HUD.visible=!1;
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*2,this.curWords.End,this.M.S.styl(50,'#ff0000'));
		this.EndTS.visible=!1;
		this.HUD.add(this.EndTS);
	},
	genScore:function(){return this.curWords.ScoreFront+formatComma(this.score)+this.curWords.ScoreBack;},
	miss:function(){
		this.end();
		this.arrHP[this.curHP].visible=!1;
		this.curHP++;
		if(this.arrHP.length==this.curHP)return this.gameOver();
		this.time.events.add(500,this.next,this);
	},
	next:function(){
		this.Ball.x=this.Ball.firstx;
		this.Ball.y=this.Ball.firsty;
		this.curBallNum=this.curBallNum==1?2:1;
		this.Ball.loadTexture('ball_'+this.curBallNum);
		this.time.events.add(500,this.nmeHit,this);
	},
	gameOver:function(){
		this.time.events.add(800,function(){
			this.M.SE.play('odanobu_bomb',{volume:1});
			this.Ball.visible=!1;
			this.Odanobu_1.visible=!0;
			this.Odanobu_2.visible=!1;
			this.HUD.visible=!1;
			var tw=this.M.T.moveB(this.Odanobu_1,{xy:{y:this.world.height*.2},duration:1500,start:!0,delay:500});
			tw.onComplete.add(function(){
				this.EffBg.visible=!0;
				var duration=700;
				var tw=this.add.tween(this.EffBg).to({angle:359},4E3,null,!0,duration,-1);
				this.add.tween(this.Odanobu_1.scale).to({x:3,y:3},6E3,null,!0,duration);
				tw.onStart.add(function(){
					this.camera.shake(.01,6E3,!0,Phaser.Camera.SHAKE_HORIZONTAL);
				},this);
				this.time.events.add(3E3,function(){
					this.Burn.visible=!0;
					this.Burn.anchor.setTo(.5);
					var tw=this.add.tween(this.Burn.scale).to({x:5,y:5},2E3,null,!0);
					tw.onComplete.add(this.genRes,this);
					this.add.tween(this.Tamaki).to({x:this.world.width*1.3,y:this.world.height*.3,angle:180},3E3,null,!0);
					this.add.tween(this.Matsuri).to({x:-this.world.width*.3,y:this.world.height*.3,angle:-180},3E3,null,!0);
				},this);
			},this);
			this.M.SE.stop('curBGM');
		},this);
		this.end();
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
		twB.onComplete.add(this.play,this);
		twA.onComplete.add(function(){this.destroy},s);
		this.HUD.visible=!0;
		this.time.events.add(500,function(){this.M.SE.play('start',{volume:1});},this);
		this.playBGM();
	},
	playBGM:function(){
		if(!this.M.SE.isPlaying('curBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('curBGM');
			var bgm=this.M.SE.play('PlayBGM_'+this.curBGMNum,{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBGM,this);
		}
	},
	loopBGM:function(){
		if(this.M.curScene=='Play'&&this.Odanobu_2.visible==!0){
			this.curBGMNum++;
			if(this.curBGMNum==3)this.curBGMNum=1;
			var bgm=this.M.SE.play('PlayBGM_'+this.curBGMNum,{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBGM,this);
		}
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600,start:!0});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
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
			var e='🍁🍁🍁🍁🍁🍁';
			var res=this.curWords.TwResF+'\n'+this.score+this.curWords.TwResB+'\n';
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