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
		this.itemScale=this.curStageInfo.itemScale;
		this.obstacleScale=this.curStageInfo.obstacleScale;
		this.targetScore=this.curStageInfo.targetScore;
		this.score=0;
		this.itemRespawnTimer=0;
		this.itemRespawnInterval=this.curStageInfo.itemRespawnInterval;
		this.obstacleRespawnTimer=0;
		this.obstacleRespawnInterval=this.curStageInfo.obstacleRespawnInterval;
		this.isClear=!1;

		// Obj
		this.BgS=this.Player=this.Obstacles=this.Items=this.FollowEff=this.GoalS=
		this.HUD=this.HowToS=this.ScoreTS=this.TargetTS=this.EndTS=
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
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
		}
	},
	renderT:function(){
		this.game.debug.body(this.Player);
		this.Items.forEachAlive(function(c){this.game.debug.body(c)},this);
		this.Obstacles.forEachAlive(function(c){this.game.debug.body(c)},this);
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

			this.BgS.tilePosition.x-=.3;
			this.FollowEff.x=this.Player.right-15;
			this.FollowEff.y=this.Player.y;
		}
	},
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.BgS=this.add.tileSprite(0,0,this.world.width,this.world.height,'bg1');

		this.genObstacles();
		this.genItems();
		this.genEff();

		this.GoalS=this.add.sprite(this.world.width*1.5,this.world.height,'goal'+this.curStage);
		this.GoalS.anchor.setTo(1);

		this.genPlayer();
		this.genHUD();
	},
	genObstacles:function(){
		var arr=[];
		for(var i=1;i<=7;i++)arr.push('otaku'+i);
		this.Obstacles=this.add.group();
		this.Obstacles.enableBody=!0;
		this.Obstacles.physicsBodyType=Phaser.Physics.ARCADE;
		this.Obstacles.createMultiple(3,arr);
		this.Obstacles.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.body.setSize(c.width*.7,c.height*.7,c.width*.15,c.height*.15);
		},this);
	},
	respawnObstacle:function(){
		var s=this.rnd.pick(this.Obstacles.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.width,this.world.randomY);
			s.body.velocity.x=-18*this.time.physicsElapsedMS;
			s.scale.setTo(this.obstacleScale);
		}
	},
	collideObstacles:function(player,obstacle){
		player.kill();
		obstacle.body.enable=!1;
		this.M.SE.play('HitObstacle',{volume:1.5});
		this.gameOver();
	},
	gameOver:function(){
		this.end();
		this.isClear=!1;
		this.FollowEff.on=!1;
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		this.genEnd();
	},
	genItems:function(){
		this.Items=this.add.group();
		this.Items.enableBody=!0;
		this.Items.physicsBodyType=Phaser.Physics.ARCADE;
		this.Items.createMultiple(10,'dwu2');
		this.Items.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
			// c.body.setSize(c.width*.8,c.height*.8,c.width*.1,c.height*.1);
		},this);
	},
	respawnItem:function(){
		var s=this.rnd.pick(this.Items.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.width,this.world.randomY);
			s.body.velocity.x=-18*this.time.physicsElapsedMS;
			s.scale.setTo(this.itemScale);
		}
	},
	collideItems:function(player,item){
		item.kill();
		this.score++;
		this.ScoreTS.chT(this.curWords.Score+this.score);
		this.M.SE.play('GetItem',{volume:1});
		if(this.score==this.targetScore)this.clear();
	},
	clear:function(){
		this.end();
		this.isClear=!0;
		this.Player.body.enable=!1;
		this.FollowEff.on=!1;
		var twA=this.M.T.moveB(this.GoalS,{xy:{x:this.world.width},start:!0});
		twA.onComplete.add(function(){
			var twB=this.M.T.moveB(this.Player,{xy:{x:this.GoalS.centerX,y:this.GoalS.centerY},start:!0});
			twB.onComplete.add(this.genEnd,this);
			twB.onComplete.add(function(){this.M.T.fadeOutB(this.Player,{start:!0})},this);
		},this);
	},
	genPlayer:function(){
		this.Player=this.add.sprite(-this.world.width,this.world.height*.2,'dwu1');
		this.Player.anchor.setTo(.5);
		this.physics.enable(this.Player,Phaser.Physics.ARCADE);
		this.Player.body.collideWorldBounds=!1;
		this.Player.body.bounce.set(.8);
		this.Player.smoothed=!1;
		this.Player.body.setSize(this.Player.width*.3,this.Player.height*.7,this.Player.width*.65,this.Player.height*.1);

		this.input.onDown.add(this.jump,this);
	},
	jump:function(p){
		if(this.isPlaying){
			if(p.x<this.world.centerX){
				this.Player.body.velocity.y=-12*this.time.physicsElapsedMS;
			}else{
				this.Player.body.velocity.y=-24*this.time.physicsElapsedMS;
			}
		}
	},
	genEff:function(){
		this.FollowEff=this.add.emitter(0,0,200);
		this.FollowEff.makeParticles('eff');
		this.FollowEff.setScale(.2,5,.2,5,500);
		this.FollowEff.setAlpha(1,0,800);
		this.FollowEff.setXSpeed(-500,-200);
		this.FollowEff.setYSpeed(-200,200);
		this.FollowEff.gravity.x=0;
		this.FollowEff.gravity.y=-500;
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.world.width*.1,this.world.height*.1,this.curWords.Score+this.score,this.M.S.styl(25,'#008000'));
		this.TargetTS=this.M.S.txt(this.world.width*.1,this.world.height*.2,this.curWords.Target+(this.curStageInfo.endless?this.curWords.NoneTarget:this.targetScore),this.M.S.styl(25,'#008000'));
		this.HUD.add(this.ScoreTS);
		this.HUD.add(this.TargetTS);
		this.HUD.visible=!1;
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
		twA.onComplete.add(function(){this.destroy},s);
		var twC=this.M.T.moveA(this.Player,{xy:{x:this.world.width*.2},start:!0});
		twC.onComplete.add(this.play,this);
		this.HUD.visible=!0;
	},
	play:function(){
		this.FollowEff.start(!1,1E3,3*this.time.physicsElapsedMS);
		this.Player.body.collideWorldBounds=!0;
		this.Player.body.gravity.y=500;
		this.start();
	},
	genEnd:function(){
		var styl=this.M.S.styl(45,'#ff0000');
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*2,this.isClear?this.curWords.Clear:this.curWords.GameOver,styl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		if(!this.isClear){
			this.time.events.add(500,function(){this.M.SE.play('GameOver',{volume:1.5})},this);
		}else{
			this.time.events.add(500,function(){this.M.SE.play('Clear',{volume:1})},this);
		}
		tw.start();
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			this.EndTS.visible=!1;
		},this);
		tw.start();

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.3,this.curStageInfo.name+'\n'+(this.isClear?this.curWords.Clear:this.curWords.GameOver),this.M.S.styl(40,'#c71585')));

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
			myGa('again','Play','Stage_'+this.M.G.curStage,this.M.G.playCount);
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='🤤🤤🤤🤤🤤🤤';
			var res=this.curStageInfo.name+': '+(this.isClear?this.curWords.Clear:this.curWords.GameOver)+'\n'
					+(this.curStageInfo.endless?this.curWords.Score+this.score+'\n':'');
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Stage_'+this.M.G.curStage,this.M.G.playCount);
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('Back',{volume:1});
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
			this.Tween.start();
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('othergames','Play','Stage_'+this.M.G.curStage,this.M.G.playCount);
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Stage_'+this.M.G.curStage,this.M.G.playCount);
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Stage_'+this.M.G.curStage,this.M.G.playCount);
		}
	},
};