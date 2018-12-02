BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.CharInfo=this.M.G.CharInfo;
		// Val
		this.ninjaFirstPos={x:this.world.width*.85,y:0};
		this.placedPoles=0;
		this.ninjaJumpPower=0;
		this.score=0;
		this.minPoleX=0;
		this.curCharStockOrder=0;
		this.charStock=[1,2,3,1,2,3];
		this.curChar=this.charStock[this.curCharStockOrder];
		this.curCharInfo=this.CharInfo[this.curChar];
		this.poleYMin=this.world.height*.6;
		this.poleYMax=this.world.height*.95;
		this.nextPolePosMinX=this.world.width*.15;
		this.nextPolePosMaxX=this.world.width*.4;
		this.arrHP=[];
		this.poleBaseWidth=80;

		// Obj
		this.BgS=this.NinjaS=this.PowerBarS=this.PoleGroup=
		this.HUD=this.HowToS=this.ScoreTS=
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
	renderT:function(){
		this.game.debug.body(this.NinjaS);
		this.PoleGroup.forEachAlive(function(c){this.game.debug.body(c)},this);
	},
	update:function(){
		if(this.isPlaying){
			if(this.NinjaS.st=='jumping'){
				if(this.NinjaS.y>this.world.height)return this.die();
				this.PoleGroup.forEachAlive(function(c){
					c.body.velocity.x=-this.ninjaJumpPower;
					if(c.x>this.world.width+c.width){
						this.resetPole(c);
					}
				},this);
				this.BgS.tilePosition.x-=this.ninjaJumpPower*.001;
			}
			if((this.NinjaS.y>this.world.height||this.NinjaS.x>this.world.width)&&this.NinjaS.st!='dead')return this.die();
			if(this.NinjaS.st!='dead'&&this.NinjaS.st!='dying')this.physics.arcade.collide(this.NinjaS,this.PoleGroup,this.checkLanding,null,this);
		}
	},
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.BgS=this.add.tileSprite(0,0,this.world.width,this.world.height,'bg2');
		this.PoleGroup=this.add.group();
		this.genNinja();
		this.genPowerBar();
		this.genHUD();
	},
	genNinja:function(){
		this.NinjaS=this.add.sprite(this.ninjaFirstPos.x,this.ninjaFirstPos.y,this.curChar+'_2');
		this.NinjaS.anchor.setTo(.5);
		this.NinjaS.smoothed=!1;
		this.NinjaS.lastPole=1;
		this.NinjaS.st='respawn';
		this.physics.arcade.enable(this.NinjaS,Phaser.Physics.ARCADE);
		this.NinjaS.body.gravity.y=800;
		this.NinjaS.body.setSize(this.NinjaS.width*.5,this.NinjaS.height,this.NinjaS.width*.1,0);
		this.NinjaS.kill();

		this.input.onDown.add(this.prepareToJump,this);
		this.input.onUp.add(this.jump,this);
		this.addPole(this.ninjaFirstPos.x);
		// console.log(this.NinjaS.st,' is First');
	},
	prepareToJump:function(){
		if(this.NinjaS.body.velocity.y==0&&this.NinjaS.st=='landing'){
			// console.log(this.NinjaS.st,'=>prepare');
			this.NinjaS.st='prepare';
			this.PowerBarS.x=this.NinjaS.left;
			this.PowerBarS.y=this.NinjaS.top;
			this.PowerBarS.visible=!0;
			this.Tween=this.add.tween(this.PowerBarS).to({width:100},1E3,null,!0,0,-1,!0);
		}
	},
	jump:function(){
		if(this.NinjaS.body.velocity.y==0&&this.NinjaS.st=='prepare'){
			// console.log(this.NinjaS.st,'=>jumping');
			this.NinjaS.st='jumping';
			this.Tween.stop();
			this.ninjaJumpPower=-this.PowerBarS.width*3-100;
			this.PowerBarS.visible=!1;
			this.NinjaS.body.velocity.y=this.ninjaJumpPower*2;
			this.PowerBarS.width=0;
			this.NinjaS.loadTexture(this.curChar+'_2');
			this.M.SE.play('jump',{volume:1});
		}
	},
	die:function(){
		// console.log(this.NinjaS.st,'=>dead');
		this.NinjaS.st='dead';
		this.stopPole();

		this.M.SE.play('die',{volume:1});
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);

		this.arrHP[this.curCharStockOrder].visible=!1;

		if(this.changeChar()){
			for(var k in this.arrHP){
				this.arrHP[k].x-=this.arrHP[k].width+10;
			}
			this.time.events.add(500,this.restartGame,this);
			this.time.events.add(1E3,this.respawnNinja,this);
		}else{
			return this.gameOver();
		}
	},
	changeChar:function(){
		this.curCharStockOrder++;
		if(this.charStock.length==this.curCharStockOrder){
			return false;
		}
		this.curChar=this.charStock[this.curCharStockOrder];
		this.curCharInfo=this.CharInfo[this.curChar];
		return true;
	},
	restartGame:function(){
		this.PoleGroup.removeAll();
		this.placedPoles=0;
		this.NinjaS.lastPole=1;
		this.NinjaS.loadTexture(this.curChar+'_2');
		this.PowerBarS.tint=this.curCharInfo.tint;
		this.CharTS.chT(this.curCharInfo.name);
		this.CharTS.chS(this.M.S.styl(25,this.curCharInfo.color));
		this.addPole(this.ninjaFirstPos.x);
	},
	respawnNinja:function(){
		// console.log(this.NinjaS.st,'=>respawn');
		this.NinjaS.st='respawn';
		this.NinjaS.reset(this.ninjaFirstPos.x,this.ninjaFirstPos.y);
	},
	addPole:function(poleX){
		if(poleX>-this.world.width*2){
			this.placedPoles++;
			var y=this.rnd.between(this.poleYMin,this.poleYMax);
			var pole=this.add.sprite(poleX,y,'log');
			pole.smoothed=!1;
			this.physics.enable(pole,Phaser.Physics.ARCADE);
			pole.body.immovable=!0;
			pole.body.setSize(pole.width,pole.height*.95,0,pole.height*.05);
			pole.poleNum=this.placedPoles;
			pole.anchor.setTo(.5,0);
			this.resizePole(pole);
			this.PoleGroup.add(pole);
			var nextPolePos=poleX-this.rnd.between(this.nextPolePosMinX,this.nextPolePosMaxX);
			this.addPole(nextPolePos);
		}
	},
	resizePole:function(pole){
		if(this.score>300){
			pole.width=this.poleBaseWidth*.5;
		}else if(this.score>250){
			pole.width=this.poleBaseWidth*.6;
		}else if(this.score>200){
			pole.width=this.poleBaseWidth*.7;
		}else if(this.score>150){
			pole.width=this.poleBaseWidth*.8;
		}else if(this.score>100){
			pole.width=this.poleBaseWidth*.9;
		}
	},
	resetPole:function(pole){
		pole.kill();
		this.minPoleX=0;
		this.PoleGroup.forEachAlive(function(c){
			this.minPoleX=Math.min(c.x,this.minPoleX);
		},this);
		var nextPolePos=this.minPoleX-this.rnd.between(this.nextPolePosMinX,this.nextPolePosMaxX);
		var y=this.rnd.between(this.poleYMin,this.poleYMax);
		this.placedPoles++;
		pole.poleNum=this.placedPoles;
		pole.reset(nextPolePos,y);
		this.resizePole(pole);
	},
	genPowerBar:function(){
		this.PowerBarS=this.add.sprite(this.NinjaS.left,this.NinjaS.top,'w');
		this.PowerBarS.width=100;
		this.PowerBarS.height=20;
		this.PowerBarS.tint=this.curCharInfo.tint;
		this.PowerBarS.anchor.setTo(0,1);
		this.PowerBarS.visible=!1;
		this.PowerBarS.width=0;
	},
	checkLanding:function(n,p){
		if(n.st!='landing'&&n.st!='prepare'){
			if(Math.floor(p.body.y)>=Math.floor(n.y+n.height/2)){
				var poleDiff=p.poleNum-n.lastPole;
				if(poleDiff>0){
					this.score+=Math.pow(2,poleDiff);
					this.ScoreTS.chT(this.curWords.ScoreFront+this.score);
					n.lastPole=p.poleNum;
				}
				if(n.st=='jumping'||n.st=='respawn'){
					// console.log(n.st,'=>landing');
					n.st='landing';
					this.stopPole();
					this.NinjaS.loadTexture(this.curChar+'_1');
					this.M.SE.play('landing',{volume:1});
				}
				if(this.NinjaS.x!=this.ninjaFirstPos.x)this.NinjaS.x=this.ninjaFirstPos.x;
			}else{
				// console.log(n.st,'=>dying');
				n.st='dying';
				this.stopPole();
				this.M.SE.play('hit_log',{volume:1});
			}
		}
	},
	stopPole:function(){
		this.PoleGroup.forEachAlive(function(c){
			c.body.velocity.x=0;
		},this);
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.world.width*.7,this.world.height*.1,this.curWords.ScoreFront+0,this.M.S.styl(25,'#008000'));
		this.CharTS=this.M.S.txt(this.world.width*.9,this.world.height*.95,this.curCharInfo.name,this.M.S.styl(25,this.curCharInfo.color));
		this.HUD.add(this.ScoreTS);
		this.genHP();
		this.HUD.visible=!1;
	},
	genHP:function(){
		var marginX=0;
		for(var k in this.charStock){
			var charNum=this.charStock[k];
			var s=this.add.sprite(10+(marginX+10)*k,10,'face_'+charNum);
			marginX=s.width;
			this.HUD.add(s);
			this.arrHP.push(s);
		}
	},
	///////////////////////////////////////////////////////
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
			this.respawnNinja();
		},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.HUD.visible=!0;
		this.M.SE.playBGM('PlayBGM',{volume:1});
		this.M.SE.play('start',{volume:1});
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	genEnd:function(){
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.End,this.M.S.styl(50,'#dc143c'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		twA.onComplete.add(function(){this.genRes()},this);
		this.HUD.add(s);
		this.M.SE.play('start',{volume:1});
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
		tw.onStart.add(function(){this.M.SE.play('fin',{volume:1})},this);

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.3,this.curWords.ScoreFront+this.score,this.M.S.styl(40,'#dc143c')));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		s.addChild(this.M.S.lbl(lX,this.world.height*.55,this.again,this.curWords.Again,this.M.S.styl(25,'#00fa9a'),0x00fa9a));
		s.addChild(this.M.S.lbl(rX,this.world.height*.55,this.tweet,this.curWords.TwBtn,this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(lX,this.world.height*.7,this.back,this.curWords.Back,this.M.S.styl(25,'#8a2be2'),0x8a2be2));
		s.addChild(this.M.S.lbl(rX,this.world.height*.7,this.othergames,this.curWords.OtherGames,this.M.S.styl(25,'#ffa500'),0xffa500));

		var arrX=[this.world.width*.2,this.world.centerX,this.world.width*.8];
		var y=this.world.height*.88;
		for(var k in this.CharInfo){
			var info=this.CharInfo[k];
			var lbl=this.M.S.lbl(arrX[k-1],y,this.tw,info.name,this.M.S.styl(25,info.color),info.tint)
			lbl.charNum=k;
			s.addChild(lbl);
		}
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
			var e='🌄🌄🌄🌄🌄🌄';
			var res=this.curWords.ScoreFront+this.score+'\n';
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
	tw:function(b){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.CharInfo[b.charNum].tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','SelectChar_'+b.charNum,this.M.G.playCount);
		}
	},
};