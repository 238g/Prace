BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.isPlaying=this.inputEnabled=!1;
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.StartL=this.LangL=this.MvL=null;
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		var bg=this.add.sprite(this.world.centerX,this.world.centerY,'bg1');
		bg.anchor.setTo(.5);

		var title=this.add.sprite(this.world.centerX,this.world.height*.1,'title');
		title.anchor.setTo(.5);
		this.time.events.add(214,function(){this.M.T.beatA(title,{duration:214,start:!0})},this);

		var styl=this.M.S.styl(25);
		this.StartL=this.M.S.lbl(this.world.width*.73,this.world.height*.85,this.start,this.curWords.Start,styl,0x00ff00);
		this.M.S.lbl(this.world.width*.27,this.world.height*.85,this.credit,'Credit',styl,0xffd700);
		this.LangL=this.M.S.lbl(this.world.width*.27,this.world.height*.95,this.chLang,this.curWords.Lang,styl,0xffd700);
		this.MvL=this.M.S.lbl(this.world.width*.73,this.world.height*.95,this.yt,this.curWords.WatchThisMv,styl,0xff0000);

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
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
		window.open(url,"_blank");
		myGa('external_link','Title','Credit',this.M.G.playCount);
	},
	chLang:function(){
		this.M.G.curLang=(this.M.G.curLang=='en'?'jp':'en');
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.StartL.chT(this.curWords.Start);
		this.LangL.chT(this.curWords.Lang);
		this.MvL.chT(this.curWords.WatchThisMv);
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='https://www.youtube.com/watch?v=u69gnXUzFhk';
		window.open(url,"_blank");
		myGa('youtube','Title','WatchThisMv',this.M.G.playCount);
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.vol(this.world.width*.8,y,0xff0000);
		this.M.S.flsc(this.world.width*.9,y,0xff0000);
	},
};