{
    let view = {
        el:'#app',
        template:`
            <audio src={{url}}>
            
            </audio>
            <div>
                <button class="play">播放</button>
                <button class="pause">暂停</button>
            </div>
        `,
        render(data){
            this.$el.html(this.template.replace('{{url}}',data.url))
        },
        init(){
            this.$el = $(this.el)
        },
        play(){
            let audio = this.$el.find('audio')[0]  //dom元素
            audio.play()  //API
        },
        pause(){
            let audio = this.$el.find('audio')[0]  //dom元素
            audio.pause()  //API
        }
    }
    let model = {
        data:{
            id:'',
            name:'',
            singer:'',
            url:''
        },
        // setId(id){
        //     this.data.id = id
        // },
        get(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=>{
                // console.log(song)
                Object.assign(this.data,{id:song.id,...song.attributes})
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
            this.view.render(this.model.data)
            
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.play',()=>{
                this.view.play()
            })
            $(this.view.el).on('click','.pause',()=>{
                this.view.pause()
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


                                              

