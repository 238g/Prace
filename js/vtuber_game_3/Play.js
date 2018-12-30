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
		this.curPuzzleInfo=this.PuzzleInfo[this.curPuzzle];
		this.CharInfo=this.M.G.CharInfo;
		this.curChar=this.M.G.curChar;
		this.curCharInfo=this.CharInfo[this.curChar];
		// Val
		this.tickTimer=2E3;
		this.tickTime=0;
		this.startFrameX=(this.world.width-this.M.G.frameWidth)/2;
		this.startFrameY=this.world.height*.05;
		this.size=this.curPuzzleInfo.size+1;
		// Obj
		this.PiecesGroup=
		this.HUD=this.TimeTS=this.EndTS=this.HowToS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		this.M.G.endTut?this.genStart():this.genTut();
		this.test();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.genRes,this);
			if(getQuery('view')){
				this.add.sprite(0,0,'wp');
				var cn=getQuery('view');
				var ci=this.CharInfo[cn];
				var pi=this.PuzzleInfo[3];
				var index=0;
				for(var j=0;j<5;j++){
					for(var i=0;i<10;i++){
						this.add.sprite(10+i*(pi.size+1),10+j*(pi.size+1),cn+'_3',index);
						index++;
					}
				}
			}
		}
	},
	update:function(){
		if(this.isPlaying){
			this.tickTimer-=this.time.elapsed;
			if(this.tickTimer<0){
				this.tickTimer=1E3;
				this.tickTime++;
				this.TimeTS.chT(this.genTimeText());
			}
		}
	},
	genContents:function(){
		this.genBg();
		this.genPieces();
		this.genHUD();
		this.genGivePanel();
	},
	genBg:function(){
		var s=this.add.sprite(this.startFrameX-10,this.startFrameY-10,'wp');
		s.width=this.size*this.curPuzzleInfo.col-1+20;
		s.height=this.size*this.curPuzzleInfo.row-1+20;
		s.alpha=0;
		this.add.tween(s).to({alpha:1},3E3,null,!0,500,-1,!0);
	},
	genPieces:function(){
		var piecesIndex=0,
			pieceAmount=this.curPuzzleInfo.col*this.curPuzzleInfo.row,
			shuffleArr=[],
			img=this.curChar+'_'+this.curPuzzle;
		for(var i=0;i<pieceAmount;i++)shuffleArr.push(i);
		Phaser.ArrayUtils.shuffle(shuffleArr);//IF THIS COMMENT OUT ==== END
		this.PiecesGroup=this.add.group();
		for(var i=0;i<this.curPuzzleInfo.row;i++){
			for(var j=0;j<this.curPuzzleInfo.col;j++){
				if(shuffleArr[piecesIndex]){
					piece=this.PiecesGroup.create(j*this.size+this.startFrameX,i*this.size+this.startFrameY,img,shuffleArr[piecesIndex]);
					piece.inputEnabled=!0;
					piece.events.onInputDown.add(this.selectPiece,this);
				}else{
					piece=this.PiecesGroup.create(j*this.size+this.startFrameX,i*this.size+this.startFrameY);
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
		this.LastPieceSp=this.add.sprite(this.startFrameX,this.startFrameY,img,piecesIndex);
		this.LastPieceSp.scale.setTo(3);
		this.LastPieceSp.visible=!1;
		this.PiecesGroup.add(this.LastPieceSp);
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
		var tmpPiece={
			posX:piece.posX,
			posY:piece.posY,
			curIndex:piece.curIndex,
		};
		this.add.tween(piece).to({x:blackPiece.posX*this.size+this.startFrameX,y:blackPiece.posY*this.size+this.startFrameY},100,Phaser.Easing.Linear.None,!0);

		piece.posX=blackPiece.posX;
		piece.posY=blackPiece.posY;
		piece.curIndex=blackPiece.curIndex;
		piece.name='piece'+piece.posX.toString()+'x'+piece.posY.toString();

		blackPiece.posX=tmpPiece.posX;
		blackPiece.posY=tmpPiece.posY;
		blackPiece.curIndex=tmpPiece.curIndex;
		blackPiece.name='piece'+blackPiece.posX.toString()+'x'+blackPiece.posY.toString();
		
		this.M.SE.play('slide',{volume:1});

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
			this.clear();
		}
	},
	clear:function(){
		this.end();
		var t=this.add.tween(this.LastPieceSp.scale).to({x:1,y:1},1E3,null,!0,500);
		t.onStart.add(function(){
			this.LastPieceSp.visible=!0;
		},this);
		t.onComplete.add(function(){
			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
			this.M.SE.play('match',{volume:1});
			this.genEnd();
		},this);
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.TimeTS=this.M.S.txt(this.world.centerX,this.world.height*.9,this.genTimeText(),this.M.S.styl(30,'#00bfff'));
		this.HUD.add(this.TimeTS);
		this.HUD.visible=!1;
		this.EndTS=this.M.S.txt(this.world.centerX,this.world.height*1.5,this.curWords.Clear,this.M.S.styl(60,'#dc143c'));
	},
	genGivePanel:function(){
		this.M.S.lbl(this.world.width*.15,this.world.height*.92,this.showGiveUp,this.curWords.GiveUp,this.M.S.styl(25,'#dc143c'),0xff4500);
		this.GivePanel=this.add.group();
		var s=this.add.sprite(0,0,'wp');
		s.tint=0x000000;
		this.GivePanel.add(s);
		var styl=this.M.S.styl(25);
		this.GivePanel.add(this.M.S.txt(this.world.centerX,this.world.height*.3,this.curWords.GiveUpConfirm,styl));
		this.GivePanel.add(this.M.S.lbl(this.world.width*.73,this.world.height*.8,this.giveUp,this.curWords.Yes,styl,0x00ff00));
		this.GivePanel.add(this.M.S.lbl(this.world.width*.27,this.world.height*.8,this.cancel,this.curWords.No,styl,0xffd700));
		this.GivePanel.visible=!1;
	},
	showGiveUp:function(){
		if(this.isPlaying){
			this.end();
			this.GivePanel.visible=!0;
			this.M.SE.play('OnBtn',{volume:1});
		}
	},
	giveUp:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var wp=this.add.sprite(0,0,'wp');
		wp.tint=0x000000;
		wp.alpha=0;
		this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
		this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
		this.Tween.start();
	},
	cancel:function(){
		this.start();
		this.GivePanel.visible=!1;
		this.M.SE.play('OnBtn',{volume:1});
	},
	genTimeText:function(){
		return this.curWords.TimeA+this.tickTime+this.curWords.TimeB;
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'twp');
		this.HowToS.tint=0x000000;
		this.HowToS.addChild(this.M.S.txt(this.world.centerX,this.world.centerY,this.curWords.HowTo,this.M.S.styl(40,'#3cb371')));
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
		this.M.SE.play('start',{volume:1});
	},
	genEnd:function(){
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY},start:!0,delay:300});
		tw.onComplete.add(this.genRes,this);
		tw.onStart.add(function(){this.M.SE.play('end',{volume:1});},this);
	},
	genRes:function(){
		var s=this.add.sprite(0,this.world.height,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			this.HUD.visible=!1;
			this.EndTS.visible=!1;
		},this);
		tw.start();

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.08,this.curWords.ResTitle,this.M.S.styl(35,'#008000')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.28,this.curWords.SelectedChar+'\n'+this.curCharInfo.name,this.M.S.styl(30,'#ff1493')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.44,this.genTimeText(),this.M.S.styl(30,'#1e90ff')));

		var lx=this.world.width*.25,rx=this.world.width*.75;
		s.addChild(this.M.S.lbl(lx,this.world.height*.6,this.again,this.curWords.Again,this.M.S.styl(25,'#ffa500'),0xffd700));
		s.addChild(this.M.S.lbl(rx,this.world.height*.6,this.tweet,this.curWords.TwBtn,this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(lx,this.world.height*.75,this.back,this.curWords.Back,this.M.S.styl(25,'#2e8b57'),0x00fa9a));
		s.addChild(this.M.S.lbl(rx,this.world.height*.75,this.othergames,this.curWords.OtherGames,this.M.S.styl(25,'#ffa500'),0xffa500));
		s.addChild(this.M.S.lbl(lx,this.world.height*.9,this.tw,'Twitter',this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(rx,this.world.height*.9,this.yt,'YouTube',this.M.S.styl(25,'#ff0000'),0xff0000));
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
			myGa('again','Play','Char_'+this.M.G.curChar+';Puzzle_'+this.M.G.curPuzzle,this.M.G.playCount);
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='🎮🎮🎮🎮🎮🎮'
			var res=this.curWords.SelectedChar+this.curCharInfo.name+'\n'+this.curPuzzleInfo.col+'x'+this.curPuzzleInfo.row+this.curWords.Piece+this.curWords.ChallengeBack+'\n'+this.genTimeText()+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.M.G.curChar+';Puzzle_'+this.M.G.curPuzzle,this.M.G.playCount);
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
			myGa('othergames','Play','Char_'+this.M.G.curChar+';Puzzle_'+this.M.G.curPuzzle,this.M.G.playCount);
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Char_'+this.M.G.curChar+';Puzzle_'+this.M.G.curPuzzle,this.M.G.playCount);
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Char_'+this.M.G.curChar+';Puzzle_'+this.M.G.curPuzzle,this.M.G.playCount);
		}
	},
};