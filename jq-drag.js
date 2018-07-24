//基于jq的拖拽插件  添加至jq原型

;
~(() => {
    Drag.prototype = {
        constructor:Drag,
        init(){
            this.setDrag()
        },

        getPosition(){
            if(this.ele.css('transform') === 'none'){
                this.ele.css('transform','translate(0,0)');
            }
            this.startX = Number(this.ele.css('transform').match(/-?\d+/g)[4].trim());
            this.startY = Number(this.ele.css('transform').match(/-?\d+/g)[5].trim());
        },

        setPosition(pos){
            this.ele.css({transform:`translate(${pos.x}px,${pos.y}px)`});
        },

        setDrag(){
            let self = this;
            self.ele.on('mousedown',e => start(e));
            function start(e){
                self.getPosition();
                self.curosX = e.pageX;
                self.curosY = e.pageY;
                document.addEventListener('mousemove',move,false);
                document.addEventListener('mouseup',end,false);
            }

            function move(e){
                let moveX = e.pageX - self.curosX;
                let moveY = e.pageY - self.curosY;
                self.setPosition({x:(moveX + self.startX).toFixed(),y:(moveY + self.startY).toFixed()})
            }

            function end(e){
                self.curosX = e.pageX;
                document.removeEventListener('mousemove',move);
                document.removeEventListener('mouseup',end)
            }
        }
    };

    function Drag(ele){
        this.ele = $(ele);
        this.startX = 0;
        this.startY = 0;
        this.curosX = 0;
        this.curosY = 0;
        this.init();
    }

    window.Drag = Drag;
})();

~(($) => {
    $.fn.extend({
        becomDrag(){
            new Drag(this[0]);
            return this
        }
    })
})(jQuery);