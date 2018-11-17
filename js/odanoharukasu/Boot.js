BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!0,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'HarukasuGame',
		MAIN_COLOR:'#ffffff',
		MAIN_TINT:0xffffff,
		MAIN_TEXT_COLOR:'#000000',
		MAIN_STROKE_COLOR:'#000000',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
	})},
	preload:function(){var p='https://238g.github.io/Parace/images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.NextScene('Preloader');
	},
	genAAAAAAAAAAAAAAAAAA:function(){
	
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				/*
				Back:'もどる',
				Collection:'コレクション',
				Close:'とじる',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				TwBtnB:'これでツイート',
				OtherGames:'他のゲーム',
				SelectGacha:'ガチャを選択',
				Page:'ページ',
				Card:'カード',
				Download:'ダウンロード',
				PlayGacha1:'1回ガチャる',
				PlayGacha10:'10連ガチャ',
				Skip:'スキップ',
				TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
				TwHT:'Vtuberゲーム',
				Count:'回',
				TwSelectChar:'引いたカード: ',
				Sheet:'枚',
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
		var p='https://238g.github.io/Parace/';
		this.load.atlasXML('greySheet',p+'images/public/sheets/greySheet.png',p+'images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite',p+'images/public/sheets/GameIconsWhite.png',p+'images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon',p+'images/public/VolumeIcon/VolumeIconW.png',p+'images/public/VolumeIcon/VolumeIconW.json');
		var a={
			'PubLogo':p+'images/public/logo/logo.png',
			'wp':'images/odanoharukasu/wp.jpg',
			// 'TWP':p+'images/FOckingGlasses/TranslucentWhitePaper.png',
			// '70TWP':p+'images/vtuber_game_1/70TranslucentWhitePaper.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p='https://238g.github.io/Parace/';
		var s={
			/*
			TitleBGM:'sounds/BGM/vtuber_game_2/buy_something',
			OnBtn:'sounds/SE/LabJP/Btn/decision9',
			OnStart:'sounds/SE/LabJP/Btn/decision24',
			Slide:'sounds/SE/LabJP/Btn/decision22',
			OnCollection:'sounds/SE/LabJP/Btn/decision7',
			OnBack:'sounds/SE/LabJP/Btn/decision6',
			StopRare:'sounds/SE/LabJP/Btn/decision16',
			MoveCard:'sounds/SE/LabJP/Btn/decision10',
			LastShow:'sounds/SE/LabJP/Btn/decision25',
			GetUR:'sounds/SE/LabJP/Performance/Anime/eye-shine1',
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
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.S.txt(this.world.centerX,this.world.height*.85,this.M.G.TOUCH_WORD+'してスタート\n'+this.M.G.TOUCH_WORD_EN+' TO PLAY',this.M.S.styl(25));
		this.M.SE.setSounds(this.sounds);
		this.sound.volume=.5;
		getQuery('mute')&&(this.sound.mute=!0);
		this.game.input.onDown.addOnce((__ENV!='prod')?this.start:this.M.S.logo,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?getQuery('s')||'Title':'Title')},
};