BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.LevelInfo=this.M.G.LevelInfo;
		this.curLevel=1;
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		this.LaneInfo=[
			[1,1,1,1,1,1],//0
			[1,2,3,2,3,1],//1
			[1,1,2,3,1,1],//2
			[1,2,3,2,3,1],//3
			[1,1,2,3,1,1],//4
			[4,4,5,4,4,4],//5
		];
		// Val
		this.respawnTimer=0;
		this.activePanelCount=4;
		this.allPanelCount=6;
		this.viewLaneCount=5;
		this.allLaneCount=6;
		this.panelCentering=this.world.width*.1;
		this.endY=this.moveDistance=0;
		this.willDestroyPerson=!1;
		this.canMovePanel=!0;
		this.speed=2;

		// Obj
		this.People=[];
		this.Panels=[];

		this.Lanes=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=this.M.G.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		// this.M.G.endTut?this.genStart():this.genTut();
		this.start();//TODO
		this.test();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			// this.Weapon.body.debug=!0;
			// this.Player.body.debug=!0;
			// this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			// if(getQuery('res'))
		}
	},
	update:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.curLevelInfo.respawnTimer;
				this.respawn();
			}
			for(var k in this.People){
				var p=this.People[k];
				this.movePerson(p,k);
				//if py group but isntTween
			}
			if(this.willDestroyPerson){
				this.willDestroyPerson=!1;
				var tmp=[];
				for(var k in this.People){
					var p=this.People[k];
					if(p.willDestroy){
						p.destroy();
					}else{
						tmp.push(p);
					}
				}
				this.People=tmp;
			}
		}
	},
	genContents:function(){
		this.genPanel();
		// this.genHUD();
	},
	genPanel:function(){
		var my=this.world.height/this.allPanelCount;
		var mx=this.world.width/this.viewLaneCount;
		for(var i=0;i<this.allPanelCount;i++){
			var pb=this.add.button(0,i*my,'',this.movePanel,this);
			pb.panelNum=i;
			pb.nowLR='left';
			// this.M.S.bmpSq(0,i*my,this.world.width,my,rndColor()).alpha=.5;
			var pg=this.add.group();
			pg.startY=i*my;
			pg.middleY=i*my+my/2;

			var info=this.LaneInfo[i];
			for(var j=0;j<this.allLaneCount;j++){
				var s=this.add.sprite(mx*j,0,'road_'+info[j]);
				// s.height=my;
				pb.addChild(s);
			}
			this.Panels.push(pg);
		}
		for(var k in this.Panels)this.world.bringToTop(this.Panels[k]);
		this.endY=this.world.height-my/2;
		this.moveDistance=mx;
	},
	movePanel:function(b){
		if(this.isPlaying&&b.panelNum!=0&&b.panelNum<=this.activePanelCount&&!this.Tween.isRunning){
			var panel=this.Panels[b.panelNum];
			this.canMovePanel=!0;
			if(b.nowLR=='left'){
				panel.forEach(function(c){if(c.laneNum==0)this.canMovePanel=!1;},this);
				if(this.canMovePanel){
					b.nowLR='right';
					this.Tween=this.M.T.moveB(b,{xy:{x:'-'+this.moveDistance},duration:100,start:!0});
					// b.x-=this.moveDistance;//TODO tween
					panel.forEach(function(c){
						this.M.T.moveB(c,{xy:{x:'-'+this.moveDistance},duration:100,start:!0});
						// c.x-=this.moveDistance;//TODO tween
						c.laneNum--;
					},this);
					this.LaneInfo[b.panelNum].shift();
				}
			}else{
				panel.forEach(function(c){if(c.laneNum==this.viewLaneCount-1)this.canMovePanel=!1;},this);
				if(this.canMovePanel){
					b.nowLR='left';
					// b.x+=this.moveDistance;//TODO tween
					this.Tween=this.M.T.moveB(b,{xy:{x:'+'+this.moveDistance},duration:100,start:!0});
					panel.forEach(function(c){
						this.M.T.moveB(c,{xy:{x:'+'+this.moveDistance},duration:100,start:!0});
						// c.x+=this.moveDistance;//TODO tween
						c.laneNum++;
					},this);
					this.LaneInfo[b.panelNum].unshift(1);
				}
			}
		}
	},
	movePerson:function(person,key){
		var canMoveY=!0;
		var nextPanelNum=person.panelNum+1;
		if(nextPanelNum==this.allPanelCount){
			if(person.y>this.endY){
				canMoveY=!1;
				// console.log(this.People);
				person.willDestroy=!0;
				this.willDestroyPerson=!0;
			}
		}else if(this.Panels[nextPanelNum].startY<person.y&&!this.Tween.isRunning){
			person.panelNum=nextPanelNum;
			this.Panels[nextPanelNum].add(person);
			person.panelType=this.LaneInfo[nextPanelNum][person.laneNum];
		}else if(person.panelType==2&&this.Panels[person.panelNum].middleY<=person.y){
			canMoveY=!1;
			person.x+=this.speed;
			person.distanceX+=this.speed;
			if(person.distanceX>this.moveDistance){
				person.distanceX=0;
				person.panelType=1;
				person.laneNum++;
			}
		}else if(person.panelType==3&&this.Panels[person.panelNum].middleY<=person.y){
			canMoveY=!1;
			person.x-=this.speed;
			person.distanceX+=this.speed;
			if(person.distanceX>this.moveDistance){
				person.distanceX=0;
				person.panelType=1;
				person.laneNum--;
			}
		}
		if(canMoveY)person.y+=this.speed;
	},
	respawn:function(){
		var r=this.rnd.between(1,this.viewLaneCount);
		var p=this.add.sprite(this.panelCentering*(r*2-1),0,'yahiro_'+this.rnd.between(1,5));
		p.anchor.setTo(.5,.8);
		// p.anchor.setTo(.5);
		p.distanceX=0;
		p.panelNum=0;
		p.laneNum=r-1;
		p.panelType=1;
		p.willDestroy=!1;
		this.Panels[0].add(p);
		this.People.push(p);
	},
	gameOver:function(){
		this.genEnd();
		this.end();
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.KillCountTS=this.M.S.txt(this.world.centerX,this.world.height*.96,this.killCount+this.curWords.KillCount);
		this.LevelTS=this.M.S.txt(this.world.centerX,this.world.height*.06,'Level '+this.curLevel);
		this.HPTS=this.M.S.txt(0,this.Player.height/2,'HP'+this.HP);
		this.Player.addChild(this.HPTS);
		this.HUD.add(this.KillCountTS);
		this.HUD.add(this.LevelTS);
		this.HUD.visible=!1;
		this.EndTS=this.M.S.txt(this.world.width*1.5,this.world.centerY,this.curWords.GameOver,this.M.S.styl(60,'#dc143c'));
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
		var s=this.M.S.txt(this.world.centerX,-this.world.centerY,this.curWords.Start,this.M.S.styl(50,'#0080FF'));
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},start:!0});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.onComplete.add(function(){this.destroy},s);
		var twC=this.M.T.moveA(this.Player,{xy:{x:this.world.width*.2},start:!0});
		twC.onComplete.add(this.start,this);
		this.HUD.visible=!0;
		this.M.SE.play('OnStart',{volume:1});
	},
	genEnd:function(){
		var tw=this.M.T.moveX(this.EndTS,{xy:{x:this.world.centerX},start:!0,easing:Phaser.Easing.Exponential.Out});
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

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.2,this.curWords.Res,this.M.S.styl(40,'#3cb371')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.38,this.killCount,this.M.S.styl(60,'#dc143c')));
		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.5,this.curWords.KillCount,this.M.S.styl(45,'#dc143c')));

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
			myGa('again','Play','Result_'+this.curRes,this.M.G.playCount);
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='@@@@@@@@@@@@@@@@@@@'
			var res='+++++++++++++++++++++++';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
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
			myGa('othergames','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','playCount_'+this.M.G.playCount,this.M.G.playCount);
		}
	},
};