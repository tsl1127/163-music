{
    let view = {
        el:'#tabs',
        init(){
            this.$el=$(this.el)   //$为调jquery库
        }
    }
    let model={}
    let controller = {
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.tabs-nav > li',(e)=>{
               let $li= $(e.currentTarget)
            //    let index=$li.index()  //知道点击的是第几个li
                let tabName = $li.attr('data-tab-name')
                // console.log(tabName)
               $li.addClass('active').siblings().removeClass('active')
               window.eventHub.emit('selectTab',tabName)
            })
        }
    }
    controller.init(view,model)
}