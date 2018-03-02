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
                li.text(song.name)
                return li
            })
            $el.find('ul').empty()  //清空ul里的
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model={
        data:{
            songs:[]
        }
    }
    let controller={
        init(view,model){
            this.view=view
            this.model=model
            this.view.render(this.model.data)
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