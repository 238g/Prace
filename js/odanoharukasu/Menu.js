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
		//// this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.stage.backgroundColor='#000';
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.genContents();

		var title=this.add.sprite(this.world.width*.31,this.world.height*.5,'title');
		title.anchor.setTo(.5);

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.centerX,this.world.height*.8,this.start,this.curWords.Start,styl,0x00ff00);
		this.M.S.lbl(this.world.width*.2,this.world.height*.9,this.credit,'Credit',styl,0xffd700);
		this.M.S.lbl(this.world.width*.8,this.world.height*.9,this.othergames,this.curWords.OtherGames,styl,0xffd700);
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genContents:function(){
		this.add.sprite(0,0,'bg1');
		this.BgS=this.add.sprite(this.world.centerX,this.world.centerY,'bg2');
		this.BgS.anchor.setTo(.5);
		this.BgS.visible=!1;
		this.Haruto=this.add.button(this.world.centerX,this.world.centerY,'haruto2',this.don,this);
		this.Haruto.anchor.setTo(.5);
		this.Nobuhime=this.add.button(this.world.width*.8,this.world.height*.75,'nobuhime1',this.don,this);
		this.Nobuhime.anchor.setTo(.5);
		this.isPlaying=!0;
	},
	don:function(){
		if(this.isPlaying&&this.inputEnabled&&!this.Tween.isRunning){
			this.isPlaying=!1;
			var duration=200;
			var tw=this.M.T.moveB(this.Nobuhime,{xy:{x:this.world.width*.6,y:this.world.centerY},duration:duration,start:!0});
			this.add.tween(this.Nobuhime.scale).to({x:.5,y:.5},duration,null,!0);
			tw.onComplete.add(function(){
				this.Haruto.loadTexture('haruto1');
				var duration=400;
				var tw=this.M.T.moveB(this.Nobuhime,{xy:{x:this.world.centerX},duration:duration,start:!0});
				this.add.tween(this.Nobuhime.scale).to({x:0,y:0},duration,null,!0);
				this.add.tween(this.Haruto.scale).to({x:0,y:0},duration,null,!0);
				tw.onComplete.add(function(){
					this.BgS.visible=!0;
					this.camera.shake(.03,600,!0,Phaser.Camera.SHAKE_BOTH);
					this.time.events.add(3E3,this.donReset,this);
				},this);
			},this);
		}
	},
	donReset:function(){
		this.BgS.visible=!1;
		this.Haruto.loadTexture('haruto2');
		this.Haruto.scale.setTo(1);
		this.Nobuhime.x=this.world.width*.8;
		this.Nobuhime.y=this.world.height*.75;
		this.Nobuhime.scale.setTo(1);
		this.isPlaying=!0;
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
		this.M.S.vol(this.world.width*.08,y,0x00ff00);
		this.M.S.flsc(this.world.width*.92,y,0x00ff00);
	},
};