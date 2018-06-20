import './ShapeView.scss';
export default class ShapeView{
    static ON_ACTIVATE = "onActivate";

    constructor(mediator){
        this.rootElement = this.createRootElement();
        this.mediator = mediator;
    }

    get classNames(){
        return {
            root: "Shape",
            type: "Shape--rect",
            active: "isActive",
        }
    }

    get isActive(){
        return this._isActive;
    }

    set isActive(value){
        const wasInactive = !this._isActive && value;
        this._isActive = value;
        this.rootElement.classList.toggle(this.classNames.active, this._isActive);
        if(wasInactive){
            this.mediator.publish(ShapeView.ON_ACTIVATE, {
                target: this,
            })
        }
    }

    toggleActive = ()=>{
        this.isActive = !this.isActive;
    };

    createRootElement(){
        const element = document.createElement("div");
        element.classList.add(this.classNames.root);
        element.classList.add(this.classNames.type);
        return element;
    }

    delegateEvents(){
        document.addEventListener("dblclick", (event)=>{
            if(this.rootElement.contains(event.target)) {
                this.toggleActive();
                if(!this.isActive){
                    this.rootElement.removeEventListener("mousedown", this.handle);
                }
            }
        });
        document.addEventListener("click", (event)=>{
            if(!this.rootElement.contains(event.target)){
                this.isActive = false;
                this.rootElement.removeEventListener("mousedown", this.handle)
            }
        });
        this.mediator.subscribe(ShapeView.ON_ACTIVATE, (eventName, data)=>{
            if(data.target !== this) {
                this.isActive = false;
            }
            else{
                data.target.rootElement.addEventListener("mousedown", this.handle);
            }

        });
        return this
    }
    handle=(e)=>{
        var block = this.rootElement;
        block.style.position = "absolute";
        var coords = getCoords(block);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;
        moveAt(e);
        document.body.appendChild(block);
        document.addEventListener("mousemove", handler);
        document.addEventListener("mouseup", function(e){
            document.removeEventListener("mousemove", handler);
        });

        function moveAt(e) {
            block.style.left = e.pageX- shiftX +"px";
            block.style.top = e.pageY-shiftY +"px";
        }

        function handler(e){
            moveAt(e);
        }

        function getCoords(elem) {
            var box = elem.getBoundingClientRect();
            console.log(box.top + pageYOffset,);
            console.log(box.left + pageXOffset);
            return {
                top: box.top + pageYOffset,
                left: box.left + pageXOffset
            };
        }
        block.ondragstart = function() {
            return false;
        };
    };
    render(){
        this.delegateEvents();
        return this

    }
}
// var block = document.querySelector("#block1");
//
// block.addEventListener("mousedown", function(e){
//     var coords = getCoords(block);
//     var shiftX = e.pageX - coords.left;
//     var shiftY = e.pageY - coords.top;
//     moveAt(e);
//     document.addEventListener("mousemove", handler);
//     document.addEventListener("mouseup", function(e){
//         document.removeEventListener("mousemove", handler);
//     })
//
//     function moveAt(e) {
//         block.style.left = e.pageX- shiftX +"px";
//         block.style.top = e.pageY-shiftY +"px";
//     }
//
//     function handler(e){
//         moveAt(e);
//     }
//
//     function getCoords(elem) {   // кроме IE8-
//         var box = elem.getBoundingClientRect();
//         return {
//             top: box.top + pageYOffset,
//             left: box.left + pageXOffset
//         };
//     }
//
// }.bind(this))