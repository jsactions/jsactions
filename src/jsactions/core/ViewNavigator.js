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
import ElementUtils from '../utils/ElementUtils';
import ViewStack from './ViewStack';
import View from './View';
import EventRouter from './EventRouter';

/**
 * 
 * 
 * UI navigation  manages by ViewNavigator. 
 * 
 * ViewNavigator is base class which have simple view navigation functionality.
 * 
 * It manages set of view using stack-based history mechanism which also called as ViewStack.
 * 
 * Each Viewstack represent its own view history stack.Having multiple Viewstacks ViewNavigator can manage multiple history stacks.
 * 
 * ViewNavigator also Manages LifeCycle of View.
 * 
 * ViewNavigator HTML DOM wrapper:
       &lt; div class="vjs-viewnavigator ${navigatorId}" &gt;
 *
 * ViewNavigator LifeCycle methods executes in given order :
 *
 *  1) Creation : constructor, initNavigator, render
 *
 *  2) Destruction : destroy
 *
 *  Following methods overrides and implement by ViewNavigator subclass executes in given order :
 * 
 *  1) Creation : constructor, initNavigator, renderNavigatorContent, createView, createViewStack, initEventRoutes
 * 
 *  2) Destruction : destroy
 * 
 */
class ViewNavigator extends EventDispatcher {

    /**
     * @description
     * UI navigation  manages by ViewNavigator. 
     * 
     * ViewNavigator" is base class which have simple view navigation functionality.
     * 
     * ViewNavigator manages set of view using stack-based history mechanism which also called as ViewStack.
     * 
     * Each Viewstack represent its own view history stack. So vyanjs supports multiple history stack too.
     * 
     * ViewNavigator also Manages LifeCycle of View.
     *
     * @param {String} _id - ViewNavigator ID
     * @param {String} _parentId - Parent ID View or "root" DOM Element
     * @param {String} _parentContainerId - Parent Container ID
     * @memberof ViewNavigator
     */
    constructor(_id, _parentId = null,_parentContainerId = null) {
        super();
        this.id = _id;
        // HTML ID attribute only 
        this.parentId = _parentId;
        this.parentContId = _parentContainerId;
        this.activeViewId = null;
        this.activeViewStackId = null;
        this.activeRoute = null;
        this.views = {};
        this.viewstacks = {};
        this.eventRoute = new EventRouter();
        this.isRendered = false;
        this.navigationHistory = true;
        this.initNavigator();
    }

    /**
     * @description Implemented by Subclass 
     * Call by ViewNavigator Constructor
     * @override
     * @memberof ViewNavigator
     */
    initNavigator() {

    }

    /**
     * Sets Navigation History 
     * Boolean Property , returns True if Component is Enabled
     */
    get history() {
        return this.navigationHistory;
    }

    set history(_navigationHistory = true){
        this.navigationHistory = _navigationHistory;
    }

    get parentContainer() {
        return this.parentContId;
    }

    /**
     * @description Set EventRouter for ViewNavigator, EventRouter is useful for EventBased Navigation and for navigation of single view or multiple views.
     * @param {Object} _router - EventRouter
     * @memberof ViewNavigator
     */
    set eventRouter(_router) {
        if (!_router instanceof EventRouter) {
            throw new Error("ViewNavigator : Wrong Type of Router");
        }
        this.eventRoute = _router;
    }

    /**
     * @description Returns EventRouter instance of ViewNavigator
     * @returns {object} - EventRouter Instance
     * @readonly
     * @memberof ViewNavigator
     */
    get eventRouter() {
        return this.eventRoute;
    }

    /**
     * 
     * @description 
     * By Default View class will be created
     * When Overrides by Subclass , custom Views will be created
     * @override
     * @param {String} _viewId - View ID
     * @param {String} _route - Navigation Route / Path 
     * @param {String} _navparams - Navigation Parameters pass to View
     * @param {String} _viewStackId - Parent Viewstack ID of View
     * @returns {Object} - View Instance
     * @memberof ViewNavigator
     */
    createView(_viewId, _route, _navparams, _viewStackId) {
        return new View(_viewId, _route, _navparams, _viewStackId);
    }

    /**
     * @description 
     * By Default ViewStack class will be created
     * When Overrides by Subclass , custom Viewstack will be created 
     * @override
     * @param {String} _viewStackId - ViewStack ID
     * @param {String} _route - Navigation Route / Path 
     * @param {String} _parentId - Parent ViewNavigator ID
     * @returns {Object} - ViewStack Instance
     * @memberof ViewNavigator
     */
    createViewStack(_viewStackId, _route, _parentId) {
        return new ViewStack(_viewStackId, _route, _parentId);
    }

    /**
     * @description 
     * Call by ViewManager
     * Navigation Route and Navigation EventRoute Combination must be unique
     * @param {String} _route - Navigation Route
     * @param {String} _navevent - Navigation Event Route 
     * @param {String} _navparams - Parameters pass to View
     * @memberof ViewNavigator
     */
    navigate(_route, _navevent, _navparams) {
        let tmpviewStackId = null;
        if (this.navigationHistory == false) {
            this.navigateBack(_route);
        }

        tmpviewStackId = this.eventRoute.findViewStackId(_navevent, _route);
        let tmpViewStack = this.getViewStack(tmpviewStackId);
        if (tmpViewStack == null)
            tmpViewStack = this.createViewStack(tmpviewStackId, _route, this.id);

        // Viewstack have _parentId

        tmpViewStack.render(); // will construct Element and add it to DOM parent
        this.activeViewStackId = tmpviewStackId;
        this.viewstacks[tmpviewStackId] = tmpViewStack;

        let tmpviewId = this.eventRoute.findViewId(_navevent, _route);
        let tmpView = this.getView(tmpviewId);
        if (tmpView == null)
            tmpView = this.createView(tmpviewId, _route, _navevent, _navparams, tmpviewStackId);
        this.removeActiveMenuElement();
        let tmpViewStackEl = tmpViewStack.getViewStackElement();
        this.activeViewId = tmpviewId;
        this.views[tmpviewId] = tmpView;
        this.activeRoute = _route;
        tmpView.attachView(tmpViewStackEl); // will construct Element and add it to DOM parent
        tmpViewStack.pushViewElement(tmpviewId, this.views);
        tmpView.activateView();
        this.setActiveMenuElement(_navevent);
    }

    /**
     * @description 
     * Call by ViewManager or ViewNavigator internally
     * Navigate back to previous View if history set to true
     * @param {String} _route
     * @memberof ViewNavigator 
     */
    navigateBack(_route) {
        if (_route == this.activeRoute) {
            let tmpViewStack = this.getViewStack(this.activeViewStackId);
            tmpViewStack.popViewElement();
            let tmpView = this.views[this.activeViewId];
            tmpView.deActivateView();
            tmpView.detachView();
            tmpView.destroy();
            this.removeActiveMenuElement();
            tmpView = null; // make garbage collected
            this.views[this.activeViewId] = null;
            delete this.views[this.activeViewId];
            if (this.navigationHistory == true) {
                this.activeViewId = tmpViewStack.getActiveViewId();
                let tmpViewBack = this.views[this.activeViewId];
                tmpViewBack.activateView();
                let tmpNavEvent = this.views[this.activeViewId].navEvent;
                this.setActiveMenuElement(tmpNavEvent);
                this.activeRoute = this.views[this.activeViewId].route;
            }
        }
    }

    /**
     * @description Navigate Back to Specific View
     * @param {String} _viewId - View ID
     * @todo To be Implemented
     * @memberof ViewNavigator
     */
    navigateBackToView(_viewId) {

    }

    /**
     * @description Navigate to Specific View
     * @param {String} _viewId - View ID
     * @todo To be Implemented
     * @memberof ViewNavigator
     */
    navigateToView(_viewId) {

    }


    /**
     *
     * @description This method will be implemented by Subclass
     * @memberof ViewNavigator
     */
    removeActiveMenuElement(){

    }

    /**
     *
     * @description This method will be implemented by Subclass
     * @param {string} _navEvent - Navigation Event Name
     * @memberof ViewNavigator
     */
    setActiveMenuElement(_navEvent){

    }

    /**
     * @description Get ViewStack Object by ViewStackId
     * @param {String} _viewStackId - ViewStackID
     * @returns {Object} - ViewStack Instance
     * @memberof ViewNavigator
     */
    getViewStack(_viewStackId) {
        let tmpVstack = null;
        tmpVstack = this.viewstacks[_viewStackId];
        return tmpVstack;
    }

    /**
     * @description Get ViewObject by ViewId
     * @param {string} _viewId - ViewID
     * @returns {Object} - View Instance
     * @memberof ViewNavigator
     */
    getView(_viewId) {
        let tmpV = null;
        tmpV = this.views[_viewId];
        return tmpV;
    }

    /**
     * @description 
     * ViewNavigator Lifecycle Method,
     * Call by ViewManager,
     * Render ViewNavigator DOM Content
     * @public
     * @memberof ViewNavigator
     */
    render() {
        if (!this.isRendered) {
            this.renderNavigator();
            this.renderNavigatorContent();
        }
    }

    /**
     *
     * @description Renders, ViewNavigator DOM Element , it call by Render Method 
     * @private
     * @memberof ViewNavigator
     */
    renderNavigator() {
        let tmpParentId = this.parentId;
        let tmpParentElement = null;
        if (this.parentId != "root") {
            tmpParentElement = ElementUtils.container(this.parentContainer,this.parentId);
        } else {
            tmpParentElement = document.getElementById(tmpParentId);
        }
        if (tmpParentElement != null) {
            let tmpNavigatorEl = ElementUtils.constructNavigatorBaseElement(this.id);
            tmpParentElement.insertAdjacentHTML('beforeend', tmpNavigatorEl);
            this.isRendered = true;
        } else {
            throw new Error("ViewNavigator : No Parent Element found for Navigator");
        }

    }

    
    /**
     * @description Render Navigator Subclass DOM Element content
     * @private
     * @override
     * @memberof ViewNavigator
     */
    renderNavigatorContent() {}


    /**
     * 
     * @description 
     * ViewNavigator Lifecycle Method,
     * 
     * Call by ViewManager to destroy ViewNavigator,
     * 
     * Remove Event Handlers, Make Properties null, 
     * 
     * Remove Views and Viewstack objects.
     * 
     * Remove ViewNavigator DOM Element and Its Contents
     * 
     * Remove EventRoute Object
     * 
     * @public
     * @memberof ViewNavigator
     */
    destroy() {
        for (let viewObj in this.views) {
            let tmpview = this.views[viewObj];
            tmpview.destroy();
        }
        for (let viewStkObj in this.viewstacks) {
            let tmpviewstk = this.viewstacks[viewStkObj];
            tmpviewstk.destroy();
        }


        let tmpNavigatorEl = ElementUtils.viewNavigator(this.id);
        tmpNavigatorEl.parentNode.removeChild(tmpNavigatorEl);

        this.views = null;
        this.viewstacks = null;
        this.parentId = null;
        this.id = null;
        this.parentId = null;
        this.parentContId = null;
        this.activeViewId = null;
        this.activeViewStackId = null;
        this.activeRoute = null;
        this.eventRoute = null;
        this.isRendered = false;

    }

}

export default ViewNavigator;