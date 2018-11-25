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
		this.genContents();
		this.genMenu();
	},
	genContents:function(){
	},
	genMenu:function(){
		var bg=this.add.sprite(this.world.centerX,this.world.height,'icotsu7');
		bg.anchor.setTo(.5,1);
		bg.scale.setTo(2.2);
		bg.alpha=.5;

		var title=this.add.sprite(this.world.centerX,this.world.height*.18,'title');
		title.anchor.setTo(.5);

		var tamakin1=this.add.sprite(this.world.width*.62,this.world.height*.82,'tamakin1');
		tamakin1.anchor.setTo(.5,1);

		var tamakin2=this.add.sprite(this.world.width*.18,this.world.height*.82,'tamakin2');
		tamakin2.anchor.setTo(.5,1);

		this.time.events.add(100,function(){
			this.M.T.moveC(tamakin2,{xy:{y:'-20'},duration:254,start:!0});
		},this);

		this.time.events.add(16610,function(){//100+254*65
			this.M.T.moveC(tamakin1,{xy:{y:'-20'},duration:254,start:!0});
		},this);

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.width*.75,this.world.height*.9,this.start,this.curWords.Start,styl,0x00ff00);
		this.M.S.lbl(this.world.width*.25,this.world.height*.9,this.credit,'Credit',styl,0xffd700);
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.G.playCount++;
				this.M.SE.play('OnStart',{volume:1});
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
	othergames:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=__VTUBER_GAMES;
		if(this.curLang=='en')url+='?lang=en';
		window.open(url,"_blank");
		myGa('othergames','Title','OtherGames',this.M.G.playCount);
	},
	genHUD:function(){
		var y=this.world.height*.08;
		this.M.S.vol(this.world.width*.08,y,0xff0000);
		this.M.S.flsc(this.world.width*.92,y,0xff0000);
	},
};