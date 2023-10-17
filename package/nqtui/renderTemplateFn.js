import { render } from "lit";
export function renderTemplateFn(RootTemplateResult, props) {
    //check whether or not "renderContainer" is a string and handle it
    //accordingly.
    if (typeof props.renderContainer === "string" ||
        props.renderContainer instanceof String) {
        props.renderContainer = document.querySelector(props.renderContainer);
    }
    const renderTemplateFn = () => {
        return render(RootTemplateResult(), props.renderContainer, props.renderOptions);
    };
    renderTemplateFn();
    //return "renderTemplateFn" function to allow re-rendering of whole root
    //component tree.
    return renderTemplateFn;
}
