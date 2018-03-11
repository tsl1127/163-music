{
    let view ={
        el:'.page-1',
        init(){
            this.$el=$(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
        

    }
    let model = {}
    let controller = {
        init(view,model){
            this.view=view
            this.view.init()
            this.model=model
            this.bindEventHub()
            this.loadModule1()
            this.loadModule2()

        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName==='page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadModule1(){
            let script1 = document.createElement('script')
            script1.src="./js/page-1-1.js"  //路径是相对html的
            script1.onload=function(){
                // console.log('模块1加载完毕')
            }
            // script1.onerror = function(){
            //     alert('加载模块1错误')
            // }
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2 = document.createElement('script')
            script2.src="./js/page-1-2.js"  //路径是相对html的
            script2.onload=function(){
                // console.log('模块2加载完毕')
            }
            // script2.onerror = function(){
            //     alert('加载模块2错误')
            // }
            document.body.appendChild(script2)  
        }   

    }
    controller.init(view,model)
}