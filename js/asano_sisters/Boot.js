BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!0,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'AsanoSistersGame',
		MAIN_COLOR:'#DFC2EE',
		MAIN_TINT:0xDFC2EE,
		MAIN_TEXT_COLOR:'#806AAB',
		MAIN_STROKE_COLOR:'#806AAB',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		yt:'https://www.youtube.com/channel/UCODNLyn3L83wEmC0DLL0cxA',
		tw:'https://twitter.com/asanohikariunei',
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.CharInfo=this.genCharInfo();
		this.M.G.Words=this.genWords();
		this.M.NextScene('Preloader');
	},
	genCharInfo:function(){
		return {
			1:{name:'朝ノ瑠璃',tint:0x73B2EF,color:'#73B2EF',
				tw:'https://twitter.com/asanoruri',
			},
			2:{name:'朝ノ茜',tint:0xEA94C6,color:'#EA94C6',
				tw:'https://twitter.com/asanoakane',
			},
			3:{name:'朝ノ光',tint:0xA97EB7,color:'#A97EB7',
				tw:'https://twitter.com/asanohikarihaa1',
			},
		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				ScoreFront:'Score: ',
				HowTo:'＜ 遊び方 ＞\n画面を長押しして\n朝ノ姉妹をジャンプさせよう！\n丸太を渡ってスコアをかせげ！\n下へ落ちたらHPが減るよ\nHPが0になるとゲームオーバー！\nあなたは高スコアを出せるかな？',
				End:'終了！',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				OtherGames:'他のゲーム',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'朝ノ姉妹ゲーム',
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
			'1_1':'images/asano_sisters/1_1.png',
			'1_2':'images/asano_sisters/1_2.png',
			'2_1':'images/asano_sisters/2_1.png',
			'2_2':'images/asano_sisters/2_2.png',
			'3_1':'images/asano_sisters/3_1.png',
			'3_2':'images/asano_sisters/3_2.png',
			'log':'images/asano_sisters/log.png',
			'face_1':'images/asano_sisters/face_1.jpg',
			'face_2':'images/asano_sisters/face_2.jpg',
			'face_3':'images/asano_sisters/face_3.jpg',
			'title':'images/asano_sisters/title.png',
			'bg1':'images/asano_sisters/bg1.jpg',
			'bg2':'images/asano_sisters/bg2.jpg',
			'w':'images/public/w.jpg',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			TitleBGM:p+'sounds/BGM/ChiptuneAdventuresStage1',
			PlayBGM:p+'sounds/BGM/Awake',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision22',
			OnStart:p+'sounds/SE/LabJP/Btn/decision27',
			Back:p+'sounds/SE/LabJP/Btn/decision6',
			jump:p+'sounds/SE/LabJP/Battle/Fight/setup1',
			start:p+'sounds/SE/LabJP/Life/Other/police-whistle2',
			landing:'sounds/asano_sisters/landing1',
			hit_log:p+'sounds/SE/LabJP/Battle/Fight/kick-low1',
			die:'sounds/asano_sisters/magic-worp1',
			fin:p+'sounds/SE/LabJP/People/people_people-performance-cheer1',
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
		this.game.input.onDown.addOnce(__ENV!='prod'?this.start:this.M.S.logo,this);
	},
	start:function(){this.M.NextScene(__ENV!='prod'?getQuery('s')||'Title':'Title')},
};