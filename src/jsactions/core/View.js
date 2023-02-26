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
import Event from '../../createjs/Event';
import EventUtils from '../utils/EventUtils';
import EventBroadCaster from '../events/EventBroadcaster';
import NavigationEvent from '../events/NavigationEvent';
import ElementUtils from '../utils/ElementUtils';

/**
 * View consider as single UI screen. 
 * 
 * View contains Contents consist of "Containers" and "Components" and Model.
 * 
 * View can be use with Core HTML Components also.
 * 
 * View manages View Template or DOM Content such behaviour, event listners etc.
 * 
 * View created and manage by ViewNavigator.
 * 
 * View HTML DOM wrapper:
         &lt; div class="vjs-view ${viewId}" &gt;
 *
 * View LifeCycle methods executes in given order :
 *
 *  1) Creation : constructor, attachView, activateView
 *
 *  2) Destruction : deActivateView, detachView, destroy
 *
 *  Following methods overrides and implement by View subclass executes in given order :
 * 
 *  1) Creation : constructor, initView, createViewContent, addViewHandler, bindView
 * 
 *  2) Destruction : unBindView, removeViewHandler, destroy
 * 
 */
class View extends EventDispatcher {


    /**
     * @param {String} _id - View Id
     * @param {String} _route - View Route
     * @param {String} _navevent - View Navigation Event Name
     * @param {String} _navparams - Parameters pass to View 
     * @param {String} _parentViewStackId - Parent Viewstack Id 
     * @memberof View
     */
    constructor(_id, _route,_navevent, _navparams, _parentViewStackId) {
        super();
        this.id = _id;
        this.route = _route;
        this.navEvent = _navevent;
        this.navParams = _navparams;
        this.parentViewStackId = _parentViewStackId;
        this.navigatorContainerId = null; // Use when View is ParentNavigator
        this.isAttached = false;
        this.isActive = false;
        this.initView();
    }

    /**
     *
     *
      @param {Event} event - Back Navigation Event dispatch by view component or method
     * @memberof View
     */
    dispatchNavBackEvent(event) {
        event.preventDefault();
        let navEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, EventUtils.BACK_NAV_EVENT, null, this.route);
        EventBroadCaster.navEventChannel.dispatchEvent(navEvent);
    }

    /**
     *
     * @override
     * @description Call by View Constructor
     * @public
     * @memberof View
     */
    initView() {}

    /**
     * @override
     * @description Create View Contents and Internal Components
     * @public
     * @memberof View
     */
    createViewContent() {

    }

    /**
     * @override
     * @description Add Event Handlers for view Internal Components
     * @public
     * @memberof View
     */
    addViewHandler() {

    }

    /**
     * @override
     * @description Remove Event Handlers for view Internal Components
     * @memberof View
     */
    removeViewHandler() {

    }

    /**
     * @override
     * @description Bind View Component Properties with Model or other view Components
     * @public
     * @memberof View
     */
    bindView() {}

    /**
     * @override
     * @description Remove Bind View Component Properties with Model or other view Components
     * @public
     * @memberof View
     */
    unBindView() {}

    /**
     * @override
     * @description Destroy Method used to cleanup view resources
     * Call by ViewNavigator to destroy view
     * Remove Event Handlers, Make Properties null, 
     * Remove View Components and its reference.
     * @public
     * @memberof View
     **/
    destroy() {
    }

    /**
     * @description
     * View Lifecycle Method,
     * Call by ViewNavigator,
     * 
     * attachView Responsible to render view content, listners etc,
     * 
     * Dispatch "ATTACHED_EVENT" when view got attached / rendered,
     * 
     * Following methods call by attachView :
     * createViewContent
     * addViewHandler
     * bindView
     * @param {String} _parentEl 
     */
    attachView(_parentEl = null) {
        if (!this.isAttached) {
            let parentEl = _parentEl;
            if (parentEl == null)
                parentEl = ElementUtils.viewStack(this.parentViewStackId);
            parentEl.insertAdjacentHTML('beforeend', ElementUtils.constructViewBaseElement(this.id));
            this.isAttached = true;
            let tmpEle = this.getViewElement();
            ElementUtils.hideElement(tmpEle);
            //Create View Contents and Internal Components
            this.createViewContent();
            //Add Event Handlers for view Internal Components
            this.addViewHandler();
            //Bind View Component Properties with Model or other view Components
            this.bindView();
            this.dispatchEvent(EventUtils.ATTACHED_EVENT);
        }
    }

    /**
     * @description 
     * View Lifecycle Method
     * 
     * Call by ViewNavigator
     * 
     * attached View visible
     * @public
     * @memberof View
     */
    activateView() {
        if (!this.isActive) {
            let tmpViewEl = this.getViewElement();
            ElementUtils.showElement(tmpViewEl);
            this.isActive = true;
        }
    }

    /**
     * @description
     * View Lifecycle Method
     * 
     * Call by ViewNavigator
     * 
     * attached View if visible (active) then will become nonvisible
     * @public
     * @memberof View
     */
    deActivateView() {
        if (this.isActive) {
            let tmpViewEl = this.getViewElement();
            ElementUtils.hideElement(tmpViewEl);
            this.isActive = false;
        }
    }

    /**
     * @description
     * View Lifecycle Method
     * 
     * Call by ViewNavigator
     * 
     * View will be remove if View is attached 
     * @public
     * @memberof View  
    */
    detachView() {
        if (this.isAttached) {
            this.unBindView();
            this.removeViewHandler();
            let tmpViewEle = this.getViewElement();
            tmpViewEle.parentNode.removeChild(tmpViewEle);
            this.isAttached = false;
            this.dispatchEvent(EventUtils.DETACHED_EVENT);
        }
    }

    /**
     * @description RefreshView method reset View properties or data
     * @override
     * @memberof View
    */
    refreshView() {

    }

    /**
     *
     * @description Returns View DOM Element
     * @returns {string} 
     * @memberof View
     */
    getViewElement() {
        let tmpViewEl = null;
        if (this.isAttached) {
            tmpViewEl = ElementUtils.view(this.id);
        }

        return tmpViewEl;
    }

    getNavContainerId(_navId=null){
        return this.navigatorContainerId;
    }


    /**
     *
     * @description Add Content DOM ELement to View DOM Element
     * @param {string} _tmpViewContentEl - Content DOM Element
     * @memberof View
     */
    addToViewElement(_tmpViewContentEl){
        let tmpViewElement = this.getViewElement();
        tmpViewElement.insertAdjacentHTML('beforeend', _tmpViewContentEl);
    }

}

export default View;