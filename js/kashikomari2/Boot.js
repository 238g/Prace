var __YoutubePlayer;
function onYouTubeIframeAPIReady(){
	__YoutubePlayer=new YT.Player('YoutubePlayer',{
		height:window.innerHeight/2-100,
		width:window.innerWidth,
		videoId:'cOtT55-SH4k',
		playerVars:{playsinline:1,origin:location.protocol+'//'+location.hostname+'/'},
		events:{onReady:function(){},onStateChange:__onPlayerStateChange}
	});
};
var __GameStart=function(){};
var __GamePause=function(){};
var __onPlayerStateChange=function(event){
	// -1 – 未開始 UNSTARTED
	// 0 – 終了 ENDED
	// 1 – 再生中 PLAYING
	// 2 – 一時停止 PAUSED
	// 3 – バッファリング中 BUFFERING
	// 5 – 頭出し済み CUED
	// console.log('========================',event.data);
	if(event.data==YT.PlayerState.PLAYING)return __GameStart();
	if(event.data==YT.PlayerState.PAUSED)return __GamePause();
};
BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'MariGame',
		MAIN_COLOR:'#fffd3a',
		MAIN_TINT:0xfffd3a,
		MAIN_TEXT_COLOR:'#eaad18',
		MAIN_STROKE_COLOR:'#eaad18',
		WHITE_COLOR:'#ffffff',
		endTut:!1,
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		yt:'',
		tw:'',
		curMusic:1,
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.MusicScores=this.genMusicalScores();
		this.M.G.JudgeInfo=this.genJudgeInfo();
		this.M.NextScene('Preloader');
	},
	genWords:function(){
		var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				/*
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
				*/
			},
			en:{
			},
		};
	},
	genMusicalScores:function(){
		return {
			1:{
				title: 'やさしさに包まれたなら',
				youtubeId: 'cOtT55-SH4k',
				body: [ 
					0,0,0,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // ～後奏～
					4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 目に映る
					1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 優しさに
					4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // カーテンを
					4,4,4,4, // ～間奏～
					1,2,3,3, 4,3,2,1, 1,2,3,4, 4,1,2,3, // 目に映る
					1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 優しさに
					4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 雨上がりの
					4,4,4,4, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 大切な箱
					4,1,1,1, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 心の奥に
					1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 毎日
					4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1,　// 小さい頃は
					2,2,2,2, 1,1,1,1, 4,4,4,4, 3,3,3,3, // ～間奏～
					2,2,3,3, 2,2,3,3, 2,2,3,3, 2,2,3,3, // 目に映る
					3,3,2,2, 3,3,2,2, 3,3,2,2, 3,3,2,2, // 優しさに
					4,1,1,1, 4,1,1,1, 4,3,2,1, 4,3,2,1, // カーテンを
					4,4,4,4, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 大人になっても
					4,1,1,1, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 優しい
					1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 不思議に
					4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 小さい頃は
					1,0,0,0, 0,0,0,0, 0,0,0,0, // ～前奏～
				],
				frequency: 571, // 60/bpm*1000 // bpm:105
				type: 'Number',
				speed: 2000,
				delay: 2000,
			},
			2:{
				title:'メルト',
				youtubeId: 'wRmYHK14yyI',
				body: [ 
					0, 0,1,1,1, 4,4,4,4, 3,3,3,3, 2,2,2,2, 1,1,1,1, 1,0,2,2, // ～後奏～
					4,4,3,3, 2,2,1,1, // 今すぐ
					4,3,2,1, 4,1,2,4, 3,2,1,1, 2,3,3,4, // メルト 
					4,3,2,1, 4,1,2,4, 3,2,1,1, 2,3,3,4, // メルト
					0,0,3,4, 3,2,3,3, 1,3,4,3, 1,2,2,1, // En
					3,4,1,4, 1,3,3,1, 3,1,1,3, 1,3,3,1, // En
					4,4,3,3, 3,4,4,3, 4,3,2,1, 4,3,3,4, 4,3,3,4, // ～間奏～
					3,0,3,3, 1,0,1,1, 0,1,1,1, // ～間奏～
					4,4,3,3, 2,2,1,1, 0,3,0,0, 0,3,0,0, // お願い
					1,2,3,4, 4,3,2,1, // 思いよ届け
					4,3,2,1, 4,1,2,4, 3,2,1,1, 2,3,3,4, // メルト 
					4,3,2,1, 4,1,2,4, 3,2,1,1, 2,3,3,4, // メルト
					1,2,3,4, 4,3,2,2, 2,3,2,2, 3,4,3,3, 2,2,1,1, // しょうがない
					1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // かばんに
					4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 天気予報
					0,0,0,0,　4,4,4,4, 3,3,3,3, 1,1,1,1, // ～間奏～
					1,2,3,4, 4,3,2,1, // だって君の
					4,3,2,1, 4,1,2,4, 3,2,1,1, 2,3,3,4, // メルト 
					4,3,2,1, 4,1,2,4, 3,2,1,1, 2,3,3,4, // メルト
					1,2,3,4, 4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // ピンクの
					1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 思い切って
					4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 朝目が覚めて
					4,4,4,4, 3,3,3,3, 1,1,1,1, // ～前奏～
					0,0, // ～前奏～
				],
				frequency: 706, // 60/bpm*1000 // bpm:85
				type: 'Number',
				speed: 2000,
				delay: 800,
			},
		};
	},
	genJudgeInfo:function(){
		return {
			1:{combo:1,color:'#ff00ff',text:'PERFECT!!',score:5000,margin:50,},
			2:{combo:1,color:'#00bfff',text:'COOL!',score:3000,margin:100,},
			3:{combo:1,color:'#d2691e',text:'GOOD',score:1000,margin:200,},
			4:{combo:1,color:'#9400d3',text:'BAD',score:100,margin:350,},
			5:{combo:0,color:'#32cd32',text:'FALSE',score:-1000,margin:500,},
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

			/*
			'sora1':'images/tokino_sora/sora1.png',
			'sora2':'images/tokino_sora/sora2.png',
			'sora3':'images/tokino_sora/sora3.png',
			'fire':'images/tokino_sora/fire.png',
			'wc':p+'images/HoneyStrap/WhiteCircle.png',
			'titlebg_1':'images/tokino_sora/titlebg_1.png',
			'titlebg_2':'images/tokino_sora/titlebg_2.png',
			'titlebg_3':'images/tokino_sora/titlebg_3.png',
			'titlebg_4':'images/tokino_sora/titlebg_4.png',
			'title':'images/tokino_sora/title.png',
			'playbg':'images/tokino_sora/playbg.jpg',
			*/
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadYoutube();
		this.loadAudio();
	},
	loadYoutube:function(){
		var tag=document.createElement('script');
		tag.src='https://www.youtube.com/iframe_api';
		var firstScriptTag=document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			/*
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
