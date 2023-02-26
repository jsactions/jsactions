/** 
 * @license
 * Copyright (c) 2023 Gaurang Lade
 * 
 * MIT License
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import EventDispatcher from "../../createjs/EventDispatcher";
import EventUtils from '../utils/EventUtils';
import ElementUtils from '../utils/ElementUtils';
import ElementState from '../utils/ElementState';


/**
 *
 * The Component class is the base class for all visual components. 
 * 
 * When setting "_createDOMElement=false" while creating instance of Component, Component class skip render DOM element part, assuming Component DOM Element already available and it take DOM element reference by componentId during Component creation.  
 *
 *
 * Component HTML DOM wrapper:
        &lt; div class="vjs-component ${componentId}" &gt;
 *
 * Component Class provides lifecycle methods as follows to manage DOM Elements and Standard Form Controls.
 *
 * 1) Creation & Initialization : constructor, init, attach
 *
 * 2) Update : refresh
 *
 * 3) Destruction : detach, destroy
 *

 * Create custom component by extending base Component Class and overrides and implement following methods which will executes in below given order
 *

 * 1) Creation & Initialization : constructor, init, initComponent, createDOMContent, addEventHandler,  bind

 *
 * 2) Update : changeComponentState, refresh, setComponentRequired, setComponentReadOnly, setComponentEnabled
 *
 * 3) Destruction : removeEventHandler, unBind, destroy
 *
 */
class Component extends EventDispatcher {
    
    /**
     * Creates an instance of Component.
     * @example Create an instance of Component in View Class in "createViewContent" method
    
        createViewContent() {
        let tmpViewContentEl = this.createViewHTML();
        this.addToViewElement(tmpViewContentEl);

        this.cmpButton1 = new MyButton("cmpBtn",this.id,"helloContainer",true);
        this.cmpButton1.init("My Component");
        this.cmpButton1.attach();
        this.cmpButton1.enabled = true;
        }

     *
     * @param {string} [_id=null] - ComponentID
     * @param {string} [_parentViewId=null] - Component Parent View ID
     * @param {string} [_parentContainerId=null] - Component Parent Container ID
     * @param {boolean} [_createDOMElement=true] - True if Component DOM element create from Template , False if taken from DOM.
     * @memberof Component
     */
    constructor(_id = null, _parentViewId = null,_parentContainerId=null, _createDOMElement = true) {
        super();
        this.isEnabled= true;
        this.isAttached = false;
        this.elState = ElementState.DEFAULT;
        this.isRequired = false;
        this.isReadOnly = false;
        this.createDOMElement = _createDOMElement;
        this.id = _id;
        this.formId = "defaultform";
        if((_id == null)|| (_id == ""))
            this.id = ElementUtils.generateComponentId();
        this.parentViewId = _parentViewId;
        this.parentContainerId = _parentContainerId;
    }

    /**
     *
     * Initialise Component properties and model
     * Call by View or Parent
     * @memberof Component
     */
    init() {
		this.initComponent();
	}
    
    /**
     * @override
     * @description call by init method
     * @memberof Component
     */
    initComponent(){}
 
    /**
     * creates DOM Contents of Component
     * Overrides by SubClass
     * Call by attach Method
     */
    createDOMContent() {}

    /**
     *
     * Add Component Content DOM Element to Component
     * @param {string} _tmpCompContentEl - DOMElement 
     * @memberof Component
     */
    addToComponentElement(_tmpCompContentEl){
        let tmpCompElement = this.componentElement;
        tmpCompElement.insertAdjacentHTML('beforeend', _tmpCompContentEl);
    }

    /**
     *
     * 
     * @description Add Event Handlers for Component DOM Elements and Model
     * Call by attach & set domElement Method
     * @override
     * @memberof Component
     */
    addEventHandler() {}

    /**
     * @override
     * @description Remove Event Handlers for Component DOM Elements and Model
     * call by destroy method
     * @memberof Component
     */
    removeEventHandler() {}

    /**
     * Overrides by SubClass
     * Bind Component Properties with Model or other Components
     * call by attach & view
     */ 
    bind() {}

    /**
     * Overrides by SubClass
     * Remove Bind on Component Properties with Model or other Components
     */
    unBind() {}

    /**
     * returns Component DOM Element
     */
    get componentElement() {
        let tmpComponentEl = null;
        if (this.isAttached) {
            tmpComponentEl = ElementUtils.component(this.id,this.parentViewId);
        }
        return tmpComponentEl;
    }
    
    /**
     * returns ParentViewID
     */
    get parentView(){
        return this.parentViewId;
    }

    /**
     * returns Parent Container ID
     */
    get parentContainer(){
        return this.parentContainerId;
    }

    /**
     * returns Component current state
     */
    get currentState() {
        return this.elState;
    }

    /**
     * change Component State
     */
    changeState(_state = "default"){
        this.elState = _state;
        this.changeComponentState();
    }

    /**
     * change Component State
     * Overrides by Subclass
     */
    changeComponentState(){}

    /**
     * returns True if Component is Required
     */
    get required(){
        return this.isRequired;
    }

    set required(_isRequired = false){
        this.isRequired = _isRequired;
        this.setComponentRequired();
    }

    /**
     * Overrides by Subclass
     */
    setComponentRequired(){}

    /**
     * returns True if Component is ResdyOnly
     */
    get readOnly(){
        return this.isReadOnly;
    }

    set readOnly(_isReadOnly = false){
        this.isReadOnly = _isReadOnly;
        if(this.isReadOnly == true){
            this.changeState(ElementState.READONLY);
        }else{
            this.changeState(ElementState.DEFAULT);
        }
        this.setComponentReadOnly();
    }  
    
    /**
     * Overrides by Subclass
     */
    setComponentReadOnly(){}


    /**
     * Boolean Property , returns True if Component is Enabled
     */
    get enabled() {
        return this.isEnabled;
    }

    set enabled(_isenabled = false){
        this.isEnabled = _isenabled;
        this.setComponentEnabled();
    }

    /**
     * Overrides by Subclass
     */
    setComponentEnabled(){}

    /**
     * Boolean Property , returns True if Component is Visible
     */
    get visible(){
        let tmpComponentEl = this.componentElement;
        return ElementUtils.isVisible(tmpComponentEl);
    }

    set visible(_visible){
        let tmpComponentEl = this.componentElement;
        if(_visible)
            ElementUtils.showElement(tmpComponentEl);
        else 
            ElementUtils.hideElement(tmpComponentEl);

    }

     /**
     * Component Lifecycle Method
     * Call by View or call manually 
     * attach Responsible to render component content, listners etc
     * Dispatch "ATTACHED_EVENT" when view got attached / rendered 
     * Following methods call by attach method
     * createDOMContent
     * addViewHandler
     * bind
     *  
     */
     attach() {
        if (!this.isAttached) {   
            this.isAttached = true;
            if(this.createDOMElement == true){
                let parentEl = ElementUtils.container(this.parentContainerId,this.parentViewId);
                parentEl.insertAdjacentHTML('beforeend', ElementUtils.constructComponentBaseElement(this.id));
                let tmpEle = this.componentElement;
                ElementUtils.hideElement(tmpEle);
                //Create  Contents and Internal Components
                this.createDOMContent();
            }
            
            //Add Event Handlers for view Internal Components
            this.addEventHandler();
            //Bind  Component Properties with Model or other  Components
            this.bind();
            this.enabled = true;
            this.visible = true;
            this.dispatchEvent(EventUtils.ATTACHED_EVENT);
        }
    }

    /**
     * Component Lifecycle Method
     * Call by View or call manually 
     * Component will be remove if Component is attached
    */
    detach() {
        if (this.isAttached) {
            this.unBind();
            this.removeEventHandler();
            let tmpComponentEle = this.componentElement;
            tmpComponentEle.parentNode.removeChild(tmpComponentEle);
            this.isAttached = false;
            this.dispatchEvent(EventUtils.DETACHED_EVENT);
        }
    }

    /**
     * Refresh Component data and model and event listners
     * Overrides by SubClass
     */
    refresh() {}

    /**
     * Overrides by SubClass
     * Destroy Method used to cleanup component resources
     * Call by View or call manually to destroy view
     * Remove Event Handlers, Make Properties null, 
     * Remove DOM Element contents and its reference.
     **/
    destroy() {}

}

export default Component;