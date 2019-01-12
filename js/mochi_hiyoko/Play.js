BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.curLevel=this.M.G.curLevel;
		this.LevelInfo=this.M.G.LevelInfo;
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.respawnTimer=this.curLevelInfo.respawnTimer;
		this.killCount=0;
		this.HP=10;
		// Obj
		this.Weapon=this.Line=this.Player=
		this.WeaponCollisionGroup=this.NmeCollisionGroup=
		this.HowToS=this.KillCountTS=this.LevelTS=this.HPTS=this.HUD=this.EndTS=
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
			// this.Weapon.body.debug=!0;
			// this.Player.body.debug=!0;
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			// if(getQuery('res'))
		}
	},
	update:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.curLevelInfo.respawnTimer;
				for(var i=0;i<this.curLevelInfo.respawnCount;i++)this.respawnNme();
				if(this.Player.x<=0||this.world.width<=this.Player.x||this.Player.y<=0||this.world.height<=this.Player.y)this.damage();
			}
		}
	},
	genContents:function(){
		this.genBg();
		this.setPhysics();
		this.genWeapon();
		this.genPlayer();
		this.genNme();
		this.genHUD();
	},
	genBg:function(){
		var bgs=this.add.group();
		for(var i=1;i<=19;i++){
			var s=this.add.sprite(0,0,'bg'+i);
			s.alpha=0;
			bgs.add(s);
		}
		bgs.shuffle();
		this.M.T.slideshow(bgs,{delay:3E3});
	},
	setPhysics:function(){
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.setImpactEvents(!0);
		this.physics.p2.restitution=.8;
		this.WeaponCollisionGroup=this.physics.p2.createCollisionGroup();
		this.PlayerCollisionGroup=this.physics.p2.createCollisionGroup();
		this.NmeCollisionGroup=this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
	},
	genWeapon:function(){
		this.Weapon=this.add.sprite(this.world.centerX+20,this.world.centerY+20,'weapon');
		this.Weapon.smoothed=!1;
		this.physics.p2.enable(this.Weapon,!1);
		this.Weapon.body.setCollisionGroup(this.WeaponCollisionGroup);
		this.Weapon.body.fixedRotation=!0;
		this.Weapon.body.collides(this.NmeCollisionGroup,this.attackNme,this);
	},
	attackNme:function(w,n){
		if(this.isPlaying){
			n.sprite.kill();
			this.killCount++;
			this.KillCountTS.chT(this.killCount+this.curWords.KillCount);
			this.levelUp();
			this.M.SE.play('attack'+this.rnd.between(1,3),{volume:1});
		}
	},
	levelUp:function(){
		if(this.curLevelInfo.nextLevel!=null&&this.curLevelInfo.nextLevel==this.killCount){
			this.curLevel++;
			this.curLevelInfo=this.LevelInfo[this.curLevel];
			if(this.curLevelInfo.nextLevel==null){
				this.LevelTS.chT('Level MAX');
			}else{
				this.LevelTS.chT('Level '+this.curLevel);
			}
			var tw=this.M.T.popUpA(this.LevelTS,{scale:{x:2,y:2},start:!0,duration:500});
			tw.yoyo(!0);
			this.M.SE.play('levelUp',{volume:1});
		}
	},
	genPlayer:function(){
		this.Player=this.add.sprite(this.world.centerX,this.world.centerY,'hiyoko');
		this.Player.smoothed=!1;
		this.physics.p2.enable(this.Player,!1);
		this.Player.body.setCircle(this.Player.width/3);
		this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
		this.Player.body.collides(this.NmeCollisionGroup,this.hitNme,this);
		this.Player.body.static=!0;
		this.physics.p2.createSpring(this.Player,this.Weapon,0,30,1);
		this.input.addMoveCallback(this.mouseMove,this);
	},
	hitNme:function(p,n){
		if(this.isPlaying){
			n.sprite.kill();
			this.damage();
			this.M.SE.play('hitNme',{volume:1});
		}
	},
	damage:function(){
			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
			this.HP--;
			this.HPTS.chT('HP'+this.HP);
			if(this.HP==0)this.gameOver();
	},
	gameOver:function(){
		this.physics.p2.removeSpring(this.Player);
		this.genEnd();
		this.end();
	},
	mouseMove:function(p,x,y/*,isDown*/){
		if(this.isPlaying){
			this.Player.body.x=x;
			this.Player.body.y=y;
		}
	},
	genNme:function(){
		var arr=[];
		for(var i=1;i<=7;i++)arr.push('otaku'+i);
		this.Nme=this.add.group();
		this.Nme.physicsBodyType=Phaser.Physics.P2JS;
		this.Nme.enableBody=!0;
		this.Nme.createMultiple(20,arr);
		this.Nme.forEach(function(s){
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.setCollisionGroup(this.NmeCollisionGroup);
			s.body.collides(this.WeaponCollisionGroup);
			s.body.collides(this.PlayerCollisionGroup);
			s.body.collideWorldBounds=!1;
		},this);
	},
	respawnNme:function(){
		var x,y,s=this.rnd.pick(this.Nme.children.filter(function(e){return!e.alive}));
		if(!s)s=this.rnd.pick(this.Nme.children);
		switch(this.rnd.between(1,4)){
			case 1:x=0;y=this.world.randomY;break;
			case 2:x=this.world.width;y=this.world.randomY;break;
			case 3:x=this.world.randomX;y=0;break;
			case 4:x=this.world.randomX;y=this.world.height;break;}
		s.reset(x,y);
		s.body.velocity.x=(this.Player.x-s.x)*this.curLevelInfo.speed;
		s.body.velocity.y=(this.Player.y-s.y)*this.curLevelInfo.speed;
		s.body.angularVelocity=this.rnd.between(0,5);
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.KillCountTS=this.M.S.txt(this.world.centerX,this.world.height*.96,this.killCount+this.curWords.KillCount);
		this.LevelTS=this.M.S.txt(this.world.centerX,this.world.height*.06,'Level '+this.curLevel);
		this.HPTS=this.M.S.txt(0,this.Player.height/2,'HP'+this.HP);
		this.Player.addChild(this.HPTS);
		this.HUD.add(this.KillCountTS);
		this.HUD.add(this.LevelTS);
		this.HUD.visible=!1;
		this.EndTS=this.M.S.txt(this.world.width*1.5,this.world.centerY,this.curWords.GameOver,this.M.S.styl(60,'#dc143c'));
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
		this.HUD.visible=!0;
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.Start,this.M.S.styl(50,'#0080FF'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.onComplete.add(function(){this.destroy},s);
		var twC=this.M.T.moveA(this.Player,{xy:{x:this.world.width*.2},start:!0});
		twC.onComplete.add(this.start,this);
		this.HUD.visible=!0;
		this.M.SE.play('OnStart',{volume:1});
	},
	genEnd:function(){
		var tw=this.M.T.moveX(this.EndTS,{xy:{x:this.world.centerX},start:!0,easing:Phaser.Easing.Exponential.Out});
		tw.onComplete.add(this.genRes,this);
		this.M.SE.play('end',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			this.EndTS.visible=!1;
		},this);
		tw.start();

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.2,this.curWords.Res,this.M.S.styl(40,'#3cb371')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.38,this.killCount,this.M.S.styl(60,'#dc143c')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.5,this.curWords.KillCount,this.M.S.styl(45,'#dc143c')));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		s.addChild(this.M.S.lbl(lX,this.world.height*.68,this.again,this.curWords.Again,this.M.S.styl(25,'#ffa500'),0xffd700));
		s.addChild(this.M.S.lbl(rX,this.world.height*.68,this.tweet,this.curWords.TwBtn,this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(lX,this.world.height*.78,this.back,this.curWords.Back,this.M.S.styl(25,'#2e8b57'),0x00fa9a));
		s.addChild(this.M.S.lbl(rX,this.world.height*.78,this.othergames,this.curWords.OtherGames,this.M.S.styl(25,'#ffa500'),0xffa500));
		s.addChild(this.M.S.lbl(lX,this.world.height*.88,this.tw,'Twitter',this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(rX,this.world.height*.88,this.yt,'YouTube',this.M.S.styl(25,'#ff0000'),0xff0000));
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
			myGa('again','Play','Result_'+this.curRes,this.M.G.playCount);
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var r=this.rnd.between(1,3);
			var e=r==1?'🐣🐣🐣🐣🐣🐣':r==2?'🐤🐤🐤🐤🐤🐤':'🐥🐥🐥🐥🐥🐥';
			var res=this.killCount+this.curWords.KillCount+'\n'+'Level: '+this.curLevel+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
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
			myGa('othergames','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
};