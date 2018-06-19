import './views/Editor/Editor.scss';
import ToolsView from "./views/Editor/ToolsView";
import ContentView from "./views/Editor/ContentView";
import Mediator from "./utils/Mediator";

const mediator = new Mediator();
const toolsView = new ToolsView(document.querySelector(".Editor-tools"), mediator);
const contentView = new ContentView(document.querySelector(".Editor-content"), mediator);



toolsView.render();
contentView.render();