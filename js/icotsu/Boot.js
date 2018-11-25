BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'CremateParty',
		MAIN_COLOR:'#ffffff',
		MAIN_TINT:0xffffff,
		MAIN_TEXT_COLOR:'#000000',
		MAIN_STROKE_COLOR:'#000000',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		tw:'https://twitter.com/Vtuber_Icotsu',
		yt:'https://www.youtube.com/channel/UCGFD_8TRHhlpjfqGhLUSk4g',
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.NextScene('Preloader');
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				OtherGames:'他のゲーム',
				ScoreFront:'香典',
				ScoreBack:'万円',
				ScoreBillion:'億',
				End:'終了',
				Time:'Time',
				HowTo:'遊び方\n\n法要通夜(生前)を真ん中の\n火の元へ持っていきましょう。\n火葬して\nIcotsuにすることができます。\n火葬すればするほど\n香典をゲット！\nあなたはいくら稼げるかな？',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'Icotsuゲーム',
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
			'fire':'images/icotsu/fire.png',
			'bg1':'images/icotsu/bg1.jpg',
			'title':'images/icotsu/title.png',
			'tamakin1':'images/icotsu/tamakin1.png',
			'tamakin2':'images/icotsu/tamakin2.png',
			'icotsu1':'images/icotsu/icotsu1.png',
			'icotsu2':'images/icotsu/icotsu2.png',
			'icotsu3':'images/icotsu/icotsu3.png',
			'icotsu4':'images/icotsu/icotsu4.png',
			'icotsu5':'images/icotsu/icotsu5.png',
			'icotsu6':'images/icotsu/icotsu6.jpg',
			'icotsu7':'images/icotsu/icotsu7.jpg',
			'missile':'images/icotsu/missile.png',
			'kerin':'images/icotsu/kerin.png',
			'pandei1':'images/icotsu/pandei1.png',
			'pandei2':'images/icotsu/pandei2.png',
			'wp':'images/icotsu/wp.jpg',
			'twp':'images/icotsu/twp60.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			TitleBGM:p+'sounds/BGM/C/CandyBouquet',
			PlayBGM:'sounds/icotsu/Desert2',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision13',
			OnStart:p+'sounds/SE/LabJP/Btn/decision27',
			Back:p+'sounds/SE/LabJP/Btn/decision23',
			missile:'sounds/icotsu/missile',
			explode:p+'sounds/SE/Explode/explode',
			fetch:p+'sounds/SE/LabJP/System/cancel1',
			fire:p+'sounds/SE/Fire/Flame_1',
			showpandei:p+'sounds/SE/Cartoon/ApricotJumpBounce',
			fin:p+'sounds/SE/LabJP/Btn/decision6',
			start:p+'sounds/SE/LabJP/Btn/decision5',
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