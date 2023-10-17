import { AsyncDirective, directive, } from "lit/async-directive.js";
import { noChange } from "lit";
import adaptSyncEffect from "./adaptations/adaptEffect/adaptSyncEffect";
export const renderComponentNamesAsWrapperComments = (() => {
    let renderComponentNamesAsWrapperComments = false;
    return (newrenderComponentNamesAsWrapperComments) => {
        if (newrenderComponentNamesAsWrapperComments) {
            renderComponentNamesAsWrapperComments =
                newrenderComponentNamesAsWrapperComments;
        }
        else {
            return renderComponentNamesAsWrapperComments;
        }
    };
})();
// type ComponentTree = Record<string, ComponentTree | string>
// const componentTree: Component  = {
// }
class $ extends AsyncDirective {
    constructor(partInfo) {
        super(partInfo);
        //boolean flag to enable initialization of the component in the update method.
        this.updateFlag = "initialize";
        //initialize cleanups for component. this includes:
        //1. general component cleanup for all its effects and memos
        //2. cleanup of the effect created from the function (that returns a template result) the component returns
        this.cleanups = [];
    }
    disconnected() {
        this.cleanups.forEach((cleanup) => cleanup());
    }
    //first time initialization of component
    initialize(props, part, Component) {
        this.props = props;
        return this.initializeComponent(Component, part, this.props);
    }
    initializeComponent(Component, part, props) {
        var _a, _b;
        //store the function (that returns a template result) the component returns in `htmlFn` for later use
        let htmlFn;
        //initialize component effects and memos and store the 1st cleanup
        this.cleanups.push(adaptSyncEffect(() => {
            htmlFn = Component(props);
        }, []));
        let templateResult;
        const componentCleanup = adaptSyncEffect(() => {
            templateResult = htmlFn();
            if (this.updateFlag !== "initialize") {
                this.setValue(templateResult);
            }
        });
        //store 2nd cleanup
        this.cleanups.push(componentCleanup);
        // conditionally render component name as comments
        // console.log(part);
        if (renderComponentNamesAsWrapperComments()) {
            const componentNameComment = document.createComment(`__$$promethium-tag-${Component.name}`);
            const startNode = part.startNode;
            (_a = startNode === null || startNode === void 0 ? void 0 : startNode.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(componentNameComment.cloneNode(), startNode);
            const endNode = part.endNode;
            (_b = endNode === null || endNode === void 0 ? void 0 : endNode.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(componentNameComment, endNode.nextSibling);
        }
        this.updateFlag = "updateProps";
        return templateResult;
    }
    update(part, [Component, props]) {
        //initialize component for the first time or update props based on the state of `updateFlag`
        return this[this.updateFlag](props, part, Component);
    }
    reconnected() {
        this.updateFlag = "initialize";
    }
    render() {
        return noChange;
    }
    updateProps(props) {
        for (const prop in props) {
            this.props[prop] = props[prop];
        }
        return noChange;
    }
}
const h = directive($);
export default h;
