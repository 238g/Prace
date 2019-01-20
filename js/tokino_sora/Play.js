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
			1:{vel:30,respawnTimer:1500,respawnAnkimoTimer:10E3,nextLevel:15,},
			2:{vel:40,respawnTimer:1300,respawnAnkimoTimer:11E3,nextLevel:30,},
			3:{vel:50,respawnTimer:1e3,respawnAnkimoTimer:12E3,nextLevel:50,},
			4:{vel:60,respawnTimer:1e3,respawnAnkimoTimer:13E3,nextLevel:70,},
			5:{vel:70,respawnTimer:800,respawnAnkimoTimer:14E3,nextLevel:100,},
			6:{vel:80,respawnTimer:800,respawnAnkimoTimer:15E3,nextLevel:150,},
			7:{vel:90,respawnTimer:700,respawnAnkimoTimer:16E3,nextLevel:180,},
			8:{vel:100,respawnTimer:700,respawnAnkimoTimer:17E3,nextLevel:250,},
			9:{vel:120,respawnTimer:600,respawnAnkimoTimer:18E3,nextLevel:null,},
		};
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.score=0;
		this.HP=100;
		this.liney=this.world.height*.63;
		this.respawnTimer=200;
		this.isFiring=!1;
		this.baseSpeed=1;
		this.fireRangeY=this.world.height*.15;
		this.killCount=0;
		this.respawnAnkimoTimer=5E3;
		this.fired=!1;
		this.missedCount=0;
		this.scoreEffNum=100000;

		// Obj
		this.SoraS=this.FireS=this.Items=this.Ankimo=
		this.HowToS=this.HUD=this.EndTS=this.ScoreTS=this.HPTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';

		this.genContents();
		this.M.G.endTut?this.genStart():this.genTut();
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			if(!this.isFiring)this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.curLevelInfo.respawnTimer;
				this.respawn();
			}
			this.Items.forEachAlive(function(c){
				c.y+=this.baseSpeed*this.time.physicsElapsedMS*c.vel;
				if(c.y>this.world.height){
					c.kill();
					this.chHP(-1);
					if(this.HP<=0)this.gameOver();
				}
			},this);
			this.respawnAnkimoTimer-=this.time.elapsed;
			if(this.respawnAnkimoTimer<0){
				this.respawnAnkimoTimer=this.curLevelInfo.respawnAnkimoTimer;
				this.respawnAnkimo();
			}
			this.Ankimo.forEachAlive(function(c){c.y+=this.baseSpeed*this.time.physicsElapsedMS*c.vel;},this);
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			if(getQuery('level')){
				this.curLevel=getQuery('level');
				this.curLevelInfo=this.LevelInfo[this.curLevel];
			}
			// this.respawnAnkimoTimer=this.curLevelInfo.respawnAnkimoTimer=1e3;
		}
	},
	genContents:function(){
		this.M.S.bmpSq(0,this.liney-this.fireRangeY,this.world.width,this.fireRangeY,'#ff0000').alpha=.1;
		this.M.S.bmpSq(0,this.liney,this.world.width,this.fireRangeY,'#00ff00').alpha=.1;
		this.genFire();
		this.genItems();
		this.genAnkimo();
		this.genSora();
		this.genHUD();
	},
	genFire:function(){
		this.FireS=this.add.sprite(this.world.width*.3,this.liney,'fire');
		this.FireS.anchor.setTo(1,.5);
		this.FireS.visible=!1;
		this.FireS.basex=this.FireS.x;
	},
	genSora:function(){
		this.SoraS=this.add.sprite(0,this.world.height,'sora1');
		this.SoraS.anchor.setTo(0,1);
	},
	genItems:function(){
		var arr=[];
		for(var i=1;i<=this.M.G.itemCount;i++)arr.push('item'+i);
		this.Items=this.add.group();
		this.Items.createMultiple(4,arr);
		this.Items.children.forEach(function(c){
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.itemNum=c.key[4];
		},this);
	},
	genAnkimo:function(){
		var arr=[];
		for(var i=1;i<=this.M.G.ankimoCount;i++)arr.push('ankimo'+i);
		this.Ankimo=this.add.group();
		this.Ankimo.createMultiple(1,arr);
		this.Ankimo.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);
	},
	play:function(){
		this.input.onDown.add(this.fire,this);
	},
	fire:function(){
		if(this.inputEnabled&&!this.isFiring&&this.isPlaying){
			this.isFiring=!0;
			this.inputEnabled=!1;
			this.FireS.visible=!0;
			this.M.T.moveA(this.FireS,{xy:{x:this.world.width*.95},duration:500,start:!0});
			this.time.events.add(800,this.replay,this);
			this.baseSpeed*=.1;
			this.Items.forEachAlive(function(c){
				if(c.y<this.liney+this.fireRangeY&&this.liney-this.fireRangeY<c.y){
					var s=this.fireRangeY*1.5-Math.abs(c.y-this.liney);
					if(c.itemNum<=4){
						var addScore=Math.floor(s*s*this.curLevel);
						this.score+=addScore;
						this.ScoreTS.chT(this.genScore());
						this.scoreEff(addScore);
						this.killCount++;
						if(this.curLevelInfo.nextLevel&&this.killCount==this.curLevelInfo.nextLevel){
							this.curLevel++;
							this.curLevelInfo=this.LevelInfo[this.curLevel];
						}
						this.fired=!0;
					}else{
						this.chHP(-10);
					}
					this.time.events.add(600,function(){this.kill();},c);
				}else{
					this.missedCount++;
				}
			},this);
			this.Ankimo.forEachAlive(function(c){
				if(c.y<this.liney+this.fireRangeY&&this.liney-this.fireRangeY<c.y){
					this.chHP(10);
					this.fired=!0;
					this.time.events.add(600,function(){this.kill();},c);
				}
			},this);
			if(this.fired){
				this.M.SE.play('fire',{volume:1});
				this.SoraS.loadTexture('sora2');
			}else{
				this.M.SE.play('miss',{volume:1});
				this.SoraS.loadTexture('sora3');
				if(this.missedCount>0)this.chHP(-5);
			}
		}
	},
	replay:function(){
		if(this.HP<=0)return this.gameOver();
		if(this.isFiring&&!this.inputEnabled&&this.isPlaying){
			this.missedCount=0;
			this.SoraS.loadTexture('sora1');
			this.FireS.visible=!1;
			this.FireS.x=this.FireS.basex;
			this.isFiring=!1;
			this.baseSpeed*=10;
			this.time.events.add(200,this.start,this);
			this.fired=!1;
		}
	},
	respawn:function(){
		var r=this.rnd.between(1,4);
		if(r==1){
			this.respawnCore();
			this.respawnCore();
			this.respawnCore();
		}else if(r==2){
			this.respawnCore();
			this.respawnCore();
		}else{
			this.respawnCore();
		}
	},
	respawnCore:function(){
		var s=this.rnd.pick(this.Items.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.randomX*.4+this.world.centerX,0);
			s.vel=this.rnd.between(this.curLevelInfo.vel-10,this.curLevelInfo.vel+10)/100;
		}
	},
	respawnAnkimo:function(){
		var s=this.rnd.pick(this.Ankimo.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.randomX*.4+this.world.centerX,0);
			s.vel=this.rnd.between(this.curLevelInfo.vel-10,this.curLevelInfo.vel+10)/100;
		}
	},
	scoreEff:function(score){
		var tox=this.rnd.between(this.world.width*.05,this.world.width*.1);
		var toy=this.rnd.between(-20,20);
		if(toy>0)toy='+'+toy;
		var tw=this.M.T.moveA(this.M.S.txt(this.ScoreTS.right,this.ScoreTS.y,'+'+score,this.M.S.styl(25,'#ff00ff')),{xy:{x:'+'+tox,y:toy.toString()},duration:500,delay:this.rnd.between(0,200),start:!0});
		tw.onComplete.add(function(s){s.destroy()});
		if(this.score>this.scoreEffNum){
			this.add.tween(this.ScoreTS.scale).to({x:2,y:2},300,null,!0,0,0,!0);
			this.M.SE.play('scoreEff',{volume:1});
			if(this.score>1000000){
				this.scoreEffNum+=500000;
			}else{
				this.scoreEffNum+=100000;
			}
		}
	},
	chHP:function(hp){
		this.HP+=hp;
		this.HPTS.chT(this.genHP());
		if(hp>0){
			hp='+'+hp;
			var styl=this.M.S.styl(25,'#ff00ff');
		}else{
			var styl=this.M.S.styl(25,'#ff0000');
		}
		var tox=this.rnd.between(this.world.width*.05,this.world.width*.1);
		var toy=this.rnd.between(-20,20);
		if(toy>0)toy='+'+toy;
		var tw=this.M.T.moveA(this.M.S.txt(this.HPTS.right,this.HPTS.y,hp.toString(),styl),{xy:{x:'+'+tox,y:toy.toString()},duration:500,delay:this.rnd.between(0,200),start:!0});
		tw.onComplete.add(function(s){s.destroy()});
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.world.width*.1,this.world.height*.17,this.genScore(),this.M.S.styl(30));
		this.ScoreTS.anchor.setTo(.1,.5);
		this.ScoreTS.children[0].anchor.setTo(.1,.5);
		this.HUD.add(this.ScoreTS);
		this.HPTS=this.M.S.txt(this.world.width*.1,this.world.height*.08,this.genHP(),this.M.S.styl(30));
		this.HPTS.anchor.setTo(.1,.5);
		this.HPTS.children[0].anchor.setTo(.1,.5);
		this.HUD.add(this.HPTS);
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*2,this.curWords.End,this.M.S.styl(50,'#ff0000'));
		this.EndTS.visible=!1;
		this.HUD.add(this.EndTS);
		this.HUD.visible=!1;
	},
	genHP:function(){return this.curWords.HP+formatComma(this.HP);},
	genScore:function(){return this.curWords.ScoreFront+formatComma(this.score);},
	gameOver:function(){
		if(this.isPlaying){
			this.genEnd();
			this.end();
		}
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'twp');
		this.HowToS.tint=0x000000;

		var i,s=this.add.sprite(0,0,'twp');
		s.tint=0x000000;
		this.HowToS.addChild(s);
		
		this.HowToS.addChild(this.M.S.txt(this.world.centerX,this.world.height*.25,this.curWords.HowTo,this.M.S.styl(30)));
		this.time.events.add(300,function(){
			this.input.onDown.addOnce(function(){
				this.M.G.endTut=!0;
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);

		var sy=this.world.height*.62;
		var my=this.world.height*.1;
		var rx=this.world.width*.25;
		var lx=this.world.width*.75;
		this.HowToS.addChild(this.M.S.txt(rx,sy-my,this.curWords.Good));
		this.HowToS.addChild(this.M.S.txt(lx,sy-my,this.curWords.Bad));
		for(i=0;i<4;i++){
			s=this.add.sprite(rx,sy+my*i,'item'+(i+1));
			s.anchor.setTo(.5);
			s.width=s.height=my;
			this.HowToS.addChild(s);
		}
		for(i=0;i<4;i++){
			s=this.add.sprite(lx,sy+my*i,'item'+(i+5));
			s.anchor.setTo(.5);
			s.width=s.height=my;
			this.HowToS.addChild(s);
		}
	},
	genStart:function(){
		var s=this.M.S.txt(this.world.width*.75,-this.world.centerY,this.curWords.Start,this.M.S.styl(50,'#ffa500'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		var twB=this.M.T.moveA(s,{xy:{x:'+'+this.world.centerX},delay:200});
		twA.chain(twB);
		twA.onComplete.add(function(){
			this.start();
			this.play();
		},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.HUD.visible=!0;
		this.M.SE.play('start',{volume:1});
		this.playBGM();
	},
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
	genEnd:function(){
		this.EndTS.visible=!0;
		var tw=this.M.T.moveX(this.EndTS,{xy:{y:this.world.centerY},start:!0,easing:Phaser.Easing.Exponential.Out});
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
			this.FireS.visible=!1;
		},this);

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.18,this.curWords.Res,this.M.S.styl(50,'#008000')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.35,this.genScore(),this.M.S.styl(40,'#008000')));

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
			var e='✌✌✌✌✌✌';
			var res=this.genScore()+'\n'+this.curWords.TwResB+'\n';
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