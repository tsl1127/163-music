{
    let view={
        el:'#songList-container',
        template:`
        <ul class="songList">
        </ul>
        `,
        render(data){
            let $el=$(this.el)
            $el.html(this.template)

            let {songs}=data
            let liList = songs.map((song)=>{
                let li=$('<li></li>')
                li.text(song.name).attr('data-song-id',song.id)
                return li
            })
            $el.find('ul').empty()  //清空ul里的
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        },
        activeItem(li){
            let $li = $(li)
            $li.addClass('active').siblings('.active').removeClass('active')
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model={
        data:{
            songs:[]    
        },
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs=songs.map((song)=>{
                    return {id:song.id,...song.attributes}   //只要部分数据
                })
                return songs
            })
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
            this.bindEvents()
            this.getAllSongs()
            this.bindEventHub()

        },
        getAllSongs(){
            return this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                this.view.activeItem(e.currentTarget)
                let songId=e.currentTarget.getAttribute('data-song-id')
                window.eventHub.emit('select',{id:songId})
            })
        },
        bindEventHub(){
            window.eventHub.on('upload',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('create',(songData)=>{   //订阅
                // console.log(songData)
                // console.log(JSON.stringify(this.model.data))
                this.model.data.songs.push(songData)
                // console.log(JSON.stringify(this.model.data))
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}