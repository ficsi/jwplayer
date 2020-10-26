class JwPlayerSportal {
    constructor(playlist, related = {}, autostart = false, mute = false, poster_default, statistics = {}) {
        this.jwplayer = null;
        this.playlist = playlist;
        this.related = related;
        this.autostart = autostart;
        this.mute = mute;
        this.statistics = statistics;
        this.poster_default = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg';
    };

    cdns = {
        desktopHomepage: 'uyRqCQL7',
        desktopSinglePage: 'epdbYfl3',
        desktopLive: 'tqktqjL5',
        desktopLiveEmbed: 'qyGqPLIK',
        desktopEmbed: 'EaqQecX1',

    }

    checkPageVideo() {
        var playerContainer = document.querySelector("[data-id='sportal-video-container']");
        var playerContainerId = playerContainer.getAttribute('id');
        return playerContainerId;
    }

    setCDN() {
        var me = this;
        var cdn;
        switch (this.checkPageVideo()) {
            case 'wrapper-video-homepage':
                console.log('wrapper-video-homepage');
                cdn = me.cdns.desktopHomepage
                break;
            case 'wrapper-video-singlepage':
                console.log('wrapper-video-singlepage');
                cdn = me.cdns.desktopSinglePage
                break;
            case 'wrapper-video-live':
                console.log('wrapper-video-live');
                cdn = me.cdns.desktopLive
                break;
            case 'wrapper-video-live_embed':
                console.log('wrapper-video-live_embed');
                cdn = me.cdns.desktopLiveEmbed
                break;
            case 'wrapper-video-embed':
                console.log('wrapper-video-embed');
                cdn = me.cdns.desktopEmbed
                break;
            default:
                console.log('no player found!')
        }

        console.log(cdn);
        let jwScriptCdn = document.createElement('script');
        jwScriptCdn.src = "//cdn.jwplayer.com/libraries/" + cdn + '.js';

        jwScriptCdn.onload = function () {
            console.log('CDN LOADED');
            me.setPlayer();
            if(document.querySelectorAll('.jw-error.jw-reset')){
                console.log('null')
            }
        };
        document.head.append(jwScriptCdn);

    }

    setPlayer(callback) {
        console.log('step #1');
        var self = this;


        jwplayer(document.querySelector('#' + this.checkPageVideo()).getAttribute('id')).setup({
            playlist: self.playlist,
            videoID: "",
            skin: {
                name: "alaska",
                url: "./css/single-page-video.css"
            },
            controls: true,
            autostart: self.autostart,
            floating: true,
            mute: self.mute,
            visualplaylist: true,
            displaytitle: false,
            related: {
                displayMode: "shelf",
                autoplaytimer: 0,
                oncomplete: "show",
                onclick: "link"
            },
            intl: {
                bg: {
                    sharing: {
                        heading: "Споделете видео"
                    },
                    fullscreen: "цял екран",
                    hd: "качество",
                    related: {
                        heading: "Още видеа"
                    }
                }
            },
            statistics: self.statistics
        });
        this.jwplayer = jwplayer();
        if (this.jwplayer.getConfig().playlist[0].image) {
            return;
        } else if(typeof this.jwplayer.getConfig().playlist[0].image === 'undefined' ){
            this.jwplayer.getConfig().playlist[0].image = self.poster_default;
        }

    }

    on(option) {
        console.log('step #2');
        var me = this;
        console.log(option);
        console.log(me.jwplayer)

        me.jwplayer.on('play', function () {
            console.log('on event')
        })


    }


    async init() {
        await this.setCDN();

    }


}

