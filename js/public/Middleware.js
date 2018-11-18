Middleware=function(game,GmObj,BootCls){
	this.nextScene=null;
	this.G={playCount:0};
	game.M=this;
	this.GmObj=GmObj;
	for (var c in GmObj)game.state.add(c,GmObj[c]);
	this.S=new this.SpriteManager(game,this);
	this.T=new this.TweenManager(game,this);
	this.SE=new this.SoundManager(game,this);
	this.curScene=BootCls;
	this.game=game;
	game.state.start(BootCls);
	this.setM();
};
Middleware.prototype={
	BootInit:function(orientation,define){
		var sc=this.gScn();
		sc.input.maxPointers=1;
		sc.stage.backgroundColor='#424242';
		sc.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
		sc.stage.disableVisibilityChange=!0;
		if(orientation){
			sc.scale.fullScreenScaleMode=Phaser.ScaleManager.EXACT_FIT;
			if (!sc.game.device.desktop) {
				sc.scale.forceOrientation(!0,!1);
				sc.scale.enterIncorrectOrientation.add(function(){document.getElementById('orientation').style.display='block'});
				sc.scale.leaveIncorrectOrientation.add(function(){document.getElementById('orientation').style.display='none'});
			}
		}else{
			sc.scale.fullScreenScaleMode=sc.game.device.desktop?Phaser.ScaleManager.SHOW_ALL:Phaser.ScaleManager.EXACT_FIT;
		}
		sc.scale.parentIsWindow=!0;
		sc.scale.refresh();
		sc.load.crossOrigin='Anonymous';
		this.G.TOUCH_WORD=sc.game.device.touch?'タッチ':'クリック';
		this.G.TOUCH_WORD_EN=sc.game.device.touch?'TOUCH':'CLICK';
		define=define||{};
		for(var k in define)this.G[k]=define[k];
		setSPBrowserColor(this.G.MAIN_COLOR);
	},
	NextScene:function(nextScene){
		this.gScn().state.start(nextScene);
		this.curScene=nextScene;
		this.setM();
	},
	gScn:function(){return this.game.state.states[this.curScene]},
	setM:function(){this.gScn().M=this},
};
Middleware.prototype.SpriteManager=function(g,m){this.game=g,this.M=m};
Middleware.prototype.SpriteManager.prototype={
	txt:function(x,y,t,styl){
		var sc=this.M.gScn();
		var cstyl=styl||this.styl(25);
		var mstyl={};
		for(var k in cstyl)mstyl[k]=cstyl[k];
		mstyl.fill=cstyl.mStroke;
		mstyl.stroke=cstyl.mStroke;
		mstyl.strokeThickness=cstyl.strokeThickness+cstyl.mStrokeThickness;
		var mts=sc.add.text(x,y,t,mstyl);
		mts.lineSpacing=-cstyl.mStrokeThickness;
		mts.anchor.setTo(.5);
		var ts=sc.add.text(0,0,t,cstyl);
		ts.anchor.setTo(.5);
		mts.addChild(ts);
		mts.chT=function(t){
			this.setText(t);
			this.children[0].setText(t);
		};
		mts.chS=function(styl){
			this.children[0].setStyle(styl);
			styl.fill=styl.mStroke;
			styl.stroke=styl.mStroke;
			styl.strokeThickness=styl.strokeThickness+styl.mStrokeThickness;
			this.setStyle(styl);
		};
		return mts;
	},
	lbl:function(x,y,f,t,styl,tint){
		var sc=this.M.gScn();
		var b=sc.add.button(x,y,'greySheet',f,sc);
		b.anchor.setTo(.5);
		b.setFrames('grey_button00','grey_button00','grey_button01','grey_button00');
		b.tint=tint||this.M.G.MAIN_TINT||0xffffff;
		var ts=this.txt(0,0,t,styl);
		b.addChild(ts);
		b.chT=function(t){this.children[0].chT(t)};
		return b;
	},
	styl:function(fs,color){
		var g=this.M.G;
		var f=g.MAIN_TEXT_COLOR||'#FFFFFF';
		return {
			fontSize:fs||25,
			fill:color||f,
			align:'center',
			stroke:g.WHITE_COLOR||'#000000',
			strokeThickness:8,
			mStroke:color||g.MAIN_STROKE_COLOR||f,
			mStrokeThickness:5,
		};
	},
	stylS:function(fs,color){
		var g=this.M.G;
		var f=g.MAIN_TEXT_COLOR||'#FFFFFF';
		return {
			fontSize:fs||25,
			fill:color||f,
			align:'center',
			stroke:g.WHITE_COLOR||'#000000',
			strokeThickness:5,
			mStroke:color||g.MAIN_STROKE_COLOR||f,
			mStrokeThickness:3,
		};
	},
	bmpSq:function(x,y,w,h,f){
		var sc=this.M.gScn();
		var b=sc.add.bitmapData(w,h);
		b.ctx.fillStyle=f;
		b.ctx.beginPath();
		b.ctx.rect(0,0,w,h);
		b.ctx.fill();
		b.update();
		return sc.add.sprite(x,y,b);
	},
	bmpCir:function(x,y,r,f){
		var sc=this.M.gScn();
		var b=sc.add.bitmapData(r,r);
		var hr=r*.5;
		b.circle(hr,hr,hr,f);
		return sc.add.sprite(x,y,b);
	},
	vol:function(x,y,tint){
		var sc=this.M.gScn();
		var s=sc.add.button(x,y,'VolumeIcon',this.onVol,sc);
		s.anchor.setTo(.5);
		s.scale.setTo(.5);
		var f=sc.sound.mute?'VolumeMute':sc.sound.volume==1?'VolumeMax':'VolumeHalf';
		s.setFrames(f,f,f,f);
		s.tint=tint||0x000000;
		return s;
	},
	onVol:function(s){
		var f,sc=this.M.gScn();
		if(sc.sound.mute){
			f='VolumeMax';
			sc.sound.mute=!1;
			sc.sound.volume=1;
		}else{
			if(sc.sound.volume==1){
				f='VolumeHalf';
				sc.sound.volume=.5;
			}else{
				f='VolumeMute';
				sc.sound.volume=0;
				sc.sound.mute=!0;
			}
		}
		s.setFrames(f,f,f,f);
		myGa('volume',this.M.curScene,f,this.M.G.playCount);
	},
	flsc:function(x,y,tint){
		var sc=this.M.gScn();
		var f=sc.scale.isFullScreen?'smaller':'larger';
		var s=sc.add.button(x,y,'GameIconsWhite',this.onFlsc,sc);
		s.tint=0x000000;
		s.setFrames(f,f,f,f);
		s.anchor.setTo(.5);
		s.scale.setTo(.5);
		s.tint=tint||0x000000;
		return s;
	},
	onFlsc:function(s){
		var sc=this.M.gScn();
		if (sc.scale.isFullScreen) {
			var f='larger';
			sc.scale.stopFullScreen(!1);
			var curScreen='Small';
		} else {
			var f='smaller';
			sc.scale.startFullScreen(!1);
			var curScreen='Large';
		}
		s.setFrames(f,f,f,f);
		myGa('fullscreen',this.M.curScene,curScreen,this.M.G.playCount);
	},
	load:function(){
		var sc=this.M.gScn();
		var s=sc.add.sprite(sc.world.centerX,sc.world.centerY,'loading');
		s.anchor.setTo(.5);
		s.scale.setTo(1.5);
		s.animations.add('loading').play(18,!0);
		var ts=this.txt(sc.world.centerX,sc.world.height*.7,'0%',this.styl(30));
		ts.anchor.setTo(.5);
		sc.load.onFileComplete.add(function(p){this.chT(p+'%')},ts);
		this.M.G.curLang=='en'?changeTtl(this.M.G.GAME_TITLE_EN):this.txt(sc.world.centerX,sc.world.height*.25,sc.rnd.pick(__ADVICE_WORDS),this.styl(25));
	},
	logo:function(){
		var sc=this.M.gScn();
		this.M.S.bmpSq(0,0,this.world.width,this.world.height,'#000000');
		var s=sc.add.sprite(this.world.centerX,this.world.centerY,'PubLogo');
		s.alpha=0;
		s.anchor.setTo(.5);
		var twA=this.M.T.fadeInA(s,{duration:1E3,alpha:1});
		twA.start();
		var twB=this.M.T.fadeOutA(s,{duration:500,delay:300});
		twA.chain(twB);
		twB.onComplete.add(this.start,sc);
	},
};
Middleware.prototype.TweenManager=function(g,m){this.game=g;this.M=m;};
Middleware.prototype.TweenManager.prototype={
	// [duration,start,delay]
	beatA:function(t,op){op=op||{};return this.M.gScn().add.tween(t.scale).to({x:'+.1',y:'+.1'},op.duration,Phaser.Easing.Sinusoidal.Out,op.start||!1,op.delay,-1,!0)},
	// xy[,duration,start,delay]
	pointingA:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Sinusoidal.Out,op.start||!1,op.delay,-1,!0)},
	// [duration,scale,start,delay]
	popUpA:function(t,op){
		op=op||{};
		op.scale=op.scale||{};
		return this.M.gScn().add.tween(t.scale).to({x:(op.scale.x||1),y:(op.scale.y||1)},op.duration,Phaser.Easing.Sinusoidal.Out,op.start||!1,op.delay);
	},
	// [duration,scale,start,delay]
	popUpB:function(t,op){
		op=op||{};
		op.scale=op.scale||{};
		return this.M.gScn().add.tween(t.scale).to({x:(op.scale.x||1),y:(op.scale.y||1)},op.duration,Phaser.Easing.Back.Out,op.start||!1,op.delay);
	},
	// easing[,duration,scale,start,delay]
	popUpX:function(t,op){
		op=op||{};
		op.scale=op.scale||{};
		return this.M.gScn().add.tween(t.scale).to({x:(op.scale.x||1),y:(op.scale.y||1)},op.duration,op.easing,op.start||!1,op.delay);
	},
	// xy[,duration,start,delay]
	moveA:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Back.Out,op.start||!1,op.delay)},
	// xy[,duration,start,delay]
	moveB:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Linear.None,op.start||!1,op.delay)},
	// xy[,duration,start,delay] // loop yoyo
	moveC:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Cubic.Out,op.start||!1,op.delay,-1,!0)},
	// xy[,duration,start,delay]
	moveD:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Bounce.Out,op.start||!1,op.delay)},
	// xy,easing[,duration,start,delay]
	moveX:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to(op.xy,op.duration,op.easing,op.start||!1,op.delay)},
	// [duration,start,delay]
	fadeInA:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to({alpha:op.alpha||1}, op.duration,Phaser.Easing.Linear.None,op.start||!1,op.delay)},
	// [duration,start,delay]
	fadeOutA:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to({alpha:0},op.duration,Phaser.Easing.Linear.None,op.start||!1,op.delay)},
	// [alpha,duration,start,delay,yoyo,repeat]
	fadeOutB:function(t,op){
		op=op||{};
		var t=this.M.gScn().add.tween(t).to({alpha:op.alpha||0},op.duration,Phaser.Easing.Exponential.Out,op.start||!1,op.delay);
		if(op.yoyo)t.yoyo(!0);
		if(op.repeat)t.repeat(op.repeat);
		return t;
	},
	// easing[,duration,start,delay]
	fadeOutX:function(t,op){op=op||{};return this.M.gScn().add.tween(t).to({alpha:0},op.duration,op.easing,op.start||!1,op.delay)},
	// [durations,delay]
	stressA:function(t,op){
		op=op||{};
		var sc=this.M.gScn();
		durations=op.durations||[200,100];
		delay=op.delay||500;
		var startTween=sc.add.tween(t.scale).to({x:'+.1'},durations[0],Phaser.Easing.Linear.None,!1,delay);
		t.endTween=sc.add.tween(t.scale).to({x:'-.1'},durations[0],Phaser.Easing.Linear.None);
		var yoyoTween=sc.add.tween(t).to({angle:5},durations[1],Phaser.Easing.Linear.None,!1,0,2,!0);
		startTween.chain(yoyoTween);
		startTween.onComplete.add(function(){this.angle=-5;},t);
		yoyoTween.onComplete.add(function(){this.angle=0;t.endTween.start()},t);
		t.endTween.onComplete.add(function(){this.start();},startTween);
		return startTween;
	},
	// [duration,delay]
	slideshow:function(g,op){
		var bs=g.getTop();
		bs.alpha=1;
		var ns=g.getBottom();
		g.bringToTop(ns);
		var t=this.fadeInA(ns,op);
		t.onComplete.add(function(){this.alpha=0},bs);
		t.onComplete.add(function(){this.slideshow(g,op)},this);
		t.start();
	},
};
Middleware.prototype.SoundManager=function(g,m){
	this.sounds={curBGM:null};
	this.game=g;
	this.M=m;
};
Middleware.prototype.SoundManager.prototype={
	setSounds:function(s){for(var k in s)this.sounds[k]=this.game.add.audio(k)},
	play:function(k,op){
		op=op||{};
		var s=this.sounds[k];
		if(op.loop)s.loop=!0;
		if(op.volume)s.volume=op.volume;
		if(op.isBGM)this.sounds.curBGM=s;
		s.play();
		return s;
	},
	playBGM:function(k,op){
		if(this.isPlaying(k))return;
		op=op||{};
		this.stop('curBGM');
		return this.play(k,{isBGM:!0,loop:!0,volume:op.volume});
	},
	stop:function(k){this.isPlaying(k)&&this.sounds[k].stop()},
	setVolume:function(k,v){this.sounds[k].volume=v},
	fadeOut:function(k,d){this.isPlaying(k)&&this.sounds[k].fadeOut(d)},
	isPlaying:function(k){
		var s=this.getSound(k);
		return s?s.isPlaying:!1;
	},
	getSound:function(k){return this.sounds[k]||!1},
};
function getQuery(key){
	var q=window.location.search.slice(1).split('&');
	for(var i in q){
		var a=q[i].split('=');
		if(key==a[0]) return a[1];
	}
	return !1;
}
function setSPBrowserColor(color){
	if(document.getElementsByName('theme-color'))document.getElementsByName('theme-color')[0].setAttribute('content',color);
}
function formatComma(v){
	return String(v).replace(/(\d)(?=(\d{3})+$)/g,'$1,');
}
function copyJson(o){
	var n={};
	for(var k in o)n[k]=o[k];
	return n;
}
function　mergeJson(from,to){
	for(var k in from)to[key]=from[k];
	return to;
}
function　getRndItemsFromArr(arr,count){
	var r=arr.slice();
	for (var i=ta.length;i>count;i--) Phaser.ArrayUtils.removeRandomItem(r);
	return Phaser.ArrayUtils.shuffle(r);
}
function　tweet(text,hashtags,tweetUrl){
	// hashtags:'A,B,C'
	tweetUrl=tweetUrl||location.href;
	window.open(
		'https://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&url='+tweetUrl+'&hashtags='+encodeURIComponent(hashtags),
		'share window','menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
	);
	return !1;
}
function　splice1(arr,location){
	var l=arr.length;
	if (l){
		while(location<l)arr[location++]=arr[location];
		--arr.length;
	}
}
function　changeTtl(t){
	document.title=t;
	this.M.GmObj.GAME_TITLE=t;
	document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',t);
}
if(__ENV!='prod'){
function myGa(action,category,label,value){
	console.log(action,category,label,value);
	gtag('event',action,{'event_category':category,'event_label':label,'value':value});
}
}else{
function myGa(action,category,label,value){
	gtag('event',action,{'event_category':category,'event_label':label,'value':value});
}
}