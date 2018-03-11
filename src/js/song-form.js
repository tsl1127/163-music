//对应main区域
//用es6语法来写立即执行函数
{
    let view = {
        el:'.page >main',
        init(){
            this.$el=$(this.el)
        },
        template:`
        <form class="form">
            <div class="row">
                <label>
                        歌名</label>
                        <input name="name" type="text" value="__name__">
                
            </div>
            <div class="row">
                <label>
                            歌手</label>
                            <input name="singer" type="text" value="__singer__">
                    
            </div>
            <div class="row">
                    <label>
                            外链</label> 
                            <input name="url" type="text" value="__url__">
                                      
                </div>
                <div class="row">
                <label>
                        封面</label> 
                        <input name="cover" type="text" value="__cover__">
                                  
            </div>
            <div class="row">
            <label>
                    歌词</label> 
                    <textarea cols=100 rows=10 name="lyrics">__lyrics__</textarea>
                              
        </div>
            <div class="row actions">
                <button type="submit">保存</button>
            </div>
        </form>
        `,
        render(data ={}){
            let placeholders = ['name','url','singer','id','cover','lyrics']
            let html=this.template
            placeholders.map((string)=>{
                html=html.replace(`__${string}__`,data[string]||'')  //兼容
            })
            $(this.el).html(html)
            if(data.id){
                $(this.el).prepend('<h1>编辑歌曲</h1>')
            }else{
                $(this.el).prepend('<h1>新建歌曲</h1>')
            }
        },
        reset(){
            this.render({})   //保存了之后就清空
        }
    }
    let model={
        data:{
            name:'',
            singer:'',
            url:'',
            id:'',
            cover:'',
            lyrics:''
        },
        updata(data){
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name',data.name)
            song.set('singer',data.singer)
            song.set('url',data.url)
            song.set('cover',data.cover)
            song.set('lyrics',data.lyrics)
             return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
             })
        },
        create(data){
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            song.set('lyrics',data.lyrics)
             return song.save().then( (newSong)=>{
                // console.log(newSong)
                // let id=newSong.id
                // let attributes = newSong.attributes
                let {id,attributes} =newSong  //等于上面两句话
                // this.data.id=id
                // this.data.name=attributes.name
                // this.data.singer=attributes.singer
                // this.data.url = attributes.url
                // Object.assign(this.data,{   //等于上面4句话
                //     id:id,
                //     name:attributes.name,
                //     singer:attributes.singer,
                //     url:attributes.url
                // })
                // this.data= {id,...attributes}
                 Object.assign(this.data,{   //等同于上面，这里为什么又要赋值过来呢？是了让newSong里的新属性用过来
                     id,
                     ...attributes
                 })

            }, (error)=>{
                console.error(error);
            });
        }
    }
    
    let controller={
        init(view,model){
            this.view=view,
            this.view.init()
            this.model=model
            this.bindEvents()
            this.view.render(this.model.data)
            // window.eventHub.on('upload',(data)=>{
            //     this.model.data=data
            //     this.view.render(this.model.data)
            // })
            window.eventHub.on('select',(data)=>{
                this.model.data=data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',(data)=>{
                // data=data||{
                //     name:'',url:'',id:'',singer:''
                // }
                if(this.model.data.id){
                    this.model.data={
                        name:'',url:'',id:'',singer:'',cover:'',lyrics:''
                    }
                }else{
                    Object.assign(this.model.data,data)
                }
                // this.model.data=data
                this.view.render(this.model.data)                
            })
        },
        create(){
            let needs = ['name', 'singer', 'url','cover','lyrics'] //或者needs='name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(() => {
                    // console.log(this.model.data)
                    this.view.reset()
                    //this.model.data ==='ADDR 108
                    //以下为深拷贝
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)  //发布
                    //window.eventHub.emit('create',this.model.data)  //如果用上面的深拷贝代码，那么assign就
                    //可以继续用了
                })
        },
        updata(){
            let needs = ['name', 'singer', 'url','cover','lyrics'] //或者needs='name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            }) 
            this.model.updata(data)   
            .then(()=>{
                // alert('更新成功')
                window.eventHub.emit('updata',JSON.parse(JSON.stringify(this.model.data)))//深拷贝
            })      
        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    this.updata()
                }else{
                    this.create()
                }


               
            })
        }
    }
       
    controller.init(view,model)
}

