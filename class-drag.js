;
~($ => {
    //私有变量  供内部方法访问  控制元素的层级关系
    let startZ = 1;

    class Drag {
        constructor(ele){
            this.ele = $(ele);
            this.startX = 0;
            this.startY = 0;
            this.curosX = 0;
            this.curosY = 0;
            this.init();
        }

        init(){
            this.setDrag();
        }

        // 获取元素的位置
        getPosition(){
            if(this.ele.css('transform') === 'none'){
                this.ele.css('transform','translate3d(0,0,0)');
                this.startX = Number(this.ele.css('transform').match(/-?\d+/g)[4].trim());
                this.startY = Number(this.ele.css('transform').match(/-?\d+/g)[5].trim());
            }else{
                this.startX = Number(this.ele.css('transform').match(/-?\d+/g)[13].trim());
                this.startY = Number(this.ele.css('transform').match(/-?\d+/g)[14].trim());
            }
        }

        //设置元素的位置
        setPosition(pos){
            this.ele.css({transform:`translate3d(${pos.x}px,${pos.y}px,${startZ}px)`});
        }

        //拖拽事件
        setDrag() {
            let self = this;
            self.ele.on('mousedown', e => start(e));

            function start(e) {
                e.preventDefault();
                self.getPosition();
                self.curosX = e.pageX;
                self.curosY = e.pageY;
                startZ++;
                document.addEventListener('mousemove', move, false);
                document.addEventListener('mouseup', end, false);
            }

            function move(e) {
                let moveX = e.pageX - self.curosX;
                let moveY = e.pageY - self.curosY;
                self.setPosition({x: (moveX + self.startX).toFixed(), y: (moveY + self.startY).toFixed()})
            }

            function end(e) {
                self.curosX = e.pageX;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', end)
            }
        }
    }

    //挂载到jquery原型上
    $.fn.extend({
        becomDrag(){
            new Drag(this[0]);
            return this
        }
    })
})(jQuery);