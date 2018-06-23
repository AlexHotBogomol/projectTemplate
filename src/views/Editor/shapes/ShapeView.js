import './ShapeView.scss';
export default class ShapeView{
    static ON_ACTIVATE = "onActivate";
    static resize = false;
    static typeOfSizer = "";
    constructor(mediator){
        this.rootElement = this.createRootElement();
        this.sizers = this.createSizer(this.sizerPositions);
        this.mediator = mediator;
        this.rootElement.X = "";
        this.rootElement.Y = "";
        this.prevDeltaX = 0;
        this.prevDeltaY = 0;
        this.previousX = "";
        this.previousY = "";
    }
    static get sizerCoef(){
        return{
            lt : {
                a : -1,
                b : -1,
                c : 1,
                d : 1,
            },
            rb : {
                a : 1,
                b : 1,
                c : 0,
                d : 0,
            },
            lb : {
                a : -1,
                b : 1,
                c : 1,
                d : 0,
            },
            rt : {
                a : 1,
                b : -1,
                c : 0,
                d : 1,
            },
            lc : {
                a : -1,
                b : 0,
                c : 1,
                d : 0,
            },
            rc : {
                a : 1,
                b : 0,
                c : 0,
                d : 0,
            },
            tc : {
                a : 0,
                b : -1,
                c : 0,
                d : 1,
            },
            bc : {
                a : 0,
                b : 1,
                c : 0,
                d : 0,
            },
        }
    }
    get sizerPositions(){
        return{
            lt : "lt",
            rt : "rt",
            lb : "lb",
            rb : "rb",
            lc : "lc",
            rc : "rc",
            bc : "bc",
            tc : "tc",
        }
    }
    get classNames(){
        return {
            root: "Shape",
            type: "Shape--rect",
            active: "isActive",
            sizer: "sizer",
        }
    }

    get isActive(){
        return this._isActive;
    }

    set isActive(value){
        const wasInactive = !this._isActive && value;
        this._isActive = value;
        this.rootElement.classList.toggle(this.classNames.active, this._isActive);

        if(this.isActive){
            this.rootElement.addEventListener("mousedown", this.handlerMouseDown);
        }else{
            this.rootElement.removeEventListener("mousedown", this.handlerMouseDown);
        }

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

    createSizer(position){
        const elements = [];
        for(let key in position){
            const element = document.createElement("div");
            element.classList.add(this.classNames.sizer);
            element.classList.add(key);
            this.rootElement.appendChild(element);
            elements.push(element);
        }
        return elements;
    }

    handlerMouseDown = ({target, clientX, clientY}) =>{
        // ShapeView.resize = this.sizers.some(function(sizer){
        //     return sizer.contains(target);
        // });

        this.sizers.forEach(function(sizer){
            if(sizer.contains(target)){
                ShapeView.resize = true;
                ShapeView.typeOfSizer = sizer.classList[1];
            }
        });
        this.previousX = clientX;
        this.previousY = clientY;
        this.rootElement.X = getComputedStyle(this.rootElement).left;
        this.rootElement.Y = getComputedStyle(this.rootElement).top;
        document.addEventListener("mousemove", this.handlerMouseMove);
    };
    handlerMouseUp =()=>{
        document.removeEventListener("mousemove", this.handlerMouseMove);
        ShapeView.resize = false;
        this.prevDeltaX = 0;
        this.prevDeltaY = 0;
    };

    handlerMouseMove =({clientX, clientY}) =>{
        const deltaX = clientX - this.previousX;
        const deltaY = clientY - this.previousY;

        if(ShapeView.resize){
            this.rootElement.style.width = this.rootElement.offsetWidth + ShapeView.sizerCoef[ShapeView.typeOfSizer].a*(deltaX -this.prevDeltaX) + "px";
            this.rootElement.style.height = this.rootElement.offsetHeight + ShapeView.sizerCoef[ShapeView.typeOfSizer].b*(deltaY -this.prevDeltaY) + "px";
            this.prevDeltaX = deltaX;
            this.prevDeltaY = deltaY;

            this.move(ShapeView.sizerCoef[ShapeView.typeOfSizer].c*deltaX,ShapeView.sizerCoef[ShapeView.typeOfSizer].d*deltaY);
        }
        else{
            this.move(deltaX, deltaY);
        }
    };
    move =(deltaX, deltaY)=>{
        this.rootElement.style.left = parseInt(this.rootElement.X) + deltaX + "px";
        this.rootElement.style.top = parseInt(this.rootElement.Y) + deltaY + "px";
    };

    delegateEvents(){
        this.rootElement.addEventListener("dragstart", function (){
            event.preventDefault();
        });
        document.addEventListener("mouseup", this.handlerMouseUp);
        this.rootElement.addEventListener("dblclick", ()=>{
            this.toggleActive();
        });
        document.addEventListener("mousedown", (event)=>{
            if(!this.rootElement.contains(event.target)){
                this.isActive = false;
            }
        });
        this.mediator.subscribe(ShapeView.ON_ACTIVATE, (eventName, data)=>{
            if(data.target !== this) {
                this.isActive = false;
            }
        });
        return this
    }

    render(){
        this.delegateEvents();
        return this
    }
}
