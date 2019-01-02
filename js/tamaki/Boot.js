BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!0,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'TamakiGame',
		MAIN_COLOR:'#EDF1FD',
		MAIN_TINT:0xffffff,
		MAIN_TEXT_COLOR:'#A7A4CD',
		MAIN_STROKE_COLOR:'#A7A4CD',
		WHITE_COLOR:'#ffffff',
		endTut:!1,
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		yt:'https://www.youtube.com/channel/UC8NZiqKx6fsDT3AVcMiVFyA',
		tw:'https://twitter.com/norioo_',
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
				ScoreBack:'信たま',
				HowTo:'遊び方\n\n犬山たまきの背中に織田信姫を落とせ！\n５回のチャレンジで\nどこまでスコアを伸ばせるか！？\n信たまてぇてぇ',
				TwBtn:'結果をツイート',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'たまきゲーム',
				Again:'もう一度！',
				Back:'もどる',
				OtherGames:'他のゲーム',
				Mmd:'MMD-icemega5',
				End:'終了！',
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
			'title':'images/tamaki/title.png',
			'nobuhime':'images/tamaki/nobuhime.png',
			'tamaki':'images/tamaki/tamaki.png',
			'tamaki_2':'images/tamaki/tamaki_2.png',
			'docking':'images/tamaki/docking.png',
			'delight':'images/tamaki/delight.png',
			'splash':'images/tamaki/splash.png',
			'bg':'images/tamaki/bg.jpg',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			TitleBGM:p+'sounds/BGM/CopyCat',
			PlayBGM:p+'sounds/BGM/RainbowRush_loop',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision7',
			fall:p+'sounds/SE/LabJP/Battle/Fight/setup1',
			start:p+'sounds/SE/LabJP/Life/Other/police-whistle1',
			death:p+'sounds/SE/LabJP/Battle/Fight/kick-high1',
			people:'sounds/tamaki/people_people-shout-oo2',
			end:p+'sounds/SE/LabJP/Life/Other/police-whistle2',
		};
		for(var k in s){
			var f=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[f+'.mp3',f+'wav']);
		}
	},
	loadComplete:function(){
		// this.stage.disableVisibilityChange=!1;
		// this.input.maxPointers=2;
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.S.txt(this.world.centerX,this.world.height*.85,this.M.G.TOUCH_WORD+'してスタート\n'+this.M.G.TOUCH_WORD_EN+' TO PLAY',this.M.S.styl(25));
		this.M.SE.setSounds(this.sounds);
		this.sound.volume=.5;
		getQuery('mute')&&(this.sound.mute=!0);
		this.game.input.onDown.addOnce(__ENV!='prod'?this.start:this.M.S.logo,this);
	},
	start:function(){this.M.NextScene(__ENV!='prod'?getQuery('s')||'Title':'Title')},
};