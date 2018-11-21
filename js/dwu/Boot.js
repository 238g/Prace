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
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		curStage:1,
		Words:null,
		StageInfo:null,
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.StageInfo=this.genStage();
		this.M.NextScene('Preloader');
	},
	genStage:function(){
		return {
			1:{name:'',
				itemRespawnInterval:800,obstacleRespawnInterval:1800,
			},
			2:{

			},
			3:{

			},
			4:{

			},
			5:{

			},
		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				//TODO
				Start:'スタート',
				OtherGames:'他のゲーム',
				/*
				HowTo:'',
				ScoreBack:'aaaaaa',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'DWUゲーム',
				*/
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
			'dwu1':'images/dwu/dwu1.png',


			/*
			'gauge':'images/odanoharukasu/gauge.jpg',
			'bg1':'images/odanoharukasu/bg1.jpg',
			'bg2':'images/odanoharukasu/bg2.png',
			'haruto1':'images/odanoharukasu/haruto1.png',
			'haruto2':'images/odanoharukasu/haruto2.png',
			'nobuhime1':'images/odanoharukasu/nobuhime1.png',
			'nobuhime2':'images/odanoharukasu/nobuhime2.png',
			'bar':'images/odanoharukasu/bar.png',
			'title':'images/odanoharukasu/title.png',
			*/
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			/*
			TitleBGM:p+'sounds/BGM/CopyCat',
			PlayBGM:p+'sounds/BGM/GreatBoss',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision9',
			OnStart:p+'sounds/SE/LabJP/Btn/decision4',
			Back:p+'sounds/SE/LabJP/Btn/decision6',
			StopBar:p+'sounds/SE/LabJP/Performance/Anime/shakin2',
			Last:'sounds/odanoharukasu/last',
			*/
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