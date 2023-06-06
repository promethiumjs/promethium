import {html as $60affc760575bcb6$re_export$html, render as $2lYhx$render, noChange as $2lYhx$noChange} from "lit-html";
import {classMap as $60affc760575bcb6$re_export$classMap} from "lit-html/directives/class-map.js";
import {styleMap as $60affc760575bcb6$re_export$styleMap} from "lit-html/directives/style-map.js";
import {when as $60affc760575bcb6$re_export$when} from "lit-html/directives/when.js";
import {choose as $60affc760575bcb6$re_export$choose} from "lit-html/directives/choose.js";
import {map as $60affc760575bcb6$re_export$map} from "lit-html/directives/map.js";
import {repeat as $60affc760575bcb6$re_export$repeat} from "lit-html/directives/repeat.js";
import {join as $60affc760575bcb6$re_export$join} from "lit-html/directives/join.js";
import {range as $60affc760575bcb6$re_export$range} from "lit-html/directives/range.js";
import {ifDefined as $60affc760575bcb6$re_export$ifDefined} from "lit-html/directives/if-defined.js";
import {cache as $60affc760575bcb6$re_export$cache} from "lit-html/directives/cache.js";
import {keyed as $60affc760575bcb6$re_export$keyed} from "lit-html/directives/keyed.js";
import {guard as $60affc760575bcb6$re_export$guard} from "lit-html/directives/guard.js";
import {live as $60affc760575bcb6$re_export$live} from "lit-html/directives/live.js";
import {ref as $60affc760575bcb6$re_export$ref, createRef as $60affc760575bcb6$re_export$createRef} from "lit-html/directives/ref.js";
import {templateContent as $60affc760575bcb6$re_export$templateContent} from "lit-html/directives/template-content.js";
import {unsafeHTML as $60affc760575bcb6$re_export$unsafeHTML} from "lit-html/directives/unsafe-html.js";
import {unsafeSVG as $60affc760575bcb6$re_export$unsafeSVG} from "lit-html/directives/unsafe-svg.js";
import {until as $60affc760575bcb6$re_export$until} from "lit-html/directives/until.js";
import {asyncAppend as $60affc760575bcb6$re_export$asyncAppend} from "lit-html/directives/async-append.js";
import {asyncReplace as $60affc760575bcb6$re_export$asyncReplace} from "lit-html/directives/async-replace.js";
import {AsyncDirective as $2lYhx$AsyncDirective, directive as $2lYhx$directive} from "lit-html/async-directive.js";



const $afe3fcee1cf27466$var$changedArray1 = [];
const $afe3fcee1cf27466$var$changedArray2 = [];
let $afe3fcee1cf27466$var$one = true;
function $afe3fcee1cf27466$export$2e2bcd8739ae039(componentAsyncDirective) {
    const changedArray = $afe3fcee1cf27466$var$one ? $afe3fcee1cf27466$var$changedArray1 : $afe3fcee1cf27466$var$changedArray2;
    const newOne = $afe3fcee1cf27466$var$one ? false : true;
    changedArray.push(componentAsyncDirective);
    if (changedArray.length === 1) queueMicrotask(()=>{
        $afe3fcee1cf27466$var$one = newOne;
        changedArray.forEach((componentAsyncDirective)=>componentAsyncDirective.changed = true);
        changedArray.length = 0;
    });
}


const $67984ac6bea14c49$export$24642de4c13f18dd = [];


function $64ce9db61466f237$export$2e2bcd8739ae039(effect) {
    let cleanupNode = effect.cleanupTree;
    effect.cleanupTreeNodePointer?.forEach((part)=>{
        cleanupNode = cleanupNode?.get(part);
    });
    return cleanupNode;
}


function $43f4dc316840b203$export$2e2bcd8739ae039(effect) {
    effect.observableSubscriptionSets.forEach((observableSubscriptionSet)=>{
        observableSubscriptionSet.delete(effect);
    });
    effect.observableSubscriptionSets.clear();
}


function $c5f83c37529ef113$export$52109d3cb696f898(effect, fn) {
    //set `childCount` back to zero to enable children effects to obtain correct positions upon recreation
    effect.childCount = 0;
    //fire cleanups make sure proceedings go smoothly
    const cleanupSet = (0, $64ce9db61466f237$export$2e2bcd8739ae039)(effect)?.get(0);
    cleanupSet?.forEach((cleanup)=>{
        cleanup();
    });
    cleanupSet?.clear();
    //push effect onto context to enable tracking by state and memos
    (0, $67984ac6bea14c49$export$24642de4c13f18dd).push(effect);
    fn(cleanupSet);
    //add cleanup to remove effect from all old subscriptions
    cleanupSet?.add(()=>(0, $43f4dc316840b203$export$2e2bcd8739ae039)(effect));
    //remove effect from context to disable tracking by state and memos
    (0, $67984ac6bea14c49$export$24642de4c13f18dd).pop();
}



function $f1bfabf6cab52e09$var$traverseAndEvaluate(cleanupNode) {
    let nextChildNode = 0;
    while(cleanupNode?.get(nextChildNode)){
        if (nextChildNode === 0) {
            const cleanupSet = cleanupNode.get(0);
            cleanupSet.forEach((cleanup)=>{
                cleanup();
            });
            cleanupSet.clear();
        } else {
            const nextCleanupNode = cleanupNode.get(nextChildNode);
            $f1bfabf6cab52e09$var$traverseAndEvaluate(nextCleanupNode);
        }
        nextChildNode++;
    }
}
function $f1bfabf6cab52e09$export$2e2bcd8739ae039(effect) {
    const cleanupNode = (0, $64ce9db61466f237$export$2e2bcd8739ae039)(effect);
    $f1bfabf6cab52e09$var$traverseAndEvaluate(cleanupNode);
}


function $ba142649eb282e8a$export$2e2bcd8739ae039(effect, fn) {
    (0, $c5f83c37529ef113$export$52109d3cb696f898)(effect, (cleanupSet)=>$ba142649eb282e8a$var$internalFn(effect, fn, cleanupSet));
    //return cleanup function for effect and its descendants
    return ()=>(0, $f1bfabf6cab52e09$export$2e2bcd8739ae039)(effect);
}
function $ba142649eb282e8a$var$internalFn(effect, fn, cleanupSet) {
    //call effect with previous return value
    const fnReturnValue = fn(effect.returnValue);
    //create `returnValueCleanup` to be called on next run of effect
    const returnValueCleanup = ()=>{
        if (typeof fnReturnValue === "function") //extract new `returnValue` from effect's returned function
        effect.returnValue = fnReturnValue();
    };
    cleanupSet?.add(returnValueCleanup);
}




function $8358f029406b3bf0$export$b43a9f030091b83d(effect, fn, depArray, options = {}) {
    (0, $c5f83c37529ef113$export$52109d3cb696f898)(effect, (cleanupSet)=>$8358f029406b3bf0$var$internalFn(effect, fn, depArray, options, cleanupSet));
    return ()=>(0, $f1bfabf6cab52e09$export$2e2bcd8739ae039)(effect);
}
function $8358f029406b3bf0$var$internalFn(effect, fn, depArray, options = {}, cleanupSet) {
    //if effect is supposed to be deferred, do nothing on the first run
    if (effect.firstRun && options.defer) effect.firstRun = false;
    else {
        //call effect with previous return value and previous state values of tracking state and memos in an `argsArray`
        const fnReturnValue = fn(effect.returnValue, effect.argsArray || []);
        //create `returnValueCleanup` to be called on next run of effect
        const returnValueCleanup = ()=>{
            if (typeof fnReturnValue === "function") //extract new `returnValue` from effect's returned function
            effect.returnValue = fnReturnValue();
        };
        //add cleanup to obtain new return value
        cleanupSet?.add(returnValueCleanup);
    }
    //set tracking to "implicit" to enable tracking by state and memos in `depArray`
    effect.tracking = "implicit";
    effect.argsArray = depArray.map((state)=>state());
    //set tracking back to "depArray" to disable other forms of implicit tracking
    //(only allow state and memos in `depArray` to track effect)
    effect.tracking = "depArray";
}





function $b44040c6e9499e95$export$2e2bcd8739ae039(effect, depArray) {
    (0, $c5f83c37529ef113$export$52109d3cb696f898)(effect, ()=>$b44040c6e9499e95$var$internalFn(effect, depArray));
    return effect.argsArray;
}
function $b44040c6e9499e95$var$internalFn(effect, depArray) {
    effect.tracking = "implicit";
    effect.argsArray = depArray.map((state)=>state());
    effect.tracking = "depArray";
}


function $77230c8e9bc6ad07$export$9a2f3fcb7b180ad7(effect, fn, depArray, options = {}) {
    (0, $c5f83c37529ef113$export$52109d3cb696f898)(effect, (cleanupSet)=>$77230c8e9bc6ad07$export$2e2bcd8739ae039(effect, fn, depArray, options, cleanupSet));
    return [
        ()=>(0, $f1bfabf6cab52e09$export$2e2bcd8739ae039)(effect),
        ()=>(0, $b44040c6e9499e95$export$2e2bcd8739ae039)(effect, depArray),
        effect.argsArray, 
    ];
}
function $77230c8e9bc6ad07$export$2e2bcd8739ae039(effect, fn, depArray, options = {}, cleanupSet) {
    //set tracking to "implicit" to enable tracking by state and memos in `depArray`
    effect.tracking = "implicit";
    effect.argsArray = depArray.map((state)=>state());
    //set tracking back to "depArray" to disable other forms of implicit tracking
    //(only allow state and memos in `depArray` to track effect)
    effect.tracking = "depArray";
    //if effect is supposed to be deferred, do nothing on the first run
    if (effect.firstRun && options.defer) effect.firstRun = false;
    else {
        //call effect with previous return value and previous state values of tracking state and memos in an `argsArray`
        const fnReturnValue = fn(effect.returnValue, effect.argsArray);
        //create `returnValueCleanup` to be called on next run of effect
        const returnValueCleanup = ()=>{
            if (typeof fnReturnValue === "function") //extract new `returnValue` from effect's returned function
            effect.returnValue = fnReturnValue();
        };
        //add cleanup to obtain new return value
        cleanupSet?.add(returnValueCleanup);
    }
}


const $01da2ed5eea48407$var$executeFns = {
    implicit: (0, $ba142649eb282e8a$export$2e2bcd8739ae039),
    depArray: (0, $8358f029406b3bf0$export$b43a9f030091b83d),
    componentFn: (0, $77230c8e9bc6ad07$export$9a2f3fcb7b180ad7)
};
var $01da2ed5eea48407$export$2e2bcd8739ae039 = $01da2ed5eea48407$var$executeFns;


const $7bf57c0302477c3b$var$asyncEffectArray1 = [];
const $7bf57c0302477c3b$var$asyncEffectArray2 = [];
let $7bf57c0302477c3b$var$one = true;
function $7bf57c0302477c3b$export$2e2bcd8739ae039(fn) {
    const asyncEffectArray = $7bf57c0302477c3b$var$one ? $7bf57c0302477c3b$var$asyncEffectArray1 : $7bf57c0302477c3b$var$asyncEffectArray2;
    const newOne = $7bf57c0302477c3b$var$one ? false : true;
    asyncEffectArray.push(fn);
    if (asyncEffectArray.length === 1) queueMicrotask(()=>{
        $7bf57c0302477c3b$var$one = newOne;
        asyncEffectArray.forEach((fn)=>fn());
        asyncEffectArray.length = 0;
    });
}


const $c894b2ac0568d031$var$renderEffectArray1 = [];
const $c894b2ac0568d031$var$renderEffectArray2 = [];
let $c894b2ac0568d031$var$one = true;
function $c894b2ac0568d031$export$2e2bcd8739ae039(fn) {
    const renderEffectArray = $c894b2ac0568d031$var$one ? $c894b2ac0568d031$var$renderEffectArray1 : $c894b2ac0568d031$var$renderEffectArray2;
    const newOne = $c894b2ac0568d031$var$one ? false : true;
    renderEffectArray.push(fn);
    if (renderEffectArray.length === 1) queueMicrotask(()=>{
        $c894b2ac0568d031$var$one = newOne;
        renderEffectArray.forEach((fn)=>fn());
        renderEffectArray.length = 0;
    });
}


function $d5fa6cf0040a6711$export$2e2bcd8739ae039(effect, execute, fn, depArray, signal) {
    if (signal === "stale") effect.staleStateValuesCount++;
    else if (signal === "fresh") {
        effect.staleStateValuesCount--;
        if (effect.staleStateValuesCount <= 0) {
            //to make sure "effect.stateStateValuesCount" doesn't go beyond zero
            effect.staleStateValuesCount = 0;
            $d5fa6cf0040a6711$var$executeMap[effect.type](effect, execute, fn, depArray);
        }
    }
}
const $d5fa6cf0040a6711$var$executeMap = {
    sync: (effect, execute, fn, depArray)=>execute(effect, fn, depArray),
    async: (effect, execute, fn, depArray)=>(0, $7bf57c0302477c3b$export$2e2bcd8739ae039)(()=>execute(effect, fn, depArray)),
    render: (effect, execute, fn, depArray)=>(0, $c894b2ac0568d031$export$2e2bcd8739ae039)(()=>execute(effect, fn, depArray))
};



function $0968a927288576e8$export$2e2bcd8739ae039(effect) {
    const parentEffect = (0, $67984ac6bea14c49$export$24642de4c13f18dd)[(0, $67984ac6bea14c49$export$24642de4c13f18dd).length - 1];
    if (parentEffect) {
        //use "position" and "level" to determine location of effect cleanup
        //in cleanup tree
        //increment the parent effect's child count to account for its new child effect
        parentEffect.childCount++;
        //the effect's position "n" shows that it's the "nth" child of its parent effect
        effect.position = parentEffect.childCount;
        //the effect's level shows how many levels deep it is nested (one level deeper than its parent effect)
        effect.level = parentEffect.level + 1;
        //all effects in a tree have the same cleanup tree
        effect.cleanupTree = parentEffect.cleanupTree;
        //copy parent's `cleanupTreeNodePointer` and continue from there
        effect.cleanupTreeNodePointer = [
            ...parentEffect.cleanupTreeNodePointer, 
        ];
        //complete `cleanupTreeNodePointer` for the effect
        //every number's presence in the array represents an extra level of nesting (eg. one number for the first
        //and topmost level, three numbers for two levels deeper than the topmost level, etc)
        //the value "n" of every number in the array shows that the effect is the "nth" effect in that level of nesting
        let effectCleanupTreeNodePointerLength = effect.cleanupTreeNodePointer.length;
        if (effectCleanupTreeNodePointerLength === effect.level) effect.cleanupTreeNodePointer[effectCleanupTreeNodePointerLength - 1] = effect.position;
        else if (effectCleanupTreeNodePointerLength < effect.level) effect.cleanupTreeNodePointer[effectCleanupTreeNodePointerLength] = effect.position;
        else if (effectCleanupTreeNodePointerLength > effect.level) {
            effect.cleanupTreeNodePointer.pop();
            effect.cleanupTreeNodePointer[effectCleanupTreeNodePointerLength - 2] = effect.position;
        }
    } else {
        //do this for the topmost parent effect (father of the whole tree)
        effect.level = 1;
        effect.position = 1;
        effect.cleanupTreeNodePointer = [
            1
        ];
        effect.cleanupTree = new Map();
    }
}


function $63b2a67046e0c80d$export$2e2bcd8739ae039(effect) {
    //create variable to store `cleanupNode` of effect and initially set the variable to the cleanup tree
    let cleanupNode = effect.cleanupTree;
    //extract the `cleanupNode` from the `cleanupTree` and set it to the `cleanupNode` variable
    effect.cleanupTreeNodePointer?.forEach((part)=>{
        if (cleanupNode?.get(part)) cleanupNode.set(part, new Map());
        cleanupNode = cleanupNode?.get(part);
    });
    //set cleanup set for effect if it doesn't already exist in the cleanup map
    if (cleanupNode?.get(0)) cleanupNode.set(0, new Set());
}


function $09edb78f7635c27a$export$2e2bcd8739ae039(type, tracking, fn, depArray) {
    const execute = (0, $01da2ed5eea48407$export$2e2bcd8739ae039)[tracking];
    const effect = {
        //whether or not the effect hasn't been ran before
        firstRun: true,
        type: //whether the effect is async, sync or a render effect
        type,
        tracking: //how the effect is tracked (refer to the `tracking` variable above)
        tracking,
        //how many children the effect has
        childCount: 0,
        //the number "n" that shows that the effect is the "nth" child of its parent effect
        position: null,
        //how deeply nested the effect is (starting from level one)
        level: null,
        //tree-like map data structure that contains the cleanups for every effect in the effect tree
        cleanupTree: null,
        //array of digits that point to the effect's cleanup in the effect tree's cleanup tree
        cleanupTreeNodePointer: null,
        //subscription sets (async, sync, render, or memo) of every state currently tracking this effect
        observableSubscriptionSets: new Set(),
        //used to track the number of state values of states currently tracking the effect that are stale
        staleStateValuesCount: 0,
        //used to store the return value of the previous effect execution
        returnValue: null,
        //used to notify the effect when a state value of state currently tracking the effect turns
        //stale or freshens up after turning stale
        sendSignal: (signal)=>(0, $d5fa6cf0040a6711$export$2e2bcd8739ae039)(effect, execute, fn, depArray, signal)
    };
    //create `cleanupTreeNodePointer` for effect and create `cleanupTree` for effect tree is this is the
    //topmost parent effect (father of the whole tree)
    (0, $0968a927288576e8$export$2e2bcd8739ae039)(effect);
    //create `cleanupSet` for effect if it doesn't already exist
    (0, $63b2a67046e0c80d$export$2e2bcd8739ae039)(effect);
    //return effect `execute` function and effect itself
    return [
        execute,
        effect
    ];
}


function $d9192ce19ee672a1$export$2e2bcd8739ae039(fn, depArray, options) {
    const [execute, effect] = (0, $09edb78f7635c27a$export$2e2bcd8739ae039)("sync", "componentFn", fn, depArray);
    //return cleanup function / component cleanup array
    return execute(effect, fn, depArray, options);
}



function $ed4eeacab2c72f4d$export$2e2bcd8739ae039(fn, depArray, options) {
    //determine if the effect is tracked by the state it uses implicitly, or using the
    //state provided by its dependency array
    const tracking = typeof depArray === "undefined" ? "implicit" : "depArray";
    const [execute, effect] = (0, $09edb78f7635c27a$export$2e2bcd8739ae039)("sync", tracking, fn, depArray);
    //return cleanup function / component cleanup array
    return execute(effect, fn, depArray, options);
}




class $904a7c359f86196f$var$$ extends (0, $2lYhx$AsyncDirective) {
    constructor(partInfo){
        super(partInfo);
        //boolean flag to enable initialization of the component in the update method.
        this.updateFlag = "initialize";
        //initialize cleanups for component. this includes:
        //1. general component cleanup for all its effects and memos
        //2. cleanup of the effect created from the function (that returns a template result) the component returns
        this.cleanups = [];
        this.Component = ()=>(0, $60affc760575bcb6$re_export$html)``;
        //initialize "changed" flag as true.
        this.changed = true;
    }
    disconnected() {
        this.cleanups.forEach((cleanup)=>cleanup());
    }
    //normal render process
    externalRender(props) {
        for(const prop in props)this.props[prop] = props[prop];
        return this.render();
    }
    //first time initialization of component
    initialize(props, part, Component) {
        this.props = props;
        return this.initializeComponent(Component, part.parentNode, this.props);
    }
    initializeComponent(Component, parent, props) {
        //store the function (that returns a template result) the component returns in `htmlFn` for later us
        let htmlFn;
        //initialize component effects and memos and store the cleanup (1st cleanup)
        this.cleanups.push((0, $ed4eeacab2c72f4d$export$2e2bcd8739ae039)(()=>htmlFn = Component(props, parent), []));
        const [ComponentCleanup, ComponentDependencyUpdate, [htmlTemplateResult], ] = (0, $d9192ce19ee672a1$export$2e2bcd8739ae039)((_, htmlTemplateResultArray)=>{
            this.setValue(htmlTemplateResultArray?.[0]);
        }, [
            htmlFn
        ], {
            defer: true,
            isComponent: true
        });
        //store 2nd cleanup
        this.cleanups.push(ComponentCleanup);
        //store reference to function used to update component return function dependencies and return template
        //result for rendering
        this.ComponentDependencyUpdate = ComponentDependencyUpdate;
        this.Component = ()=>{
            //check "changed" flag to prevent multiple redundant re-rendering of components.
            if (this.changed) {
                this.changed = false;
                (0, $afe3fcee1cf27466$export$2e2bcd8739ae039)(this);
                const [htmlTemplateResult] = this.ComponentDependencyUpdate?.();
                return htmlTemplateResult;
            } else return 0, $2lYhx$noChange;
        };
        //prevent re-initialization of component on subsequent renders after initialization.
        this.updateFlag = "externalRender";
        return htmlTemplateResult;
    }
    update(part, [Component, props]) {
        //initialize component for the first time or go through normal rendering processes based on the state of `updateFlag`
        return this[this.updateFlag](props, part, Component);
    }
    reconnected() {
        this.updateFlag = "initialize";
    }
    render() {
        return this.Component();
    }
}
const $904a7c359f86196f$var$h = (0, $2lYhx$directive)($904a7c359f86196f$var$$);
var $904a7c359f86196f$export$2e2bcd8739ae039 = $904a7c359f86196f$var$h;


function $20f84131e3cf668b$export$b3890eb0ae9dca99(Component, props) {
    //check whether or not "renderContainer" is a string and handle it
    //accordingly.
    if (typeof props.renderContainer === "string" || props.renderContainer instanceof String) props.renderContainer = document.querySelector(props.renderContainer);
    const renderComponent = ()=>(0, $2lYhx$render)((0, $60affc760575bcb6$re_export$html)`${(0, $904a7c359f86196f$export$2e2bcd8739ae039)(Component, props)}`, props.renderContainer, props.renderOptions);
    //queue microtask to render the component to enable all extensions to run first.
    queueMicrotask(renderComponent);
    //return "renderComponent" function to allow re-rendering of whole root
    //component tree.
    return renderComponent;
}





function $9cecc7cf923e2acf$var$subscribe(state, effect) {
    //get active subscriptions to properly manage sync effects and memos
    const activeSubscriptions = state.activeSubscriptions;
    const type = effect.type;
    //if `effect.tracking` is equal to "depArray", don't track effects because the tracking
    //will be done explicitly using the provided dependency array
    if (effect.tracking === "depArray") return;
    //track effects using the right subscription sets, based on whether they are async, render,
    //sync effects, or memos
    if (type === "async" || type === "render") {
        //tracking async and render effects
        state.asyncAndRenderSubscriptions.add(effect);
        effect.observableSubscriptionSets.add(state.asyncAndRenderSubscriptions);
    } else {
        //tracking sync effects and memos
        state[`${type}Subscriptions`][activeSubscriptions].add(effect);
        effect.observableSubscriptionSets.add(state[`${type}Subscriptions`][activeSubscriptions]);
    }
}
function $9cecc7cf923e2acf$export$2e2bcd8739ae039(state) {
    const currentEffect = (0, $67984ac6bea14c49$export$24642de4c13f18dd)[(0, $67984ac6bea14c49$export$24642de4c13f18dd).length - 1];
    if (currentEffect) $9cecc7cf923e2acf$var$subscribe(state, currentEffect);
    return state.value;
}


const $fb073535b0301983$var$cleanupUpdateArray = [];
function $fb073535b0301983$export$1b3c45eb1fa5da02(cleanupUpdateFn) {
    $fb073535b0301983$var$cleanupUpdateArray.push(cleanupUpdateFn);
}
function $fb073535b0301983$export$916777485b2b3993() {
    $fb073535b0301983$var$cleanupUpdateArray.forEach((cleanupUpdateFn)=>cleanupUpdateFn());
    $fb073535b0301983$var$cleanupUpdateArray.length = 0;
}


function $84babe8016afdd4f$export$ac2bda8cd89c2590(state, activeSubscriptions) {
    state.memoSubscriptions[activeSubscriptions].forEach((subscription)=>{
        subscription.sendSignal("stale");
    });
    state.syncSubscriptions[activeSubscriptions].forEach((subscription)=>{
        subscription.sendSignal("stale");
    });
    state.asyncAndRenderSubscriptions.forEach((subscription)=>{
        subscription.sendSignal("stale");
    });
}
function $84babe8016afdd4f$export$436b218e987b82fc(state, activeSubscriptions) {
    state.memoSubscriptions[activeSubscriptions].forEach((subscription)=>{
        subscription.sendSignal("fresh");
    });
    state.syncSubscriptions[activeSubscriptions].forEach((subscription)=>{
        subscription.sendSignal("fresh");
    });
    state.asyncAndRenderSubscriptions.forEach((subscription)=>{
        subscription.sendSignal("fresh");
    });
}


function $7f88e9e03e1610a7$export$2e2bcd8739ae039(state, nextValue) {
    //get active subscriptions to properly manange sync effects and memos
    const activeSubscriptions = state.activeSubscriptions;
    //toggle active subscriptions
    state.activeSubscriptions = activeSubscriptions === "one" ? "two" : "one";
    //let subscriptions know that they have a stale value so that they can notify their
    //subscriptions if any
    (0, $84babe8016afdd4f$export$ac2bda8cd89c2590)(state, activeSubscriptions);
    //update state value
    state.value = nextValue;
    //let subscriptions know that their stale value has been updated so that they can notify and
    //update themselves and their subscriptions if any
    (0, $84babe8016afdd4f$export$436b218e987b82fc)(state, activeSubscriptions);
    //update memo cleanups after all effects have been fired to ensure that no memos are run twice, triggering their effects
    (0, $fb073535b0301983$export$916777485b2b3993)();
}


function $2ea58473f796696a$export$9c07a256d814a0e(initialValue) {
    //create state object with three sets of subscriptions
    const state = {
        //one for sync effect subscriptions
        //use two sets to effectively manage synchronous subscriptions (prevents recursive filling
        //and running of effects resulting in stack overflow)
        syncSubscriptions: {
            one: new Set(),
            two: new Set()
        },
        //one for memo subscriptions
        //use two sets to effectively manage synchronous subscriptions (prevents recursive filling
        //and running of memos resulting in stack overflow)
        memoSubscriptions: {
            one: new Set(),
            two: new Set()
        },
        //one for async and render effect subscriptions
        //one set is enough to manage asynchronous effects
        asyncAndRenderSubscriptions: new Set(),
        //use variable to effectively switch between subscription sets (for sync effects and memos)
        activeSubscriptions: "one",
        value: initialValue
    };
    const getter = ()=>(0, $9cecc7cf923e2acf$export$2e2bcd8739ae039)(state);
    const setter = (nextValue)=>(0, $7f88e9e03e1610a7$export$2e2bcd8739ae039)(state, nextValue);
    return [
        getter,
        setter
    ];
}



function $1e5a3ea0f27ba6e4$export$2e2bcd8739ae039(fn, depArray, options) {
    //determine if the effect is tracked by the state it uses implicitly, or using the
    //state provided by its dependency array
    const tracking = typeof depArray === "undefined" ? "implicit" : "depArray";
    const [execute, effect] = (0, $09edb78f7635c27a$export$2e2bcd8739ae039)("render", tracking, fn, depArray);
    //execute effect asynchronously after next screen paint and return a promise that
    //resolves with the cleanup function / component cleanup array
    return new Promise((resolve)=>setTimeout(()=>{
            resolve(execute(effect, fn, depArray, options));
        }));
}



function $275745f9245c13d5$export$2e2bcd8739ae039(fn, depArray, options) {
    //determine if the effect is tracked by the state it uses implicitly, or using the
    //state provided by its dependency array
    const tracking = typeof depArray === "undefined" ? "implicit" : "depArray";
    const [execute, effect] = (0, $09edb78f7635c27a$export$2e2bcd8739ae039)("render", tracking, fn, depArray);
    //execute effect asynchronously before next screen paint and return a promise that
    //resolves with the cleanup function / component cleanup array
    return new Promise((resolve)=>{
        queueMicrotask(()=>resolve(execute(effect, fn, depArray, options)));
    });
}








function $40908d163f9d2f7a$export$e5bb50160f277516(memo) {
    //get active subscriptions to properly manange sync effects and memos
    const activeSubscriptions = memo.activeSubscriptions;
    //toggle active subscriptions
    memo.activeSubscriptions = activeSubscriptions === "one" ? "two" : "one";
    //let subscriptions know that they have a stale value so that they can notify their
    //subscriptions if any
    (0, $84babe8016afdd4f$export$ac2bda8cd89c2590)(memo, activeSubscriptions);
}
function $40908d163f9d2f7a$export$18b21b881485961f(memo, fn) {
    //set `childCount` back to zero to enable children effects to obtain correct positions upon recreation
    memo.childCount = 0;
    //fire cleanups make sure proceedings go smoothly
    const cleanupSet = (0, $64ce9db61466f237$export$2e2bcd8739ae039)(memo)?.get(0);
    if (cleanupSet) for (const cleanup of cleanupSet){
        //if cleanup is a memo, return it and exit out of function because this means that if the function continues to run
        //the memo would potentially run twice and re-trigger all of its dependents
        if (typeof cleanup !== "function") return cleanup;
        cleanup();
    }
    cleanupSet?.clear();
    //push memo onto context to enable tracking by state and other memos
    (0, $67984ac6bea14c49$export$24642de4c13f18dd).push(memo);
    memo.value = fn(memo.value);
    if (memo.firstRun) {
        memo.firstRun = false;
        //on first run, add cleanup function to cleanupSet
        cleanupSet?.add(()=>(0, $43f4dc316840b203$export$2e2bcd8739ae039)(memo));
    } else {
        //else add memo to cleanupSet so that the check that runs inside the for of loop above is able to effectively do its job
        //and prevent memos from running twice, especially when nested in effects that also depend on them or in other "edge" cases
        cleanupSet?.add(memo);
        //then `queueCleanupUpdates` for later for the same reasons mentioned in the comment above
        (0, $fb073535b0301983$export$1b3c45eb1fa5da02)(()=>{
            cleanupSet?.clear();
            cleanupSet?.add(()=>(0, $43f4dc316840b203$export$2e2bcd8739ae039)(memo));
        });
    }
    //remove memo from context to disable tracking by state and other memos
    (0, $67984ac6bea14c49$export$24642de4c13f18dd).pop();
    //get `activeSubscriptions` as the opposite for `memo.activeSubscriptions` because it recently toggled in `sendStaleNotifications`
    const activeSubscriptions = memo.activeSubscriptions === "one" ? "two" : "one";
    //let subscriptions know that their stale value has been updated so that they can notify and
    //update themselves and their subscriptions if any
    (0, $84babe8016afdd4f$export$436b218e987b82fc)(memo, activeSubscriptions);
}


function $47c764f9d99e716a$export$2e2bcd8739ae039(memo, fn, signal) {
    if (signal === "stale") {
        memo.staleStateValuesCount++;
        if (memo.staleStateValuesCount === 1) (0, $40908d163f9d2f7a$export$e5bb50160f277516)(memo);
    } else if (signal === "fresh") {
        memo.staleStateValuesCount--;
        if (memo.staleStateValuesCount <= 0) {
            //to make sure "memo.stateStateValuesCount" doesn't go beyond zero
            memo.staleStateValuesCount = 0;
            (0, $40908d163f9d2f7a$export$18b21b881485961f)(memo, fn);
        }
    }
}






function $4ff487e726c286d2$export$2e2bcd8739ae039(fn) {
    const memo = {
        //state properties
        syncSubscriptions: {
            one: new Set(),
            two: new Set()
        },
        memoSubscriptions: {
            one: new Set(),
            two: new Set()
        },
        asyncAndRenderSubscriptions: new Set(),
        activeSubscriptions: "one",
        value: undefined,
        //effect properties
        firstRun: true,
        type: "memo",
        childCount: 0,
        position: null,
        level: null,
        cleanupTree: null,
        cleanupTreeNodePointer: null,
        observableSubscriptionSets: new Set(),
        staleStateValuesCount: 0,
        sendSignal: (signal)=>(0, $47c764f9d99e716a$export$2e2bcd8739ae039)(memo, fn, signal)
    };
    (0, $0968a927288576e8$export$2e2bcd8739ae039)(memo);
    (0, $63b2a67046e0c80d$export$2e2bcd8739ae039)(memo);
    const cleanupMemo = (0, $40908d163f9d2f7a$export$18b21b881485961f)(memo, fn);
    return cleanupMemo ? ()=>(0, $9cecc7cf923e2acf$export$2e2bcd8739ae039)(cleanupMemo) : ()=>(0, $9cecc7cf923e2acf$export$2e2bcd8739ae039)(memo);
}


























class $7547703a902ec477$export$2e2bcd8739ae039 {
    constructor(initialParticleValues){
        this.particles = {};
        this.createParticles(initialParticleValues);
        this.adaptParticle = this.adaptParticle.bind(this);
        this.deleteParticles = this.deleteParticles.bind(this);
    }
    createParticles(particleValues) {
        if (particleValues) Object.keys(particleValues).forEach((particleValue)=>{
            this.particles[particleValue] = (0, $2ea58473f796696a$export$9c07a256d814a0e)(particleValues[particleValue]);
        });
    }
    adaptParticle(optionsOrId) {
        if (typeof optionsOrId === "string") {
            const id = optionsOrId;
            return this.particles[id];
        } else {
            const options = optionsOrId;
            if (this.particles[options.id] === undefined) this.createParticles({
                [options.id]: options.initialValue
            });
            return this.particles[options.id];
        }
    }
    deleteParticles(particleIds) {
        particleIds.forEach((particleId)=>delete this.particles[particleId]);
    }
}






class $3c0b88deb2963834$export$2e2bcd8739ae039 {
    constructor(paths){
        [this.currentPath, this.setCurrentPath] = (0, $2ea58473f796696a$export$9c07a256d814a0e)(window.location.pathname);
        this.paths = paths;
        window.addEventListener("popstate", ()=>this.route());
        this.route = this.route.bind(this);
        this.navigate = this.navigate.bind(this);
    }
    Link = (props)=>{
        const isActive = (0, $4ff487e726c286d2$export$2e2bcd8739ae039)(()=>this.currentPath() === props.to);
        return ()=>(0, $60affc760575bcb6$re_export$html)`<a
        href=${props.to}
        @click=${(e)=>{
                e.preventDefault();
                this.navigate(props.to);
            }}
        class=${(0, $60affc760575bcb6$re_export$ifDefined)(props.class?.(isActive()))}
        style=${(0, $60affc760575bcb6$re_export$ifDefined)(props.style?.(isActive()))}
        >${props.content || props.text}</a
      >`;
    };
    navigate(urlOrDelta) {
        if (typeof urlOrDelta === "string") history.pushState(null, "", urlOrDelta);
        else history.go(urlOrDelta);
        this.route();
    }
    route() {
        this.setCurrentPath(window.location.pathname);
    }
    Switch = (props)=>{
        return ()=>(0, $60affc760575bcb6$re_export$html)`${(0, $60affc760575bcb6$re_export$choose)(this.currentPath(), props.routes, props.default)}`;
    };
    setTitle(title) {
        document.title = title;
    }
}






export {$20f84131e3cf668b$export$b3890eb0ae9dca99 as render, $904a7c359f86196f$export$2e2bcd8739ae039 as h, $60affc760575bcb6$re_export$html as html, $2ea58473f796696a$export$9c07a256d814a0e as adaptState, $1e5a3ea0f27ba6e4$export$2e2bcd8739ae039 as adaptEffect, $275745f9245c13d5$export$2e2bcd8739ae039 as adaptRenderEffect, $ed4eeacab2c72f4d$export$2e2bcd8739ae039 as adaptSyncEffect, $4ff487e726c286d2$export$2e2bcd8739ae039 as adaptMemo, $60affc760575bcb6$re_export$classMap as classMap, $60affc760575bcb6$re_export$styleMap as styleMap, $60affc760575bcb6$re_export$when as when, $60affc760575bcb6$re_export$choose as choose, $60affc760575bcb6$re_export$guard as guard, $60affc760575bcb6$re_export$cache as cache, $60affc760575bcb6$re_export$keyed as keyed, $60affc760575bcb6$re_export$map as map, $60affc760575bcb6$re_export$repeat as repeat, $60affc760575bcb6$re_export$join as join, $60affc760575bcb6$re_export$range as range, $60affc760575bcb6$re_export$live as live, $60affc760575bcb6$re_export$ifDefined as ifDefined, $60affc760575bcb6$re_export$ref as ref, $60affc760575bcb6$re_export$createRef as createRef, $60affc760575bcb6$re_export$templateContent as templateContent, $60affc760575bcb6$re_export$unsafeHTML as unsafeHTML, $60affc760575bcb6$re_export$unsafeSVG as unsafeSVG, $60affc760575bcb6$re_export$until as until, $60affc760575bcb6$re_export$asyncAppend as asyncAppend, $60affc760575bcb6$re_export$asyncReplace as asyncReplace, $7547703a902ec477$export$2e2bcd8739ae039 as ParticleEntity, $3c0b88deb2963834$export$2e2bcd8739ae039 as Router};
//# sourceMappingURL=promethium-js.js.map
