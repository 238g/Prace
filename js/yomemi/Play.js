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


		// Obj
		// this.Fire=this.Nme=
		// this.HUD=this.HowToS=this.ScoreTS=this.TimeTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';

		this.genContents();
		this.start();//TODO del
		// this.M.G.endTut?this.genStart():this.genTut();
		this.test();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			// this.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(this.respawnKerin,this);
			// this.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(this.respawnPandei,this);
		}
	},
	updateT:function(){
		if(this.isPlaying){
		}
	},
	genContents:function(){

		var arr=[
			[0,1,2,4],
			[0,1,2,4],
			[0,1,2,4],
			[0,1,2,4],
			[0,1,2,4],
			[0,1,2,4],
			[0,1,2,4],
			[0,1,2,4],
		];

		
		var res=[];
		for(var i=0;i<4;i++){
			res[i]=arr[0][i];
			for(var j=0;j<4;j++){
				res[i+'-'+j]=res[i]*arr[1][j];
				for(var k=0;k<4;k++){
					res[i+'-'+j+'-'+k]=res[i+'-'+j]*arr[2][k];
				}
				res[i+'-'+j]=null;
			}
			res[i]=null;
		}

		console.log(res);
		
		var res=[];
		for(var i=0;i<4;i++){
			res[i]=arr[0][i];
			/*
			for(var j=0;j<4;j++){
				res[i+'-'+j]=res[i]*arr[1][j];
				for(var k=0;k<4;k++){
					res[i+'-'+j+'-'+k]=res[i+'-'+j]*arr[2][k];
				}
				res[i+'-'+j]=null;
			}
			*/
			bbb(1,i,i+'-');
			res[i]=null;
		}

		function bbb (order,num,txt) {
			if(order>2)return;
			for(var j=0;j<4;j++){
				res[txt+j]=res[num]*arr[order][j];
			}
			order++;
			for(var j=0;j<4;j++){
				bbb(order,j,txt+j+'-');
				// res[txt+j]=null;
			}
		}

		console.log(res);
		// this.genHUD();
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.Fire.x,this.Fire.bottom,this.curWords.ScoreFront+0+this.curWords.ScoreBack,this.M.S.styl(25,'#008000'));
		this.TimeTS=this.M.S.txt(this.world.centerX,this.world.height*.05,this.curWords.Time+':'+this.leftTime,this.M.S.styl(25,'#1e90ff'));
		this.HUD.add(this.ScoreTS);
		this.HUD.add(this.TimeTS);
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
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		// this.M.SE.play('start',{volume:1});
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
		// this.M.SE.play('fin',{volume:1});
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
		// tw.onStart.add(function(){this.M.SE.play('start',{volume:1})},this);

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
			var e='3333333333333333333';
			var res='oooooooooooooooooooooo';
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