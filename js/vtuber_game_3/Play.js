BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.PuzzleInfo=this.M.G.PuzzleInfo;
		this.curPuzzle=this.M.G.curPuzzle;
		// Val
		this.tickTimer=2E3;
		this.tickTime=0;

		// Obj
		this.PiecesGroup=
		this.HUD=this.TimeTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		// this.M.G.endTut?this.genStart():this.genTut();
		this.start();//TODO ---------
		this.genStart();//TODO ---------
		this.test();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			// if(getQuery('level'))
		}
	},
	update:function(){
		if(this.isPlaying){
			this.tickTimer-=this.time.elapsed;
			if(this.tickTimer<0){
				this.tickTimer=1E3;
				this.tickTime++;
				this.TimeTS.chT(this.curWords.TimeA+this.tickTime);
			}
		}
	},
	genContents:function(){
		var size=this.PuzzleInfo[this.curPuzzle].size;
		var piecesIndex=0;
		var col=3;
		var row=3;
		var pieceAmount=col*row;
		var shuffleArr=[];
		for(var i=0;i<pieceAmount;i++)shuffleArr.push(i);
		//IF THIS COMMENT OUT ==== END
		Phaser.ArrayUtils.shuffle(shuffleArr);
		this.PiecesGroup=this.add.group();
		for(var i=0;i<row;i++){
			for(var j=0;j<col;j++){
				if(shuffleArr[piecesIndex]){
				// if(shuffleArr[piecesIndex]>0){
					piece=this.PiecesGroup.create(j*size,i*size,'todo_1',shuffleArr[piecesIndex]);
					piece.inputEnabled=!0;
					piece.events.onInputDown.add(this.selectPiece,this);
				}else{
					// this.BlackPieceB
					piece=this.PiecesGroup.create(j*size,i*size);
					// piece=this.PiecesGroup.create(j*size,i*size,'todo_1',shuffleArr[piecesIndex]);
					// piece.tint=0x000000;
					piece.black=!0;
				}
				piece.name='piece'+i.toString()+'x'+j.toString();
				piece.curIndex=piecesIndex;
				piece.destIndex=shuffleArr[piecesIndex];
				piece.posX=j;
				piece.posY=i;
				piecesIndex++;
			}
		}




		this.genHUD();
	},
	selectPiece:function(piece){
		if(this.isPlaying){
			var blackPiece=this.canMove(piece);
			if(blackPiece){
				this.movePiece(piece,blackPiece);
			}
		}
	},
	canMove:function(piece){
		var foundBlackElem=!1;
		for(var k in this.PiecesGroup.children){
			var c=this.PiecesGroup.children[k];
			if(
				c.posX===(piece.posX-1)&&c.posY===piece.posY&&c.black
				||c.posX===(piece.posX+1)&&c.posY===piece.posY&&c.black
				||c.posY===(piece.posY-1)&&c.posX===piece.posX&&c.black
				||c.posY===(piece.posY+1)&&c.posX===piece.posX&&c.black
			){
				foundBlackElem=c;
				break;
			}
		}
		return foundBlackElem;
	},
	movePiece:function(piece,blackPiece){
		var size=this.PuzzleInfo[this.curPuzzle].size;
		var tmpPiece={
			posX:piece.posX,
			posY:piece.posY,
			curIndex:piece.curIndex,
		};

		// this.add.tween(piece).to({x:blackPiece.posX*size,y:blackPiece.posY*size},300,Phaser.Easing.Linear.None,!0);
		this.add.tween(piece).to({x:blackPiece.posX*size,y:blackPiece.posY*size},100,Phaser.Easing.Linear.None,!0);

		piece.posX=blackPiece.posX;
		piece.posY=blackPiece.posY;
		piece.curIndex=blackPiece.curIndex;
		piece.name='piece'+piece.posX.toString()+'x'+piece.posY.toString();

		blackPiece.posX=tmpPiece.posX;
		blackPiece.posY=tmpPiece.posY;
		blackPiece.curIndex=tmpPiece.curIndex;
		blackPiece.name='piece'+blackPiece.posX.toString()+'x'+blackPiece.posY.toString();

		this.checkIfFinished();
	},
	checkIfFinished:function(){
		var isFinished=!0;
		for(var k in this.PiecesGroup.children){
			var element=this.PiecesGroup.children[k];
			if(element.curIndex!==element.destIndex){
				isFinished=!1;
				break;
			}
		}
		if(isFinished){
			// this.genEnd();
			console.log('genEnd');
		}
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.TimeTS=this.M.S.txt(this.world.centerX,this.world.height*.06,this.curWords.TimeA+this.tickTime);
		this.HUD.add(this.TimeTS);
		this.HUD.visible=!1;
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*1.5,this.curWords.GameOver,this.M.S.styl(60,'#dc143c'));
	},
	gameOver:function(){
		this.genEnd();
		this.end();
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
		this.HUD.visible=!0;
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.Start,this.M.S.styl(50,'#ff7f50'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.onComplete.add(function(){this.destroy},s);
		twA.onComplete.add(this.start,this);
		this.HUD.visible=!0;
		// this.M.SE.play('start',{volume:1});
	},
	genEnd:function(){
		var tw=this.M.T.moveX(this.EndTS,{xy:{y:this.world.centerY},start:!0,easing:Phaser.Easing.Exponential.Out});
		tw.onComplete.add(this.genRes,this);
		this.M.SE.play('end',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			this.EndTS.visible=!1;
		},this);
		tw.start();

		var c=this.add.sprite(this.world.width*.95,this.world.height*.28,'res_'+this.rnd.between(1,3));
		c.anchor.setTo(1,0);
		s.addChild(c);

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.2,this.curWords.Res,this.M.S.styl(45,'#3cb371')));
		s.addChild(this.M.S.txt(this.world.width*.4,this.world.height*.45,this.score+this.curWords.ScoreBack,this.M.S.styl(60,'#dc143c')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.58,this.curWords.ResScoreBack,this.M.S.styl(35,'#dc143c')));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		s.addChild(this.M.S.lbl(lX,this.world.height*.68,this.again,this.curWords.Again,this.M.S.styl(25,'#ffa500'),0xffd700));
		s.addChild(this.M.S.lbl(rX,this.world.height*.68,this.tweet,this.curWords.TwBtn,this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(lX,this.world.height*.78,this.back,this.curWords.Back,this.M.S.styl(25,'#2e8b57'),0x00fa9a));
		s.addChild(this.M.S.lbl(rX,this.world.height*.78,this.othergames,this.curWords.OtherGames,this.M.S.styl(25,'#ffa500'),0xffa500));
		s.addChild(this.M.S.lbl(lX,this.world.height*.88,this.tw,'Twitter',this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(rX,this.world.height*.88,this.yt,'YouTube',this.M.S.styl(25,'#ff0000'),0xff0000));
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			this.M.G.playCount++;
			var wp=this.add.sprite(0,0,'wp');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','Level_'+this.curLevel,this.M.G.playCount);
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='💀💀💀💀💀💀'
			var res='Level: '+(this.curLevelInfo.nextLevel==null?'Max':this.curLevel)+'\n'
				+this.score+this.curWords.ScoreBack+this.curWords.ResScoreBack+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Level_'+this.curLevel,this.M.G.playCount);
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
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('othergames','Play','Level_'+this.curLevel,this.M.G.playCount);
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Level_'+this.curLevel,this.M.G.playCount);
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Level_'+this.curLevel,this.M.G.playCount);
		}
	},
};