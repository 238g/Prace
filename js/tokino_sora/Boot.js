BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'SoraGame',
		MAIN_COLOR:'#4195E2',
		MAIN_TINT:0x4195E2,
		MAIN_TEXT_COLOR:'#4F5FF0',
		MAIN_STROKE_COLOR:'#4F5FF0',
		WHITE_COLOR:'#ffffff',
		endTut:!1,
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		yt:'https://www.youtube.com/channel/UCp6993wxpyDPHUpavwDFqgg',
		tw:'https://twitter.com/tokino_sora',
		itemCount:8,
		ankimoCount:7,
		curBGMNum:1,
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.NextScene('Preloader');
	},
	genWords:function(){
		var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				ScoreFront:'スコア: ',
				HP:'HP: ',
				HowTo:'遊び方\n'+touchJP+'して上から落ちてくる\n"良いもの"をザシュッと刺そう！\nあん肝を刺すと回復するよ\n目指せ高得点！',
				Good:'良いもの',
				Bad:'悪いもの',
				TwBtn:'結果をツイート',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'そらゲーム',
				Again:'もう一度！',
				Back:'もどる',
				OtherGames:'他のゲーム',
				End:'終了！',
				Res:'結果',
				TwResB:'今日もザシュッといってらっしゃい！',
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
			'wp':'images/icotsu/wp.jpg',
			'twp':'images/icotsu/twp60.png',
			'sora1':'images/tokino_sora/sora1.png',
			'sora2':'images/tokino_sora/sora2.png',
			'sora3':'images/tokino_sora/sora3.png',
			'fire':'images/tokino_sora/fire.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadItems();
		this.loadAnkimo();
		this.loadAudio();
	},
	loadItems:function(){for(var i=1;i<=this.M.G.itemCount;i++)this.load.image('item'+i,'images/tokino_sora/item'+i+'.png');},
	loadAnkimo:function(){for(var i=1;i<=this.M.G.ankimoCount;i++)this.load.image('ankimo'+i,'images/tokino_sora/ankimo'+i+'.png');},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			OnBtn:p+'sounds/SE/LabJP/Btn/decision5',
			fire:p+'sounds/SE/LabJP/Btn/decision18',
			miss:p+'sounds/SE/LabJP/Btn/decision19',
			start:p+'sounds/SE/LabJP/Life/Other/police-whistle1',
			end:p+'sounds/SE/LabJP/Life/Other/police-whistle2',
			TitleBGM:p+'sounds/BGM/P/PerituneMaterial_Snowy_Day2',
			PlayBGM_1:p+'sounds/BGM/RainbowRush_loop',
			PlayBGM_2:p+'sounds/BGM/ANewDay',
			PlayBGM_3:p+'sounds/BGM/MitoDanceRevolution/plankton',
			scoreEff:p+'sounds/SE/LabJP/Performance/Anime/shakin1',
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