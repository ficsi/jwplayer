# JWPlayer Sportal CORP
introduce how to set up jwplayer
## #1

In the `html` file where want player to be placed need to:
    - set `div` element:
        - `id="wrapper-video-homepage"`
        - `id="wrapper-video-singlepage"`
        - `id="wrapper-video-live"`
        - `id="wrapper-video-live_embed"`
        -  `id="wrapper-video-embed"`
    -`import <setup.js>` 

## #2

need to call a new instance of `JwPlayerCorp`
and pass parameters: `containerId`&`playlist`.
 - if leave first parameter `containerId` empty it will take its default value ``
 - `playlist` must be  array of object/s containing `file, image, title, sources`
 -- where `sources` is array of objects

## #3 

call init() method for initialize the player `myInstance.init()`

## #4

There are sever methods helping control player behavior:
- `.setPlayerType(video_embed/video_live/video_x3)` where when calling type `video_x3` need to pass second argument `[{}]` 
 ``` 
myInstance.setPlayerType('player_x3', [
                   {
                       title: "Симпатизанти на БСП молели: Г-жо Караянчева, вразумете ги тези нашите!",
                       file: 'https://img2.novini.bg/uploads/video/2020-41/00028604.mp4',
                       image: 'https://img2.novini.bg/uploads/videos_pictures/2020-41/big/28604.jpg',
                       videoID: '28604',
           
                   },
                   {
                       title: "Продължават масовите проверки за носене на маски в градския транспорт",
                       file: 'https://img2.novini.bg/uploads/video/2020-41/00028603.mp4',
                       image: 'https://img2.novini.bg/uploads/videos_pictures/2020-41/big/28603.jpg',
                       videoID: '28603',
           
                   },
                   {
                       title: "Рановски към автоинструкторите: Ние предлагаме бъдещето!",
                       file: 'https://img2.novini.bg/uploads/video/2020-41/00028602.mp4',
                       image: 'https://img2.novini.bg/uploads/videos_pictures/2020-41/big/28602.jpg',
                       videoID: '28602',
           
                   },
               ])
``` 
    
- `.setRelated([{}])` / needs to pass array of objects 
- `.setAutoplay()`
- `.setStatistic(url, videoid)`
- `.disableFloating()`