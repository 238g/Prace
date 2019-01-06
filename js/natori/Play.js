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
		this.lasty=0;
		this.rl=0;
		this.rr=0;
		this.respawnTimer=800;
		this.my=this.world.height*.05;
		this.stockTmpCount=0;
		this.score=0;
		this.missy=0;
		this.HP=100;
		// Obj
		this.MovingTarget=this.Stock=this.MissGrp=
		this.HowToS=this.HUD=this.EndTS=this.ScoreTS=this.HPTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';

		this.genContents();
		// this.M.G.endTut?this.genStart():this.genTut();
		this.genStart();//TODO del
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=800;
				this.respawn();
			}
			this.MovingTarget.forEach(function(c){
				if(this.isPlaying){
					if(c.flr=='left'){
						c.x+=this.time.physicsElapsedMS*this.curLevelInfo.vel;
						if(this.world.width<c.x){
							c.destroy();
							this.chHP(1);
						}
					}else{
						c.x-=this.time.physicsElapsedMS*this.curLevelInfo.vel;
						if(c.x<0){
							c.destroy();
							this.chHP(1);
						}
					}
				}
			},this);
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			// if(getQuery('level'))
		}
	},
	genContents:function(){
		this.add.sprite(0,0,'bg_1');
		this.MissGrp=this.add.group();
		this.MovingTarget=this.add.group();
		this.genStock();
		this.genHUD();
	},
	genStock:function(){
		this.Stock=this.add.group();
		var s,i,sy=this.world.height*1.1;
		for(i=0;i<7;i++){
			s=this.add.sprite(this.world.centerX,sy-this.my*i,'natori_1');
			s.anchor.setTo(.5);
			s.index=i;
			this.Stock.addAt(s,0);
			this.score++;
		}
		this.lasty=sy-this.my*i;
		this.rl=s.left;
		this.rr=s.right;
		this.missy=this.world.height+s.height;
	},
	respawn:function(){
		var b;
		if(this.rnd.between(1,100)>50){
			b=this.add.button(0,this.world.randomY*.3+this.world.height*.2,'natori_1',this.onClickTarget,this);
			b.flr='left';
		}else{
			b=this.add.button(this.world.width,this.world.randomY*.3+this.world.height*.2,'natori_1',this.onClickTarget,this);
			b.flr='right';
		}
		b.anchor.setTo(.5);
		this.MovingTarget.add(b);
	},
	onClickTarget:function(b){
		if(this.rl<=b.x&&b.x<=this.rr){
			this.rl=b.left;
			this.rr=b.right;
			var tw=this.M.T.moveX(b,{xy:{y:this.lasty},easing:Phaser.Easing.Exponential.Out,start:!0,duration:500});
			this.Stock.addAt(b,0);
			tw.onComplete.add(this.addedStock,this);
		}else{
			var tw=this.M.T.moveB(b,{xy:{y:this.missy},easing:Phaser.Easing.Exponential.Out,duration:400,start:!0});
			this.MissGrp.add(b);
			tw.onComplete.add(this.miss,this);
		}
		b.inputEnabled=!1;
	},
	addedStock:function(){
		this.stockTmpCount=0;
		this.Stock.forEach(function(c){
			this.stockTmpCount++;
			var tw=this.M.T.moveX(c,{xy:{y:'+'+this.my},duration:100,start:!0});
			if(this.stockTmpCount==this.Stock.children.length){
				tw.onComplete.add(function(){
					this.Stock.children[this.Stock.children.length-1].destroy();
				},this);
			}
		},this);
		this.score++;
		this.ScoreTS.chT(this.genScore());
		if(this.curLevelInfo.nextLevel!=null&&this.score==this.curLevelInfo.nextLevel){
			this.curLevel++;
			this.curLevelInfo=this.LevelInfo[this.curLevel];
		}
	},
	miss:function(){
		this.MissGrp.forEach(function(c){
			c.destroy();
		});
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		this.chHP(10);
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.world.width*.75,this.world.height*.05,this.genScore(),this.M.S.styl(30,'#ff69b4'));
		this.HUD.add(this.ScoreTS);
		this.HPTS=this.M.S.txt(this.world.width*.25,this.world.height*.05,this.curWords.HP+this.HP,this.M.S.styl(30,'#ff69b4'));
		this.HUD.add(this.HPTS);
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*2,this.curWords.End,this.M.S.styl(50,'#ff0000'));
		this.EndTS.visible=!1;
		this.HUD.add(this.EndTS);
		this.HUD.visible=!1;
	},
	chHP:function(minusVal){
		this.HP-=minusVal;
		this.HPTS.chT(this.curWords.HP+this.HP);
		if(this.HP<=0)this.gameOver();
	},
	genScore:function(){return formatComma(this.score)+this.curWords.ScoreBack;},
	gameOver:function(){
		if(this.isPlaying){
			this.HPTS.chT(this.curWords.HP+0);
			//TODO
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
		// this.time.events.add(500,function(){this.M.SE.play('start',{volume:1});},this);
	},
	genEnd:function(){
		var tw=this.M.T.moveX(this.EndTS,{xy:{x:this.world.centerX},start:!0,easing:Phaser.Easing.Exponential.Out});
		tw.onComplete.add(this.genRes,this);
		// this.M.SE.play('end',{volume:1});
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