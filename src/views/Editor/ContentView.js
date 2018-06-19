import ShapeView from "./shapes/ShapeView";
export default class ContentView{
    constructor(rootElement, mediator){
        this.rootElement = rootElement;
        this.mediator = mediator;
    }

    delegateEvents(){
        this.mediator.subscribe("createNewShape", (eventName, data)=>{
            this.rootElement.appendChild(new ShapeView(this.mediator).render().rootElement);
        })
    }

    render(){
        return this.delegateEvents();
    }
}