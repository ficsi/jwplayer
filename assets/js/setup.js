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
            url: "assets/jwplayer/css/single-page-video.css"
        }
        this.tempVideos = [];
        this.tempTitles = [];
        this.tempImg = [];
        this.previewImage = null;
        this.statisticObj = null;
        this.playlistShelf = '';
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
                this.loadHomepageInitScreen();
                cdn = me.cdns.desktopHomepage;

                break;
            case 'wrapper-video-singlepage':
                cdn = me.cdns.desktopSinglePage
                break;
            case 'wrapper-video-live':
                cdn = me.cdns.desktopLive
                break;
            case 'wrapper-video-live_embed':
                cdn = me.cdns.desktopLiveEmbed
                break;
            case 'wrapper-video-embed':
                cdn = me.cdns.desktopEmbed
                break;
            default:
                console.log('no player found!')
        }

        let jwScriptCdn = document.createElement('script');
        jwScriptCdn.src = "//cdn.jwplayer.com/libraries/" + cdn + '.js';
        jwScriptCdn.onload = function () {
            if (document.querySelector('#wrapper-video-homepage')) {
                return
            } else {
                me.setPlayer();
                me.previewImage = me.jwplayer.getConfig().playlist[0].image;
            }

            if (document.querySelectorAll('.jw-error.jw-reset')) {
                console.log('no errors');
            }
        };
        document.head.append(jwScriptCdn);
    }

    setPlayer(callback) {
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
            displaytitle: true,
            related: {
                displayMode: self.playlistShelf,
                autoplaytimer: 0,
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
            statistics: self.statisticObj
        });
        this.jwplayer = jwplayer();
        if (typeof this.jwplayer.getConfig().playlist[0].image === 'undefined') {
            this.jwplayer.getConfig().playlist[0].image = self.poster_default;
        } else if (typeof this.jwplayer.getConfig().playlist[0].image === 'undefined') {
            return
        }


    }

    init = function init() {
        var me = this;
        this.setCDN();
        window.addEventListener('load', function () {
            if (me.checkPlayerErrors()) {
                var prevImageEl = document.createElement('img');
                prevImageEl.setAttribute('src', me.previewImage);
                prevImageEl.setAttribute('class', 'preview-image__on-error');
                document.querySelector('.jw-error').appendChild(prevImageEl);
            }
        })
    }

    setRalated(relatedVideos) {
        var me = this;
        window.addEventListener('load', function () {
            if (me.jwplayer) {
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
                            onHover[i].addEventListener("mouseenter", function (event) {
                                event.srcElement.style.opacity = "1";
                            });
                            onHover[i].addEventListener("mouseleave", function (event) {
                                event.srcElement.style.opacity = "0";
                            });
                        }
                    }
                })
            }
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
            if (me.jwplayer) {
                var oldConfig = me.jwplayer.getConfig();
                me.jwplayer.once('beforePlay', function (e) {
                    me.statisticsUrl = url;
                    me.videoId = videoId;
                    oldConfig.statistics = {
                        url: me.statisticsUrl,
                        param: me.videoId,
                        one: true
                    }
                    me.statisticObj = oldConfig;
                    me.jwplayer.setConfig(me.statisticObj)
                });
            }
        })


    }

    disableFloating() {
        var me = this;
        if (me.isFloating) {
            me.isFloating = false;
        }
    }

    destroyPlayer() {
        var me = this;
        if (me.jwplayer !== null) {
            me.jwplayer.on('complete', function (e) {
                me.jwplayer.remove();
                var vid = [];
                me.tempVideos.forEach(function (file) {
                    // console.log({file});
                    vid.push({file})
                });
            })
        }
    }

    loadHomepageInitScreen(data) {
        var containerVideo = document.createElement('div');
        containerVideo.setAttribute('id', 'jwplayer-x3');
        containerVideo.innerHTML = "<div id=\"big-play-button\" class=\"vjs-new-big-play-button\">\n" +
            "              <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 485 485\" width=\"72\" height=\"72s\">\n" +
            "                <g fill=\"rgba(255, 255, 255,0.7)\">\n" +
            "                  <path d=\"M413.974 71.026C368.171 25.225 307.274 0 242.5 0S116.829 25.225 71.026 71.026C25.225 116.829 0 177.726 0 242.5s25.225 125.671 71.026 171.474C116.829 459.775 177.726 485 242.5 485s125.671-25.225 171.474-71.026C459.775 368.171 485 307.274 485 242.5s-25.225-125.671-71.026-171.474zM242.5 455C125.327 455 30 359.673 30 242.5S125.327 30 242.5 30 455 125.327 455 242.5 359.673 455 242.5 455z\"></path>\n" +
            "                  <path d=\"M181.062 336.575L343.938 242.5l-162.876-94.075z\"></path>\n" +
            "                </g>\n" +
            "              </svg>\n" +
            "            </div>";
        document.querySelector("#wrapper-video-homepage").appendChild(containerVideo);
        var video_x3_titles_container = document.createElement('div');
        video_x3_titles_container.setAttribute('id', 'jwplayer-x3_titles-container');
        video_x3_titles_container.setAttribute('class', 'jwplayer-x3_list-titles');
        document.getElementById('wrapper-video-homepage').appendChild(video_x3_titles_container);
    }

    setPlayerType(type, videos = {}) {
        var me = this;
        me.isMethodCalled = true;
        switch (type) {
            case "player_x3":
                if (document.querySelector('#jwplayer-x3')) {

                    var videox3_skin = document.createElement('link');
                    videox3_skin.setAttribute('rel', 'stylesheet')
                    videox3_skin.setAttribute('href', 'assets/jwplayer/css/video_x3.css');
                    document.head.appendChild(videox3_skin);
                    var embedSkin = {
                        name: "x3_skin",
                        url: 'assets/jwplayer/css/video_x3.css'
                    };
                    me.defaultSkin = embedSkin;
                    document.addEventListener('load', function () {
                        me.setPlayer();

                    })

                    var container = document.getElementById("jwplayer-x3");
                    var titles_container = document.getElementById(
                        "jwplayer-x3_titles-container"
                    );

                    var screen = document.createElement("div");
                    screen.classList.add("screens-container");
                    if (titles_container !== null) {

                        videos.forEach(function (el) {
                            var img = document.createElement("img");
                            var title = document.createElement("p");
                            me.tempTitles.push(el.title);
                            title.innerText = el.title;
                            title.setAttribute("data-id", el.videoID);
                            titles_container.appendChild(title);

                            img.setAttribute("src", el.image);
                            me.tempImg.push(el.image)
                            img.setAttribute("data-id", el.videoID);
                            img.setAttribute("data-video", el.file);
                            me.tempVideos.push(el.file)
                            screen.appendChild(img);
                            screen.appendChild(titles_container);

                            container.appendChild(screen);
                        });
                    }

                    var list = document.querySelectorAll(".jwplayer-x3_list-titles p");
                    var screens_list = document.querySelectorAll(".screens-container > img");

                    list.forEach(function (el, index) {

                        el.addEventListener("mouseover", function (event) {
                            for (let i = 0; i < screens_list.length; i++) {
                                if (event.currentTarget.dataset.id === screens_list[i].dataset.id) {
                                    var image_top = document.querySelectorAll('img[data-id="' + screens_list[i].dataset.id + '"]');
                                    image_top[0].style.opacity = "1";
                                    window.localStorage.setItem("currentVideoUrl", image_top[0].dataset.video);
                                } else {
                                    var image_top = document.querySelectorAll('img[data-id="' + screens_list[i].dataset.id + '"]');
                                    image_top[0].style.opacity = "0";
                                }
                            }
                        });
                    });
                    var cln = document.querySelector('.screens-container').cloneNode(true);

                    function getConfig(file) {
                        me.playlist = {file: `${file}`}
                        me.autostart = true;
                    }

                    var videoFileTemp;
                    list.forEach(function (el, index) {
                        el.addEventListener("click", function (event) {
                            for (let i = 0; i < screens_list.length; i++) {
                                if (event.currentTarget.dataset.id === screens_list[i].dataset.id) {
                                    videoFileTemp =
                                        getConfig(screens_list[i].dataset.video);
                                }
                            }
                            me.setPlayer();
                            me.destroyPlayer();
                        });
                    });
                    var plb = document.querySelector('#big-play-button');
                    plb.addEventListener('click', function (event) {
                        getConfig(window.localStorage.getItem("currentVideoUrl"));
                        me.setPlayer();
                        me.destroyPlayer();
                    });
                }
                break;
            case "embed" :
                var embedSkin = {
                    name: "embed_skin",
                    url: 'assets/jwplayer/css/video_x3.css'
                };
                me.defaultSkin = embedSkin;
                break;
            case "live" :
                var embedSkin = {
                    name: "live_skin",
                    url: 'assets/jwplayer/css/video_x3.css'
                };
                me.defaultSkin = embedSkin;
                break;
            default:
                console.log('no player type is defined')
        }

    }

    checkPlayerErrors() {
        var me = this;
        if (me.jwplayer && typeof me.jwplayer.getConfig().errorEvent !== 'undefined') {
            return true
        } else {
            return false
        }
    }

    setErrorMsg(msg) {
        var me = this;
        window.addEventListener('load', function () {
            if (me.checkPlayerErrors()) {
                var msgContainer = document.createElement('div'),
                    errorContainer = document.querySelector('.jw-error-msg');
                errorContainer.setAttribute('class', 'custom-error-msg')
                errorContainer.innerHTML = '';
                errorContainer.innerHTML = msg;
            }
        });
    }


    showPlaylist() {
        var me = this;
        me.playlistShelf = 'shelfWidget';
        window.addEventListener('load', function () {
            if (me.jwplayer) {
                me.jwplayer.getConfig().related = me.playlistShelf;
            }
        })


    }


}

