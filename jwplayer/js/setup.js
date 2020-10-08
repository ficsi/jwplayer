class JwPlayerCorp {

    constructor(containerId, playlist) {
        this.containerId = containerId;
        this.playlist = playlist;
        this.jwplayer = null;
        this.autostart = false;
        this.mute = false;
        this.videoId = '';
        this.statisticsUrl = '';
        this.isFloating = true;
        this.isMethodCalled = false;
        this.defaultSkin = {
            name: "alaska",
            url: "./css/single-page-video.css"
        }
    }


    cdns = {
        desktopHomepage: 'uyRqCQL7',
        desktopSinglePage: 'epdbYfl3',
        desktopLive: 'tqktqjL5',
        desktopLiveEmbed: 'qyGqPLIK',
        desktopEmbed: 'EaqQecX1',

    }

    checkPageVideo() {
        var me = this
        var playerContainer = document.querySelector("[data-id='sportal-video-container']");
        var playerContainerId = playerContainer.getAttribute('id');
        if (me.containerId === '') {
            me.containerId = playerContainerId;
        }
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
            if (document.querySelectorAll('.jw-error.jw-reset')) {
                console.log('no errors')
            }
        };
        document.head.append(jwScriptCdn);

    }

    setPlayer(callback) {
        console.log('step #1');
        var self = this;
        jwplayer(document.querySelector('#' + this.checkPageVideo()).getAttribute('id')).setup({
            playlist: self.playlist,
            videoID: self.videoId,
            skin: self.defaultSkin,
            controls: true,
            autostart: self.autostart,
            floating: self.isFloating,
            mute: self.mute,
            visualplaylist: true,
            // displaytitle: false,
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
            statistics: {
                url: this.statisticsUrl,
                param: this.videoId,
                one: true
            }
        });
        this.jwplayer = jwplayer();
        if (this.jwplayer.getConfig().playlist[0].image) {
            return;
        } else if (typeof this.jwplayer.getConfig().playlist[0].image === 'undefined') {
            this.jwplayer.getConfig().playlist[0].image = self.poster_default;
        }

    }

    init = function init() {
        this.setCDN();
    }

    setRalated(relatedVideos) {
        var me = this;
        window.addEventListener('load', function () {
            me.jwplayer.on('complete', function (e) {
                me.jwplayer.setControls(false);
                var wrap = document.querySelector('#' + me.containerId);
                var outer = document.createElement("div");
                var container = document.createElement("div");
                var div = document.createElement("div");
                container.classList.add("related-container");
                div.classList.add("related-wrapper");
                div.appendChild(outer);
                container.appendChild(div);
                wrap.appendChild(container);
                if (relatedVideos) {
                    relatedVideos.map(el => {
                        var a = document.createElement("a");
                        var img = document.createElement("img");
                        var span = document.createElement("span");
                        span.classList.add("related_item-title");
                        span.innerText = el.title;
                        img.setAttribute("src", el.image);
                        a.appendChild(img);
                        a.appendChild(span);
                        a.setAttribute("href", el.file);
                        a.setAttribute("target", "_blank");
                        outer.appendChild(a);
                    });
                    var onHover = document.getElementsByClassName("related_item-title");
                    for (var i = 0; i < onHover.length; i++) {
                        onHover[i].addEventListener("mouseover", function (event) {
                            event.toElement.style.opacity = "1";
                        });
                        onHover[i].addEventListener("mouseleave", function (event) {
                            event.fromElement.style.opacity = "0";
                        });
                    }
                }
            })
        });

    }

    setAutoplay() {
        var me = this;
        me.autostart = true;
        if (me.autostart) {
            me.mute = true
        } else {
            me.mute = false
        }
    }

    setStatistic(url, videoId) {
        //TODO: should update url & videoId before video starts
        var me = this;
        window.addEventListener('load', function () {
            var oldConfig = me.jwplayer.getConfig();
            me.jwplayer.once('beforePlay', function (e) {
                console.log(e);
                console.log(oldConfig);
                me.statisticsUrl = url;
                me.videoId = videoId;
                oldConfig.statistics = {
                    url: me.statisticsUrl,
                    param: me.videoId,
                    one: true
                }
                me.jwplayer.setConfig(oldConfig)

            });
            me.jwplayer.once('firstFrame', function (e) {
                console.log(me.jwplayer.getConfig().statistics)
            })

        })


    }

    disableFloating() {
        var me = this;
        if (me.isFloating) {
            me.isFloating = false;
        }
    }

    setPlayerType(type) {
        var me = this;
        me.isMethodCalled = true;
        switch (type) {
            case "player_x3":
                var embedSkin = {
                    name: "x3_skin",
                    url: 'x3.css'
                };
                me.defaultSkin = embedSkin;
                break;
            case "embed":

                var embedSkin = {
                    name: "embed_skin",
                    url: 'embed.css'
                };
                me.defaultSkin = embedSkin;

                break;
            case "live":
                var embedSkin = {
                    name: "live_skin",
                    url: 'live.css'
                };
                me.defaultSkin = embedSkin;
                break;
            default:
                console.log('no type found')
        }

    }

}


//
// + var singleVideoPlayer = new JwPlayerSportal('containerId', 'videoLists');
// + singleVideoPlayer.setRelated('object list');
// + singleVideoPlayer.setAutoplay();
// + singleVideoPlayer.statics('url', 'elemntName');
// -/+ singleVideoPlayer.onlyAudio();
// singleVideoPlayer.setPoster();
// + singleVideoPlayer.disableFloating();
// singleVideoPlayer.enableSharing('url iframe')
// singleVideoPlayer.setPlayerType('x3 | embed | live ');
// singleVideoPlayer.init();
//