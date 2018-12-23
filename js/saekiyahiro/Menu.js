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
		this.stage.backgroundColor='#000';
		// this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.genBg();

		var title=this.add.sprite(this.world.centerX,this.world.centerY,'title');
		title.anchor.setTo(.5);
		this.M.T.beatA(title,{duration:500,start:!0});

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.width*.73,this.world.height*.8,this.start,this.curWords.Start,styl);
		this.M.S.lbl(this.world.width*.27,this.world.height*.8,this.credit,'Credit',styl);

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genBg:function(){
		var mx=this.world.width/5;
		var my=this.world.height/6;
		var road=[
			[1,1,1,1,1],
			[1,2,3,2,3],
			[1,2,3,1,1],
			[2,3,2,3,1],
			[1,1,1,2,3],
			[4,4,1,4,4],
		];
		for(var i=0;i<5;i++){
			for(var j=0;j<6;j++){
				this.add.sprite(i*mx,j*my,'road_'+road[j][i]);
			}
		}
		var arr=[];
		for(var i=1;i<=5;i++)arr.push('yahiro_'+i);
		var e=this.add.emitter(this.world.centerX,0,100);
		e.width=this.world.width;
		e.makeParticles(arr);
		e.setYSpeed(100,300);
		e.setXSpeed(0,0);
		e.minRotation=0;
		e.maxRotation=0;
		e.start(!1,5E3,this.time.physicsElapsedMS*10,0);
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
		window.open(url,"_blank");
		myGa('external_link','Title','Credit',this.M.G.playCount);
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.vol(this.world.width*.1,y,this.M.G.MAIN_TINT);
		this.M.S.flsc(this.world.width*.9,y,this.M.G.MAIN_TINT);
	},
};