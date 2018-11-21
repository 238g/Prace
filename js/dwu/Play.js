BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.curStage=this.M.G.curStage;
		this.StageInfo=this.M.G.StageInfo;
		this.curStageInfo=this.StageInfo[this.curStage];
		// Val
		this.itemRespawnTimer=0;
		this.itemRespawnInterval=this.curStageInfo.itemRespawnInterval;
		this.obstacleRespawnTimer=0;
		this.obstacleRespawnInterval=this.curStageInfo.obstacleRespawnInterval;
		this.isClear=!1;

		// Obj
		this.Player=this.Obstacles=this.Items=
		// this.BgS=this.GaugeS=this.LineS=this.BarS=
		this.HUD=this.HowToS=this.ScoreTS=this.TargetTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.genContents();
		// this.M.G.endTut?this.genStart():this.genTut();
		this.start();
		this.test();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
		}
	},
	update:function(){
		if(this.isPlaying){
			this.obstacleRespawnTimer-=this.time.elapsed;
			if(this.obstacleRespawnTimer<0){
				this.obstacleRespawnTimer=this.obstacleRespawnInterval;
				this.respawnObstacle();
			}
			this.itemRespawnTimer-=this.time.elapsed;
			if(this.itemRespawnTimer<0){
				this.itemRespawnTimer=this.itemRespawnInterval;
				this.respawnItem();
			}
			this.physics.arcade.overlap(this.Player,this.Obstacles,this.collideObstacles,null,this);
			this.physics.arcade.overlap(this.Player,this.Items,this.collideItems,null,this);
		}
	},
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y=500;

		this.genObstacles();
		this.genItems();
		this.genPlayer();
		this.genHUD();
	},
	genObstacles:function(){
		this.Obstacles=this.add.group();
		this.Obstacles.enableBody=!0;
		this.Obstacles.physicsBodyType=Phaser.Physics.ARCADE;
		this.Obstacles.createMultiple(10,[]);
		// this.Obstacles.createMultiple(Math.floor(200/this.curStageInfo.obstacleKeys.length),this.curStageInfo.obstacleKeys);
		this.Obstacles.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);
	},
	respawnObstacle:function(){
		var s=this.rnd.pick(this.Obstacles.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.width,this.world.randomY);
			s.body.velocity.x=-300;
		}
	},
	collideObstacles:function(player,obstacle){
		player.kill();
		obstacle.kill();
		this.gameOver();
	},
	gameOver:function(){
		this.end();
		this.genEnd();
		this.isClear=!1;
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
	},
	genItems:function(){
		this.Items=this.add.group();
		this.Items.enableBody=!0;
		this.Items.physicsBodyType=Phaser.Physics.ARCADE;
		this.Items.createMultiple(10,[]);
		// this.Items.createMultiple(Math.floor(200/this.curStageInfo.noteKeys.length),this.curStageInfo.noteKeys);
		this.Items.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);
	},
	respawnItem:function(){
		var s=this.rnd.pick(this.Items.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.width,this.world.randomY);
			s.body.velocity.x=-300;
		}
	},
	collideItems:function(player,item){
		item.kill();
		// TODO goal count ++
		// TODO if goal this.clear
	},
	clear:function(){
		this.end();
		this.genEnd();
		this.isClear=!0;
	},
	genPlayer:function(){
		this.Player=this.add.sprite(100,100,'dwu1');
		this.Player.anchor.setTo(.5);
		this.physics.enable(this.Player,Phaser.Physics.ARCADE);
		this.Player.body.collideWorldBounds=!0;
		this.Player.body.bounce.set(.8);
		this.Player.body.velocity.y=-100;
		this.Player.smoothed=!1;

		this.input.onDown.add(this.jump,this);
	},
	jump:function(p){
		if(this.isPlaying){
			if(p.x<this.world.centerX){
				this.Player.body.velocity.y=-200;
			}else{
				this.Player.body.velocity.y=-400;
			}
		}
	},
	genHUD:function(){
		//TODO
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(100,100,'SCORE',this.M.S.styl(25,'#00ff00'));
		this.TargetTS=this.M.S.txt(100,100,'TARGET',this.M.S.styl(25,'#00ff00'));
		this.HUD.add(this.ScoreTS);
		this.HUD.add(this.TargetTS);
		// this.HUD.visible=!1;
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
		// TODO
		// move char
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
	},
	genEnd:function(){
		// TODO text slide in
		this.genRes();
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