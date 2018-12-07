BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		this.ItemInfo=this.M.G.ItemInfo;
		this.ResInfo=this.M.G.ResInfo;
		this.curRes=1;
		this.curResInfo=null;
		// Val
		this.selectedItemList=[];
		this.selectedCount=0;

		// Obj
		this.ItemGroup=
		// this.Fire=this.Nme=
		// this.HUD=
		this.HowToS=
		// this.ScoreTS=this.TimeTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';

		this.genContents();
		this.start();//TODO del
		// this.M.G.endTut?this.genStart():this.genTut();
		this.test();
		// this.tester();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){
				for(var i=0;i<8;i++)this.selectedItemList[i]=this.rnd.between(1,32);
				this.genEnd();
			},this);
		}
	},
	genContents:function(){
		this.genItemGroup();

		// this.genHUD();
	},
	genItemGroup:function(){
		this.ItemGroup=this.add.group();
		var sx=this.world.width*.25,
		mx=this.world.width*.5,
		sy=this.world.height*.5,
		my=this.world.height*.3,
		col=row=0;
		for(var k in this.ItemInfo){
			var info=this.ItemInfo[k];
			var b=this.add.button(sx+mx*col,sy+my*row,'w',this.selectItem,this,);
			b.width=b.height=120;//TODO del
			b.anchor.setTo(.5);
			b.itemId=k;
			var ts=this.M.S.txt(b.x,b.bottom,33333333333);//TODO del
			// var ts=this.M.S.txt(b.x,b.bottom,info.name);
			b.ts=ts;
			this.ItemGroup.add(b);
			this.ItemGroup.add(ts);
			row++;
			if(row==2){
				row=0;
				col++;
			}
		}
	},
	selectItem:function(b){
		if(this.inputEnabled){
			this.inputEnabled=!1;
			this.selectedItemList.push(b.itemId);
			this.selectedCount++;

			b.x=b.worldPosition.x;
			b.y=b.worldPosition.y;
			this.world.add(b);
			b.ts.visible=!1;
			var tw=this.M.T.moveA(b,{xy:{x:this.world.width*.8,y:this.world.height*.2},start:!0});
			this.M.T.moveB(this.ItemGroup,{xy:{x:'-'+this.world.width},duration:800,start:!0});
			tw.onComplete.add(function(s){
				s.destroy();
				if(this.selectedCount==8){
					this.genEnd();
				}else{
					this.inputEnabled=!0;
				}
			},this);

			if(this.selectedCount==8)this.end()
		}
	},
	genHUD:function(){
		this.HUD=this.add.group();
		this.ScoreTS=this.M.S.txt(this.Fire.x,this.Fire.bottom,this.curWords.ScoreFront+0+this.curWords.ScoreBack,this.M.S.styl(25,'#008000'));
		this.TimeTS=this.M.S.txt(this.world.centerX,this.world.height*.05,this.curWords.Time+':'+this.leftTime,this.M.S.styl(25,'#1e90ff'));
		this.HUD.add(this.ScoreTS);
		this.HUD.add(this.TimeTS);
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
	genEnd:function(){
		this.resultItem();

		console.log(this.curResInfo);

		// TODO

		this.genRes();
	},
	resultItem:function(){
		var a=[];
		for(var k in this.selectedItemList)a.push(this.ItemInfo[this.selectedItemList[k]].val);
		var r,resutlNum=Math.abs(a[0]*a[1]+a[2]-a[3]+a[4]*a[5]-a[6]*a[7]);
		if(resutlNum>5000000){
			r=0;
		}else if(resutlNum>1000000){
			r=1;
		}else if(resutlNum>200000){
			r=2;
		}else if(resutlNum>100000){
			r=3;
		}else if(resutlNum>50000){
			r=4;
		}else if(resutlNum>10000){
			r=5;
		}else if(resutlNum>1000){
			r=6;
		}else{
			r=7;
		}
		this.curRes=r;
		this.curResInfo=this.ResInfo[this.curRes];
	},
	genRes:function(){
		var s=this.add.sprite(this.world.width,this.world.centerY,'twp');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{x:0},delay:600});
		tw.onComplete.add(function(){
			this.inputEnabled=!0;
			// this.HUD.visible=!1;
		},this);
		tw.start();
		// tw.onStart.add(function(){this.M.SE.play('start',{volume:1})},this);

		s.addChild(this.M.S.txt(this.world.centerX,this.world.height*.05,3333,this.M.S.styl(40,'#dc143c')));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		s.addChild(this.M.S.lbl(lX,this.world.height*.2,this.again,this.curWords.Again,this.M.S.styl(25,'#ffd700'),0xffd700));
		s.addChild(this.M.S.lbl(rX,this.world.height*.2,this.tweet,this.curWords.TwBtn,this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(lX,this.world.height*.3,this.back,this.curWords.Back,this.M.S.styl(25,'#00fa9a'),0x00fa9a));
		s.addChild(this.M.S.lbl(rX,this.world.height*.3,this.othergames,this.curWords.OtherGames,this.M.S.styl(25,'#ffa500'),0xffa500));
		s.addChild(this.M.S.lbl(lX,this.world.height*.4,this.tw,'Twitter',this.M.S.styl(25,'#00a2f8'),0x00a2f8));
		s.addChild(this.M.S.lbl(rX,this.world.height*.4,this.yt,'YouTube',this.M.S.styl(25,'#ff0000'),0xff0000));
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
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
			var e='3333333333333333333';
			var res='oooooooooooooooooooooo';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Result_'+this.curRes,this.M.G.playCount);
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('Back',{volume:1});
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
			myGa('othergames','Play','Result_'+this.curRes,this.M.G.playCount);
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Result_'+this.curRes,this.M.G.playCount);
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.M.G.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Result_'+this.curRes,this.M.G.playCount);
		}
	},
	tester:function(arr){
		if(__ENV=='prod')return;
		arr=arr||[
			[-32,43,1,21],
			[5,-3,108,8],
			[34,115,80,2],
			[-30,-50,-20,4],
			[-200,200,33,27],
			[11,-9,6,14],
			[-7,9,-13,29],
			[-56,88,-73,36],
		];
		/*
		var res=[];
		for(var i=0;i<4;i++){
			res[i]=arr[0][i];
			for(var j=0;j<4;j++){
				res[i+'-'+j]=res[i]*arr[1][j];
				for(var k=0;k<4;k++){
					res[i+'-'+j+'-'+k]=res[i+'-'+j]*arr[2][k];
				}
				res[i+'-'+j]=null;
			}
			res[i]=null;
		}
		console.log(res);
		*/

		var res=[];
		for(var i=0;i<4;i++){
			res[i]=arr[0][i];
			bbb(1,i,i+'-');
		}

		function bbb (order,num,txt) {
			if(order>7)return;
			// if(order>2)return;
			for(var j=0;j<4;j++){
				var txt_A=txt+j;
				switch(order){
					case 1:res[txt_A]=res[num]*arr[order][j];break;
					case 2:res[txt_A]=res[num]+arr[order][j];break;
					case 3:res[txt_A]=res[num]-arr[order][j];break;
					case 4:res[txt_A]=res[num]+arr[order][j];break;
					case 5:res[txt_A]=res[num]*arr[order][j];break;
					case 6:res[txt_A]=res[num]-arr[order][j];break;
					case 7:res[txt_A]=res[num]*arr[order][j];break;
				}
			}
			order++;
			for(var j=0;j<4;j++){
				var txt_A=txt+j;
				var txt_B=txt+j+'-';
				bbb(order,txt_A,txt_B);
			}
			res[num]=null;
		}

		var newRes=[],
		max=min=maxA=minA=null;
		total=totalA=count=tmpCount=0;
		tmpRes=[0,0,0,0,0,0,0,0,];
		for(var k in res){
			var v=res[k];
			if(v){
				if(max==null){
					max=v;
					min=v;
				}
				max=Math.max(max,v);
				min=Math.min(min,v);
				total+=v;

				var vA=Math.abs(v);
				if(maxA==null){
					maxA=vA;
					minA=vA;
				}
				maxA=Math.max(maxA,vA);
				minA=Math.min(minA,vA);
				totalA+=vA;

				count++;

				// if(count%1000==0)tmpCount++;
				// if(!newRes[tmpCount])newRes[tmpCount]={};
				// newRes[tmpCount][k]=v;

				// newRes[k]=v;

				if(vA>5000000){
					newRes[k]=vA;
					tmpRes[0]++;
				}else if(vA>1000000){
					tmpRes[1]++;
				}else if(vA>200000){
					tmpRes[2]++;
				}else if(vA>100000){
					tmpRes[3]++;
				}else if(vA>50000){
					tmpRes[4]++;
				}else if(vA>10000){
					tmpRes[5]++;
				}else if(vA>1000){
					tmpRes[6]++;
				}else{
					newRes[k]=vA;
					tmpRes[7]++;
				}
			}
		}
		// console.log(res);
		console.log(newRes);
		console.log('max: '+max,'min: '+min,'total: '+total,'count: '+count,'average: '+(total/count));
		console.log('maxA: '+maxA,'minA: '+minA,'totalA: '+totalA,'count: '+count,'averageA: '+(totalA/count));
		console.log(tmpRes);

		/*
		for(var i=0;i<4;i++){
			var keyTxt='';
			for(var j=0;j<8;j++)keyTxt+=i+'-';
			keyTxt=keyTxt.slice(0,-1);
			console.log(newRes[keyTxt]);
		}
		*/
	},
};