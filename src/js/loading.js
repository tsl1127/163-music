{
    let view = {
        el:'#siteLoading',
        show(){
            $(this.el).addClass('active')
        },
        hide(){
            $(this.el).removeClass('active')
        }

    }
    let controller={
        init(view){
            this.view=view
            this.bindEventHub()
        },
        bindEventHub(){
            window.eventHub.on('beforeUpload',()=>{
                // console.log('1')
                this.view.show()
            })
            window.eventHub.on('afterUpload',()=>{
                // console.log('2')
                this.view.hide()
            })
        }

    }
    controller.init(view)
}