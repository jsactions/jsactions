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

/**
 *
 * Container contains jsaction Components. Create custom container by extending base Container Class.
 * 
 * Container HTML DOM wrapper:
         &lt; div class="vjs-container ${containerId}" &gt;
 * 
 */
class Container extends EventDispatcher {

    /**
     * 
     * @param {string} [_id=null]
     * @param {string} [_parentViewId=null]
     * @param {boolean} [_createDOMElement=true]
     * @memberof Container
     */
    constructor(_id = null, _parentViewId = null, _createDOMElement = true) {
        super();
        this.isEnabled= false;
        this.createDOMElement = _createDOMElement;
        this.isAttached = false;
        this.id = _id;
        if((_id == null)|| (_id == ""))
            this.id = ElementUtils.generateContainerId();
        this.parentViewId = _parentViewId;
    }
    
    /**
     *
     * @override
     * @memberof Container
     */
    initContainer(){
        
    }
    
    /**
     *
     * @description Call by View or Parent
     * @public
     * @memberof Container
     */
    init() {
		this.initContainer();
	}

    /**
     * @description Call by attach Method
     * @override
     * @memberof Container
     */
    createDOMContent() {

    }

    /**
     *
     * @description Get Container HTML Content
     * @readonly
     * @memberof Container
     */
    get containerElement() {
        let tmpContainerEl = null;
        console.log("containerElement: "+this.isAttached)
        if (this.isAttached) {
            tmpContainerEl = ElementUtils.container(this.id,this.parentViewId);
        }
        return tmpContainerEl;
    }
   

    /**
     *
     * @description Returns Parent ViewID
     * @readonly
     * @memberof Container
     */
    get parent(){
        return this.parentViewId;
    }


    /**
     * @description Returns true if Container is enabled
     * @returns {Boolean} 
     * @readonly 
     * @memberof Container
     */
    get enabled() {
        return this.isEnabled;
    }


    set enabled(_isenabled = false){
        this.isEnabled = _isenabled;
    }

    /**
     * Boolean Property , returns True if Component is Visible
     * @returns {Boolean} true if Container is visible
     * @memberof Container
     */
    get visible(){
        let tmpContainerEl = this.containerElement;
        return ElementUtils.isVisible(tmpContainerEl);
    }


    set visible(_visible){
        let tmpContainerEl = this.containerElement;
        if(_visible)
            ElementUtils.showElement(tmpContainerEl);
        else 
            ElementUtils.hideElement(tmpContainerEl);

    }

     // 

     /**
      * @description
      * Container Lifecycle Method,
      * Call by View or manually 
      * 
      * attachView Responsible to render view content, listners etc,
      * 
      * Dispatch "ATTACHED_EVENT" when view got attached / rendered
      * @memberof Container
      */
     attach() {
        let parentEl = null;
        
        if (this.isAttached == false) {
            this.isAttached = true;
                parentEl = ElementUtils.view(this._parentViewId);
               
            if(this.createDOMElement == true){
                parentEl.insertAdjacentHTML('beforeend', ElementUtils.constructContainerBaseElement(this.id));
                let tmpEle = this.element;
                
                ElementUtils.hideElement(tmpEle);
                
                //Create  Contents and Internal Components
                this.createDOMContent();
            }
            this.enabled = true;
            this.visible = true;
            this.dispatchEvent(EventUtils.ATTACHED_EVENT);
        }
    }


    /**
     * @description
     * Container Lifecycle Method
     * 
     * Call by View or Manually
     * 
     * Container will be remove if View is attached 
     * @public
     * @memberof Container  
    */
    detach() {
        if (this.isAttached) {
            let tmpContainerEl = this.componentElement;
            tmpContainerEl.parentNode.removeChild(tmpContainerEl);
            this.isAttached = false;
            this.dispatchEvent(EventUtils.DETACHED_EVENT);
        }
    }

    /**
     *
     * @description Call by View
     * @override
     * @memberof Container
     */
    refresh() {

    }

    /**
     *
     * @description Call by View
     * @override
     * @memberof Container
     */
    destroy() {
        //TODO
    }

    

}

export default Container;