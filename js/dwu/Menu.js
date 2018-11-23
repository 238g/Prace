BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		// Val
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:.8});
		this.genContents();
		this.genMenu();
	},
	genContents:function(){
		var e=this.add.emitter(this.world.centerX,this.world.centerY,50);
		e.makeParticles('title');
		e.setScale(.2,2,.2,2,500);
		e.setAlpha(1,0,800);
		e.setXSpeed(-700,700);
		e.setYSpeed(-400,400);
		e.gravity.x=0;
		e.gravity.y=0;
		e.start(!1,1E3,6*this.time.physicsElapsedMS);

		var bg=this.add.sprite(this.world.centerX,this.world.height,'dwu3');
		bg.anchor.setTo(.5,1);
		bg.smoothed=!0;
	},
	genMenu:function(){
		var title=this.add.sprite(this.world.centerX,this.world.height*.1,'title');
		title.anchor.setTo(.5);
		title.scale.setTo(.2);

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.centerX,this.world.height*.8,this.start,this.curWords.Start,styl,0xff0000);
		this.M.S.lbl(this.world.width*.2,this.world.height*.9,this.credit,'Credit',styl,0xffd700);
		this.M.S.lbl(this.world.width*.8,this.world.height*.9,this.othergames,this.curWords.OtherGames,styl,0xffd700);
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnBtn',{volume:1});
				var wp=this.add.sprite(0,0,'wp');
				wp.width=this.world.width;
				wp.height=this.world.height;
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:.8});
			this.inputEnabled=!0;
		}
	},
	credit:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=__VTUBER_GAMES+'?page=credit';
		if(this.curLang=='en')url+='&lang=en';
		window.open(url,"_blank");
		myGa('external_link','Title','Credit',this.M.G.playCount);
	},
	othergames:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=__VTUBER_GAMES;
		if(this.curLang=='en')url+='?lang=en';
		window.open(url,"_blank");
		myGa('othergames','Title','OtherGames',this.M.G.playCount);
	},
	genHUD:function(){
		var y=this.world.height*.08;
		this.M.S.vol(this.world.width*.08,y,0x5B3A6E);
		this.M.S.flsc(this.world.width*.92,y,0x5B3A6E);
	},
};
BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.StageInfo=this.M.G.StageInfo;
		// Val
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:.8});

		this.add.sprite(0,0,'bg'+this.rnd.between(2,9));

		var styl=this.M.S.styl(25,'#B66CE2');
		for(var k in this.StageInfo){
			var info=this.StageInfo[k];
			var lbl=this.M.S.lbl(this.world.width*.75,this.world.height*.15+this.world.height*.15*k,this.start,info.name,styl,0xB66CE2);
			lbl.stage=k;
		}

		this.M.S.lbl(this.world.width*.15,this.world.height*.9,this.back,this.curWords.Back,null,0x00ff00);
		this.genHUD();
	},
	start:function(b){
		if (!this.Tween.isRunning) {
			this.M.G.playCount++;
			this.M.G.curStage=b.stage;
			this.M.SE.play('OnStart',{volume:1});
			var wp=this.add.sprite(0,0,'wp');
			wp.width=this.world.width;
			wp.height=this.world.height;
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectStage','Stage_'+this.M.G.curStage,this.M.G.playCount);
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
			this.M.SE.play('Back',{volume:1});
		}
	},
	genHUD:function(){
		var y=this.world.height*.08;
		this.M.S.vol(this.world.width*.08,y,0x5B3A6E);
		this.M.S.flsc(this.world.width*.92,y,0x5B3A6E);
	},
};