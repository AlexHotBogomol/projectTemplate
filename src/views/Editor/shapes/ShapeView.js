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
            }
        });
        document.addEventListener("click", (event)=>{
            if(!this.rootElement.contains(event.target)){
                this.isActive = false;
            }
        });
        // this.rootElement.addEventListener("dblclick", this.toggleActive);
        this.mediator.subscribe(ShapeView.ON_ACTIVATE, (eventName, data)=>{
            if(data.target !== this){
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