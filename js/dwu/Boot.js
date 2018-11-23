BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!0,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'DWU-Game',
		MAIN_COLOR:'#ffffff',
		MAIN_TINT:0xffffff,
		MAIN_TEXT_COLOR:'#000000',
		MAIN_STROKE_COLOR:'#000000',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		////// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		curStage:1,
		Words:null,
		StageInfo:null,
		tw:'https://twitter.com/D_W_Underground',
		yt:'https://www.youtube.com/channel/UCSgheR9xOIcQjlkeXqIofLQ',
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.StageInfo=this.genStageInfo();
		this.M.NextScene('Preloader');
	},
	genStageInfo:function(){
		return {
			1:{name:'浅瀬',
				itemRespawnInterval:800,obstacleRespawnInterval:2500,
				targetScore:25,itemScale:1,obstacleScale:1,endless:!1,
			},
			2:{name:'ハート⚫ンダーブレード',
				itemRespawnInterval:900,obstacleRespawnInterval:2E3,
				targetScore:30,itemScale:.8,obstacleScale:1,endless:!1,
			},
			3:{name:'貯水タンク',
				itemRespawnInterval:1000,obstacleRespawnInterval:1500,
				targetScore:40,itemScale:.6,obstacleScale:1,endless:!1,
			},
			4:{name:'漫⚫村',
				itemRespawnInterval:1200,obstacleRespawnInterval:800,
				targetScore:50,itemScale:.5,obstacleScale:1.2,endless:!1,
			},
			5:{name:'深層WEB',
				itemRespawnInterval:800,obstacleRespawnInterval:1500,
				targetScore:666,itemScale:1,obstacleScale:1,endless:!0,
			},
		};
	},
	genWords:function(){
		var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				OtherGames:'他のゲーム',
				Score:'獲得:',
				Target:'目標:',
				NoneTarget:'深層',
				Again:'もう一度',
				HowTo:'あそびかた\n\nゆっくりしていってねを集めよう！\nオタクくんはさけましょう。\n画面の左を'+touchJP+'すると小さく。\n右は大きく。',
				TwBtn:'結果をツイート',
				Back:'もどる',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'DWUゲーム',
				GameOver:'ゲームオーバー',
				Clear:'クリア',
			},
			en:{
			},
		};
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
		this.M.S.load();
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		this.load.atlasXML('greySheet',p+'images/public/sheets/greySheet.png',p+'images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite',p+'images/public/sheets/GameIconsWhite.png',p+'images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon',p+'images/public/VolumeIcon/VolumeIconW.png',p+'images/public/VolumeIcon/VolumeIconW.json');
		var a={
			'PubLogo':p+'images/public/logo/logo.png',
			'wp':'images/odanoharukasu/wp.jpg',
			'twp':'images/odanoharukasu/twp70.png',
			'title':'images/dwu/title.png',
			'dwu1':'images/dwu/dwu1.png',
			'dwu2':'images/dwu/dwu2.png',
			'dwu3':'images/dwu/dwu3.png',
			'goal1':'images/dwu/goal1.jpg',
			'goal2':'images/dwu/goal2.jpg',
			'goal3':'images/dwu/goal3.jpg',
			'goal4':'images/dwu/goal4.jpg',
			'goal5':'images/dwu/goal5.jpg',
			'bg1':'images/dwu/bg1.jpg',
			'bg2':'images/dwu/bg2.jpg',
			'bg3':'images/dwu/bg3.jpg',
			'bg4':'images/dwu/bg4.jpg',
			'bg5':'images/dwu/bg5.jpg',
			'bg6':'images/dwu/bg6.jpg',
			'bg7':'images/dwu/bg7.jpg',
			'bg8':'images/dwu/bg8.jpg',
			'bg9':'images/dwu/bg9.jpg',
			'eff':'images/dwu/eff.png',
			'otaku1':p+'images/UMI/Bullets/FujoshiA.png',
			'otaku2':p+'images/UMI/Bullets/FujoshiB.png',
			'otaku3':p+'images/UMI/Bullets/OtakuA.png',
			'otaku4':p+'images/UMI/Bullets/OtakuB.png',
			'otaku5':p+'images/UMI/Bullets/OtakuC.png',
			'otaku6':p+'images/UMI/Bullets/OtakuD.png',
			'otaku7':p+'images/UMI/Enemies/You.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			TitleBGM:p+'sounds/BGM/P/PerituneMaterial_Snowy_Day2',
			PlayBGM:p+'sounds/BGM/P/picopiconostalgie',
			OnStart:p+'sounds/SE/LabJP/Btn/decision8',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision9',
			Back:p+'sounds/SE/LabJP/Btn/decision6',
			GameOver:p+'sounds/VOICE/K_VoiceFighter/game_over',
			HitObstacle:p+'sounds/SE/LabJP/Battle/Fight/kick-high1',
			GetItem:p+'sounds/SE/LabJP/Life/Run/dash-leather-shoes1_SHORT',
			Clear:p+'sounds/SE/LabJP/System/cursor4',
		};
		for(var k in s){
			var f=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[f+'.mp3',f+'wav']);
		}
	},
	loadComplete:function(){
		// this.stage.disableVisibilityChange=!1;
		this.input.maxPointers=2;
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.S.txt(this.world.centerX,this.world.height*.85,this.M.G.TOUCH_WORD+'してスタート\n'+this.M.G.TOUCH_WORD_EN+' TO PLAY',this.M.S.styl(25));
		this.M.SE.setSounds(this.sounds);
		this.sound.volume=.5;
		getQuery('mute')&&(this.sound.mute=!0);
		this.game.input.onDown.addOnce(__ENV!='prod'?this.start:this.M.S.logo,this);
	},
	start:function(){this.M.NextScene(__ENV!='prod'?getQuery('s')||'Title':'Title')},
};