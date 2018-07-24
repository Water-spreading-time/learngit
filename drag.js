;
~(() => {
    //私有属性  不需要被实例访问
    let transform = getTransform();

    //私有方法  不需要被实例访问  用来获取transform的兼容写法
    function getTransform(){
        let transform = '';
        let divStyle = document.createElement('div').style;
        let transformArr = ['transform','webkitTransform','MozTransform','msTransform','OTransform'];
        let i = 0;
        let len = transformArr.length;
        for(;i < len;i++){
            if(transformArr[i] in divStyle){
                return transform = transformArr[i];
            }
        }
        return transform;
    }

    //拖拽方法的原型
    Drag.prototype = {
        constructor:Drag,
        //定义初始化方法
        init(){
            this.setDrag();
        },

        //定义获取当前元素的属性的方法
        getStyle(property){
            return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.ele,false)[property] : this.ele.currentStyle[property];
        },

        //定义获取当前元素位置信息的方法
        getPosition(){
            const pos = {x:0,y:0};
            if(transform){
                let transformVal = this.getStyle(transform);
                if(transformVal === 'none'){
                    this.ele.style[transform] = 'translate(0,0)';
                }else{
                    let temp = transformVal.match(/-?\d+/g);
                    pos.x = parseInt(temp[4].trim());
                    pos.y = parseInt(temp[5].trim());
                }
            }else{
                if(this.getStyle('position') === 'static'){
                    this.ele.style.position = 'relative';
                }else{
                    pos.x = parseInt(this.getStyle('left') ? this.getStyle('left') : 0);
                    pos.y = parseInt(this.getStyle('top') ? this.getStyle('top') : 0);
                }
            }
            return pos
        },

        //定义设置当前元素位置的方法
        setPosition(pos){
            if(transform){
                this.ele.style[transform] = `translate(${pos.x}px,${pos.y}px)`;
            }else{
                this.ele.style.left = `${pos.x}px`;
                this.ele.style.top = `${pos.y}px`;
            }
        },

        //定义事件监听方法
        setDrag(){
            let self = this;
            this.ele.addEventListener('mousedown',start,false);
            function start(e){
                let pos = self.getPosition();
                self.startX = e.pageX;
                self.startY = e.pageY;
                self.sourceX = pos.x;
                self.sourceY = pos.y;
                document.addEventListener('mousemove',move,false);
                document.addEventListener('mouseup',end,false);
            }

            function move(e){
                let currentX = e.pageX;
                let currentY = e.pageY;
                let distanceX = currentX - self.startX;
                let distanceY = currentY - self.startY;
                self.setPosition({
                    x:(self.sourceX + distanceX).toFixed(),
                    y:(self.sourceY + distanceY).toFixed()
                })
            }

            function end(){
                document.removeEventListener('mousemove',move);
                document.removeEventListener('mouseup',end);
            }
        }
    };


    //定义拖拽构造函数
    function Drag(ele){
        this.ele = typeof ele === "object" ? ele : document.getElementById(ele);
        this.startX = 0;
        this.startY = 0;
        this.sourceX = 0;
        this.sourceY = 0;
        this.init();
    }

    //对外暴露接口
    window.Drag = Drag;
})();