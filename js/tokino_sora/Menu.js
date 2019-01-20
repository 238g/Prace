BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.isPlaying=this.inputEnabled=!1;
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		// this.genBg();

		// var title=this.add.sprite(this.world.centerX,this.world.height*.3,'title');
		// title.anchor.setTo(.5);
		// this.M.T.stressA(title,{delay:800}).start();

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.width*.73,this.world.height*.85,this.start,this.curWords.Start,styl,0x00ff00);
		this.M.S.lbl(this.world.width*.27,this.world.height*.85,this.credit,'Credit',styl,0xffd700);
		this.M.S.txt(this.world.centerX,this.world.height*.95,'MMD: (c) Tokino Sora Ch.',styl);

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genBg:function(){
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.G.playCount++;
				this.M.SE.play('OnBtn',{volume:1});
				var wp=this.add.sprite(0,0,'wp');
				wp.width=this.world.width;
				wp.height=this.world.height;
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
				this.Tween.start();
				myGa('start','Title','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	credit:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=__VTUBER_GAMES+'?page=credit';
		if(this.curLang=='en')url+='&lang=en';
		window.open(url,'_blank');
		myGa('external_link','Title','Credit',this.M.G.playCount);
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=this.M.G.yt;
		this.game.device.desktop?window.open(url,'_blank'):location.href=url;
		myGa('youtube','Title','PlayCount_'+this.M.G.playCount,this.M.G.playCount);
	},
	genHUD:function(){
		var y=this.world.height*.1;
		this.M.S.vol(this.world.width*.1,y,this.M.G.MAIN_TINT);
		this.M.S.flsc(this.world.width*.9,y,this.M.G.MAIN_TINT);
	},
};
