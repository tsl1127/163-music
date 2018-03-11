{
    let view = {
        el:'#app',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {song,status} = data
            $(this.el).find('img.cover').attr('src',song.cover)  //改src
            if($(this.el).find('audio').attr('src')!==song.url){  //为了歌曲播放暂停后可以继续播放而不是重新播放
                $(this.el).find('audio').attr('src',song.url)
               let audio  = $(this.el).find('audio')[0] //或者直接写  .get[0].onended
            //    console.log(audio)
            // .on('ended',()=>{
            //     this.pause()
            // })
                audio.onended = ()=>{
                    window.eventHub.emit('songEnd')
                }
                audio.ontimeupdate = ()=>{
                    this.showLyric(audio.currentTime)
                    // console.log(audio.currentTime)
                }
            }            
            if(status === 'playing'){
                $(this.el).find('.container').addClass('playing')
            }else{
                $(this.el).find('.container').removeClass('playing')
            }
            this.$el.find('.song-description>h1').text(song.name)
            // console.log(typeof song.lyrics)  //是一个string
            let {lyrics}=song
            // console.log(lyrics)
            let array = lyrics.split('\n').map((string)=>{
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)
                // console.log(matches)
                if(matches){
                    p.textContent = matches[2]
                    let time = matches[1]
                    let parts = time.split(':')
                    let mimutes = parts[0]   //分钟
                    let seconds = parts[1]
                    let newTime =parseFloat(mimutes,10)*60+parseFloat(seconds,10)

                    p.setAttribute('data-time',newTime)
                }else{
                    p.textContent = string
                }
                
                return p
            })
            // console.log(array)
            this.$el.find('.lyric>.lines').append(array)

        },
        showLyric(time){
            let allP = this.$el.find('.lyric>.lines>p')
            // this.$el.find('.lyric').css('border','1px solid red')
            // let previousTime =0
            let p
            for(let i=0;i<allP.length;i++){
                if(i===allP.length-1){
                    // console.log(allP[i])
                    p=allP[i]
                    break
                }else{
                    let currentTime = allP.eq(i).attr('data-time')
                    let nextTime = allP.eq(i+1).attr('data-time')
                    if(time < currentTime ){
                        p =allP[0]
                        break
                    }
                    else if(currentTime <= time && time < nextTime){
                        // console.log(allP[i])
                        // let height = allP.eq(i).offset().top-this.$el.find('.lyric').offset().top
                        // this.$el.find('.lyric > .lines').css('transform',`translateY(${-height}px)`)
                        p =allP[i]                                              
                        break
                    }
                }
               
            }
            console.log(p)
            let pHeight = p.getBoundingClientRect().top
            // console.log(this.$el.find('.lyric > .lines'))
            let lineHeight = this.$el.find('.lyric > .lines')[0].getBoundingClientRect().top
            let height = pHeight - lineHeight
            // console.log(height)
            this.$el.find('.lyric > .lines').css(
                {
                    transform:`translateY(${-height}px)`
                }
            )
            // console.log(p)
           
            $(p).addClass('active').siblings('.active').removeClass('active')
        },
        play(){
            // console.log($(this.el).find('audio'))
            $(this.el).find('audio')[0].play()
            
        },
        pause(){
            $(this.el).find('audio')[0].pause()
        }

    }
    let model = {
        data:{
            song :{
                id:'',
                name:'',
                singer:'',
                url:'',
                cover:'',
                lyrics:''
            },
            status:'paused'  //2个状态
        },
        // setId(id){
        //     this.data.id = id
        // },
        get(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{
                // console.log(song)
                // console.log(2)
                Object.assign(this.data.song,{id:song.id,...song.attributes})
                return song
                // return {
                //     id:song.id,
                //     ...song.attributes
                // }

              // 成功获得实例
              // todo 就是 id 为 57328ca079bc44005c2472d0 的 Todo 对象实例
            })
        }
    }
    let controller = {
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            // this.model.setId(id)
            this.model.get(id).then(()=>{
            //    console.log (this.model.data)
            // console.log(this.model.data.song.lyrics)
            this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.icon-play',()=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
                
            })
            $(this.view.el).on('click','.icon-pause',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
                
            })
            // $(this.view.el).on('ended','audio',()=>{
            //     console.log(2)
            // })
            window.eventHub.on('songEnd',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })

        },
        getSongId(){
            // console.log(window.location.search)  返回结果带有?，我们不想要?
            let search = window.location.search
            if (search.indexOf('?') === 0) {   //如果开头是？
                search = search.substring(1)  //只要从第一个开始的及后面的，第0个去掉
            }
            // console.log(search)

            let array = search.split('&').filter((v => v))  //如果v是真值，我就要，如果v是假值，就不要；
            //这里查询参数是以&隔开的，这里过滤是为了避免有2个&连着
            let id = ''
            for (let i = 0; i < array.length; i++) {
                let kv = array[i].split('=')
                let key = kv[0]  //=号的左边
                let value = kv[1]  //=号的右边
                if (key === 'id') {
                    id = value
                    break;
                }
            } 
            return id 
        }
    }
    controller.init(view,model)
}


                                              

