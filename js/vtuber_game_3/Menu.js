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

		this.genBg();

		var title=this.add.sprite(this.world.centerX,this.world.height*.45,'title');
		title.anchor.setTo(.5);
		this.M.T.beatA(title,{duration:500,start:!0});

		var styl=this.M.S.styl(25);
		this.M.S.lbl(this.world.width*.73,this.world.height*.8,this.start,this.curWords.Start,styl,0x00ff00);
		this.M.S.lbl(this.world.width*.27,this.world.height*.8,this.credit,'Credit',styl,0xffd700);

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genBg:function(){
		var arr=[];
		for(var k in this.M.G.CharInfo)arr.push('char_'+k);
		var e=this.add.emitter(this.world.width*.2,this.world.height*.1,100);
		e.makeParticles(arr);
		e.start(!1,4E3,this.time.physicsElapsedMS*20,0);
		this.add.tween(e).to({x:this.world.width*.8},3E3,null,!0,0,-1,!0);
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
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
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
	genHUD:function(){
		var y=this.world.height*.1;
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
		// Val
		this.charLength=Object.keys(this.CharInfo).length;
		this.colMax=5;
		this.rowMax=2;
		this.maxPage=Math.ceil(this.charLength/(this.colMax*this.rowMax));
		this.curPage=1;
		// Obj
		this.TileS=this.LeftB=this.RightB=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.TileS=this.add.tileSprite(0,0,this.world.width*this.maxPage,this.world.height,'wp');
		this.TileS.tint=0xeeeeee;

		this.M.S.txt(this.world.centerX,this.world.height*.1,this.curWords.SelectChar,this.M.S.styl(40,'#ffa500'));

		this.genArrowBtn();
		this.genPanel();

		this.M.S.lbl(this.world.centerX,this.world.height*.9,this.back,this.curWords.Back,this.M.S.styl(25,'#2e8b57'),0x00fa9a);
		this.genHUD();
		this.time.events.add(300,function(){this.inputEnabled=!0},this);
	},
	genPanel:function(){
		var arr=[];
		for(var i=1;i<=this.charLength;i++)arr.push(i);
		Phaser.ArrayUtils.shuffle(arr);
		var rest,charNum,b,info,
			sx=20,
			sy=this.world.height*.22,
			mx=this.world.width/this.colMax,
			my=this.world.width*.18,
			row=0,
			count=0,
			styl=this.M.S.stylS(15);
		for(var k in arr){
			charNum=arr[k];
			rest=count%this.colMax;
			info=this.CharInfo[charNum];
			var b=this.add.button(mx*rest+sx,my*row+sy,'char_'+charNum,this.select,this);
			b.charNum=charNum;
			this.TileS.addChild(b);

			var ts=this.M.S.txt(b.width/2,b.height,info.name,styl);
			b.addChild(ts);

			if(rest==(this.colMax-1))row++;
			if(row==this.rowMax){
				row=0;
				sx+=this.world.width;
			}
			count++;
		}
	},
	genArrowBtn:function(){
		this.LeftB=this.add.button(this.world.width*.1,this.world.height*.9,'GameIconsWhite',this.page,this,'arrowLeft','arrowLeft','arrowLeft','arrowLeft');
		this.LeftB.tint=0x228b22;
		this.LeftB.anchor.setTo(.5);
		this.LeftB.fn='left';
		this.LeftB.visible=!1;
		this.RightB=this.add.button(this.world.width*.9,this.world.height*.9,'GameIconsWhite',this.page,this,'arrowRight','arrowRight','arrowRight','arrowRight');
		this.RightB.tint=0x228b22;
		this.RightB.anchor.setTo(.5);
		this.RightB.fn='right';
	},
	page:function(b){
		if(!this.Tween.isRunning){
			if(b.fn=='right'){
				if(this.curPage!=this.maxPage){
					this.Tween=this.M.T.moveB(this.TileS,{xy:{x:'-'+this.world.width},duration:500});
					this.Tween.start();
					this.curPage++;
					if(!this.LeftB.visible)this.LeftB.visible=!0;
					if(this.curPage==this.maxPage)this.RightB.visible=!1;
				}
			}else{
				if(this.curPage!=1){
					this.Tween=this.M.T.moveB(this.TileS,{xy:{x:'+'+this.world.width},duration:500});
					this.Tween.start();
					this.curPage--;
					if(!this.RightB.visible)this.RightB.visible=!0;
					if(this.curPage==1)this.LeftB.visible=!1;
				}
			}
			this.M.SE.play('page',{volume:1});
		}
	},
	select:function(b){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.G.curChar=b.charNum;
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
			this.Tween.start();
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
	genHUD:function(){
		var y=this.world.height*.1;
		this.M.S.vol(this.world.width*.1,y,0xff0000);
		this.M.S.flsc(this.world.width*.9,y,0xff0000);
	},
};

BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
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

		var s=this.add.sprite(this.world.centerX,this.world.centerY,this.M.G.curChar+'_full');
		s.anchor.setTo(.5);

		this.M.S.txt(this.world.centerX,this.world.height*.1,this.curWords.SelectStage,this.M.S.styl(40,'#ffa500'));

		var sx=this.world.width*.2,
			mx=this.world.width*.3,
			y=this.world.height*.65,
			color=[{a:'#32cd32',b:0x00ff00},{a:'#ff8c00',b:0xffd700},{a:'#dc143c',b:0xff6347}],
			i=0;
		for(var k in this.M.G.PuzzleInfo){
			var info=this.M.G.PuzzleInfo[k];
			var lbl=this.M.S.lbl(mx*i+sx,y,this.select,info.col+'x'+info.row+this.curWords.Piece,this.M.S.styl(25,color[i].a),color[i].b);
			lbl.puzzleNum=k;
			i++;
		}

		this.M.S.lbl(this.world.centerX,this.world.height*.9,this.back,this.curWords.Back,this.M.S.styl(25,'#2e8b57'),0x00fa9a);
		this.genHUD();
		this.time.events.add(300,function(){this.inputEnabled=!0},this);
		this.genHUD();
	},
	select:function(b){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.G.playCount++;
			this.M.G.curPuzzle=b.puzzleNum;
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('start','SelectStage','Char_'+this.M.G.curChar+';Puzzle_'+this.M.G.curPuzzle,this.M.G.playCount);
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
		}
	},
	genHUD:function(){
		var y=this.world.height*.1;
		this.M.S.vol(this.world.width*.1,y,0xff0000);
		this.M.S.flsc(this.world.width*.9,y,0xff0000);
	},
};
