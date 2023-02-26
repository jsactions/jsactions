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
import ElementUtils from "../utils/ElementUtils";


/**
 * ViewStack maintains history of Views.
 * 
 * ViewStack HTML DOM wrapper:
        &lt; div class="vjs-viewstack ${viewstackId}" &gt;
 *
 */
class ViewStack extends EventDispatcher {


    /**
     * 
     * @param {string} _id - ViewStack ID
     * @param {string} _route - Path Route Name
     * @param {string} _parentId - ViewStack ParentID
     * @memberof ViewStack
     */
    constructor(_id, _route, _parentId) {
        super();
        this.id = _id;
        this.route = _route;
        this.parentId = _parentId;
        this.viewStack = [];
        this.isRendered = false;
        this.initViewStack();
    }


    /**
     *
     * @description Initialize ViewStack , Implement by Subclass
     * @override
     * @memberof ViewStack
     */
    initViewStack() {

    }


    /**
     *
     * @description Push View in Viewstack
     * @param {string} _viewId
     * @param {array} _views
     * @memberof ViewStack
     */
    pushViewElement(_viewId, _views) {

        for (let viewObj in _views) {
            let tmpview = _views[viewObj];
            if (tmpview.isActive) {
                tmpview.deActivateView();
            }
        }
        this.viewStack.push(_viewId);

    }


    /**
     * @description 
     * Navigator will call view destroy method which will remove 
     * View DOM Element, EventListners reference to DOM Element,
     * Properties, Finally Object null to make garbage collected
     * @memberof ViewStack
     */
    popViewElement() {
        this.viewStack.pop();
    }


    /**
     *
     * @description Returns Active View Id 
     * @returns {string} ViewID
     * @memberof ViewStack
     */
    getActiveViewId() {
        if (this.viewStack.length > 0)
            return this.viewStack[this.viewStack.length - 1];
    }


    /**
     *
     * @description Returns Viewstack DOMElement
     * @public
     * @returns {string} DOM ELement
     * @memberof ViewStack
     */
    getViewStackElement() {
        let el = null;
        if (this.isRendered) {
            el = this.getViewStackRootElement();
        }
        return el;
    }

    
    /**
     *  
     * @description Returns Viewstack Root DOMElement
     * @override
     * @private 
     * @returns {string} DOM Element
     * @memberof ViewStack
     */
    getViewStackRootElement() {
        return ElementUtils.viewStack(this.id);
    }


    /**
     *
     * @description Render ViewStack DOMElement contents
     * @public
     * @memberof ViewStack
     */
    render() {
        if (!this.isRendered) {
            this.renderViewStack();
            this.renderViewStackContent();
            this.isRendered = true;
        }
    }


    /**
     *
     * @description Render ViewStack DOMElement 
     * Called by Render method
     * @private
     * @memberof ViewStack
     */
    renderViewStack() {
        let tmpParentNavigatorEl = ElementUtils.viewNavigator(this.parentId);
        let tmpViewStackEl = ElementUtils.constructViewStackBaseElement(this.id);
        tmpParentNavigatorEl.insertAdjacentHTML('beforeend', tmpViewStackEl);
    }

    /**
     *
     * @override
     * @memberof ViewStack
     */
    renderViewStackContent() {}

    
    /**
     * 
     * @description 
     * Destroy Method used to cleanup viewstack resources
     * Call by ViewNavigator to destroy view
     * Remove Event Handlers, Make Properties null, 
     * Remove View Components and its reference.
     * @override
     * @public
     * @memberof ViewStack
     */
    destroy() {
        this.route = null;
        this.viewStack = [];
        this.isRendered = false;
        let tmpParentNavigatorEl = ElementUtils.viewNavigator(this.parentId);
        let tmpViewStackEl = ElementUtils.viewStack(this.id);
        tmpParentNavigatorEl.removeChild(tmpViewStackEl);
        this.parentId = null;
        this.id = null;
    }


}

export default ViewStack;