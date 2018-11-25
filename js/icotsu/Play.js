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
		this.respawnInterval=
		this.respawnTimer=500;
		this.tickTimer=1E3;
		this.leftTime=50;
		this.score=0;
		this.baseScoreRate=this.game.device.touch?1:2;
		this.billion=!1;
		// Obj
		this.Fire=this.Nme=
		this.HUD=this.HowToS=this.ScoreTS=this.TimeTS=
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
			this.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(this.respawnKerin,this);
			this.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.respawnPandei,this);
		}
	},
	update:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.respawnInterval;
				this.respawnEnemy();
			}
			this.tickTimer-=this.time.elapsed;
			if(this.tickTimer<0){
				this.tickTimer=1E3;
				this.leftTime--;
				this.TimeTS.chT(this.curWords.Time+':'+this.leftTime);
				if(this.leftTime==0){
					this.gameOver();
				}else if(this.leftTime==40||this.leftTime==20){
					this.respawnKerin();
				}else if(this.leftTime==30||this.leftTime==10){
					this.respawnPandei();
				}
			}
		}
	},
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.add.sprite(0,0,'bg1');
		this.genFire();
		this.genNme();
		this.genBone();
		this.genHUD();
	},
	genFire:function(){
		this.Fire=this.add.sprite(this.world.centerX,this.world.centerY,'fire');
		this.Fire.anchor.setTo(.5);
	},
	genNme:function(){
		this.Nme=this.add.group();
		this.Nme.enableBody=!0;
		this.Nme.physicsBodyType=Phaser.Physics.ARCADE;
		this.Nme.inputEnableChildren=!0;
		this.Nme.createMultiple(10,['icotsu1','icotsu3','icotsu4']);
		this.Nme.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.inputEnabled=!0;
			c.input.enableDrag();
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.events.onDragStart.add(this.onDragStart,this);
			c.events.onDragStop.add(this.onDragStop,this);
		},this);
	},
	onDragStart:function(b){
		b.body.enable=!1;
		this.M.SE.play('fetch',{volume:1});
	},
	onDragStop:function(b,p){
		if(this.isPlaying&&p.x<=this.Fire.right&&p.x>=this.Fire.left&&p.y>=this.Fire.top&&p.y<=this.Fire.bottom){
			b.kill();
			var score=Math.abs(b.originVelX*1.5)+Math.abs(b.originVelY);
			this.score+=Math.floor(score*.1*this.baseScoreRate);
			this.ScoreTS.chT(this.curWords.ScoreFront+this.genScore()+this.curWords.ScoreBack);
			var s=this.Bone.getFirstDead();
			if(s){
				if(b.key=='icotsu3'||b.key=='icotsu4'){
					s.loadTexture('icotsu5');
				}else if(score>450){
					s.loadTexture('icotsu6');
				}else{
					s.loadTexture('icotsu2');
				}
				s.reset(this.world.centerX,this.world.centerY);
				s.body.velocity.x=this.rnd.between(-300,300);
				s.body.gravity.y=500;
			}
			this.M.SE.play('fire',{volume:1.2});
		}else{
			b.body.enable=!0;
			b.body.velocity.x=b.originVelX;
			b.body.velocity.y=b.originVelY;
		}
	},
	genScore:function(){
		var scoreText=formatComma(this.score);
		if(this.score>=10000)scoreText=Math.floor(this.score/10000)+this.curWords.ScoreBillion+formatComma(Math.floor(String(this.score).slice(-4)));
		return scoreText;
	},
	respawnEnemy:function(){
		var s=this.rnd.pick(this.Nme.children.filter(function(c){return!c.alive}));
		if(s){
			var r=this.rnd.between(0,100);
			if(r<50){//updown
				var velX=0;
				var velY=this.rnd.between(10,30)*this.time.physicsElapsedMS;
				if(r<25){//up
					var y=0;
				}else{//down
					var y=this.world.height;
					velY*=-1;
				}
				if(this.rnd.between(0,100)<50){
					var x=this.rnd.between(this.world.width*.1,this.world.width*.3);
				}else{
					var x=this.rnd.between(this.world.width*.7,this.world.width*.9);
				}
			}else{//leftright
				var velX=this.rnd.between(10,30)*this.time.physicsElapsedMS;
				var velY=0;
				if(r<75){//left
					var x=0;
				}else{//right
					var x=this.world.width;
					velX*=-1;
				}
				if(this.rnd.between(0,100)<50){
					var y=this.rnd.between(this.world.height*.1,this.world.height*.3);
				}else{
					var y=this.rnd.between(this.world.height*.7,this.world.height*.9);
				}
			}
			s.reset(x,y);
			s.body.enable=!0;
			s.body.velocity.x=velX;
			s.body.velocity.y=velY;
			s.originVelX=velX;
			s.originVelY=velY;
		}
	},
	genBone:function(){
		this.Bone=this.add.group();
		this.Bone.enableBody=!0;
		this.Bone.physicsBodyType=Phaser.Physics.ARCADE;
		this.Bone.createMultiple(30,'');
		this.Bone.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.Fire.x,this.Fire.bottom,this.curWords.ScoreFront+0+this.curWords.ScoreBack,this.M.S.styl(25,'#008000'));
		this.TimeTS=this.M.S.txt(this.world.centerX,this.world.height*.05,this.curWords.Time+':'+this.leftTime,this.M.S.styl(25,'#1e90ff'));
		this.HUD.add(this.ScoreTS);
		this.HUD.add(this.TimeTS);
	},
	respawnKerin:function(){
		var s=this.add.sprite(this.world.randomX*.8+this.world.width*.1,this.world.height,'missile');
		this.Tween=this.M.T.moveB(s,{xy:{y:-this.world.centerY},duration:1400,start:!0});
		s.anchor.setTo(.5);
		s.smoothed=!1;
		s.inputEnabled=!0;
		s.input.enableDrag();
		s.events.onDragStart.add(this.onDragStartSp,this);
		s.events.onDragStop.add(this.onDragStopSp,this);
		this.M.SE.play('missile',{volume:1.5});
	},
	respawnPandei:function(){
		var s=this.add.sprite(this.world.width,this.world.randomY*.8+this.world.height*.1,'pandei1');
		this.Tween=this.M.T.moveB(s,{xy:{x:-this.world.centerX},duration:1800,start:!0});
		s.anchor.setTo(.5);
		s.smoothed=!1;
		s.inputEnabled=!0;
		s.input.enableDrag();
		s.events.onDragStart.add(this.onDragStartSp,this);
		s.events.onDragStop.add(this.onDragStopSp,this);
		this.M.SE.play('showpandei',{volume:1});
	},
	onDragStartSp:function(){
		if(this.Tween.isRunning)this.Tween.stop();
		this.M.SE.play('fetch',{volume:1});
	},
	onDragStopSp:function(b,p){
		if(this.isPlaying&&p.x<=this.Fire.right&&p.x>=this.Fire.left&&p.y>=this.Fire.top&&p.y<=this.Fire.bottom){
			b.kill();
			var score=b.key=='missile'?1000:500;
			this.score+=Math.floor(score*this.baseScoreRate);
			this.ScoreTS.chT(this.curWords.ScoreFront+this.genScore()+this.curWords.ScoreBack);
			var s=this.add.sprite(this.world.centerX,this.world.centerY,b.key=='missile'?'kerin':'pandei2');
			this.physics.enable(s,Phaser.Physics.ARCADE);
			s.body.velocity.x=this.rnd.between(-300,300);
			s.body.gravity.y=500;
			s.checkWorldBounds=!0;
			s.outOfBoundsKill=!0;
			this.M.SE.play('explode',{volume:1.5});
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
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.Start,this.M.S.styl(50,'#ff8c00'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.onComplete.add(function(){
			this.inputEnabled=!0;
			this.start();
		},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.HUD.visible=!0;
		this.M.SE.playBGM('PlayBGM',{volume:.8});
		this.M.SE.play('start',{volume:1});
	},
	gameOver:function(){
		this.end();
		this.genEnd();
		this.Nme.children.forEach(function(c){c.inputEnabled=!1});
	},
	genEnd:function(){
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.End,this.M.S.styl(50,'#dc143c'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		twA.onComplete.add(function(){
			this.genRes();
		},this);
		this.HUD.add(s);
		this.M.SE.play('fin',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			this.HUD.visible=!1;
		},this);
		tw.start();
		tw.onStart.add(function(){this.M.SE.play('start',{volume:1})},this);

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.3,this.curWords.ScoreFront+'\n'+this.genScore()+this.curWords.ScoreBack,this.M.S.styl(40,'#dc143c')));

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
			var e='🔥💀🔥💀🔥💀🔥';
			var res=this.curWords.ScoreFront+this.genScore()+this.curWords.ScoreBack+'\n';
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