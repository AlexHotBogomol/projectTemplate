export default class ToolsView{
    constructor(rootElement, mediator){
        this.rootElement = rootElement;
        this.addNewShapeButton = null;
        this.mediator = mediator;
    }

    collectChildNodes(){
        this.addNewShapeButton = this.rootElement.querySelector(".Editor-toolItem");
        return this;
    }

    onAddNewShape = () => {
        this.mediator.publish("createNewShape", {
            type : "rect",
        })
    };

    delegateEvents(){
        this.addNewShapeButton.addEventListener("click", this.onAddNewShape);
        return this;
    }

    render(){
        return this.collectChildNodes().delegateEvents();
    }
}