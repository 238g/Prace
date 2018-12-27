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
		// this.stage.backgroundColor='#000';
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});

		// var title=this.add.sprite(this.world.centerX,this.world.centerY,'title');
		// title.anchor.setTo(.5);
		// this.M.T.beatA(title,{duration:500,start:!0});

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.width*.73,this.world.height*.8,this.start,this.curWords.Start,styl);
		this.M.S.lbl(this.world.width*.27,this.world.height*.8,this.credit,'Credit',styl);

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.G.playCount++;
				// this.M.SE.play('OnBtn',{volume:1});
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
			// this.M.SE.playBGM('TitleBGM',{volume:1});
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
		var y=this.world.height*.1;
		//TODO
		this.M.S.vol(this.world.width*.1,y,0xff0000);
		this.M.S.flsc(this.world.width*.9,y,0xff0000);
	},
};

BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.isPlaying=this.inputEnabled=!1;
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.CharInfo=this.M.G.CharInfo;
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';

		//TODO header text
		//TODO back btn
		this.genPanel();
	},
	genPanel:function(){
		//TODO-------------------------------------------------------
		var arr=[];
		for(var i=1;i<=Object.keys(this.CharInfo).length;i++)arr.push(i);
		Phaser.ArrayUtils.shuffle(arr);
		var rest,charNum,b,info,
			sx=10,
			sy=this.world.height*.25,
			mx=this.world.width/5,
			my=this.world.width*.2,
			row=0,
			count=0;

		for(var k in arr){
			charNum=arr[k];
			rest=count%5;
			info=this.CharInfo[charNum];
			this.M.S.bmpSq(mx*rest+sx,my*row+sy,100,100,rndColor());

			if(rest==4)row++;
			if(row==2){
				row=0;
				sx+=this.world.width;
			}
			count++;
		}
		//TODO-------------------------------------------------------
	},
};
