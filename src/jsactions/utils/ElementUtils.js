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


import InstanceId from './InstanceId';


/**
 *
 * ElementUtils creates DOM wrapper for JSactions core Objects such as View, ViewNavigator, ViewStack, Component, Container
 * 
 * JSactions core object ->  HTML DOM wrapper
 * 
   ViewNavigator HTML DOM wrapper:
       &lt; div class="jsact-viewnavigator ${navigatorId}" &gt;

   ViewStack HTML DOM wrapper:
        &lt; div class="jsact-viewstack ${viewstackId}" &gt;

   View HTML DOM wrapper:
         &lt; div class="jsact-view ${viewId}" &gt;

   Container HTML DOM wrapper:
         &lt; div class="jsact-container ${containerId}" &gt;

   Component HTML DOM wrapper:
        &lt; div class="jsact-component ${componentId}" &gt;
 * 
 * 

 */
class ElementUtils {
    
    /**
     *
     * Find  Component DOM Element by ComponentID
     * @example
        let tmpViewId = this.id; 
        let buttonEl = ElementUtils.component("buttonComp",tmpViewId);

     * @static
     * @param {string} _componentId
     * @param {string} _viewId
     * @returns {string} Component DOM Element with ".jsact-component" css class
     * @memberof ElementUtils
     */
    static component(_componentId,_viewId) {
        let viewEl = ElementUtils.view(_viewId);
        return viewEl.querySelector(".jsact-component." + _componentId);
    }


    /**
     *
     * Find  Container DOM Element by ContainerID
     * @example 
        let tmpViewId = this.id; 
        let buttonContEl = ElementUtils.container("helloContainer",tmpViewId);
     *
     * @static
     * @param {string} _containerId
     * @param {string} _viewId
     * @returns {string} Container DOM Element with ".jsact-container" css class
     * @memberof ElementUtils
     */
    static container(_containerId,_viewId) {
        let viewEl = ElementUtils.view(_viewId);
        return viewEl.querySelector(".jsact-container." + _containerId);
    }


    /**
     *
     * Find  View DOM Element by ViewID
     * @example 
        let tmpViewId = this.id; 
        let viewEl = ElementUtils.view(tmpViewId);

     * @static
     * @param {string} _viewId
     * @returns {string} View DOM Element with ".jsact-view" css class
     * @memberof ElementUtils
     */
    static view(_viewId) {
        return document.querySelector(".jsact-view." + _viewId);;
    }


    /**
     *
     * Find  ViewStack DOM Element by ViewStackID
     * @example 
        let tmpViewstackId = this.id; 
        let viewEl = ElementUtils.viewStack(tmpViewstackId);
     * @static
     * @param {string} _viewStackId
     * @returns {string} ViewStack DOM Element with ".jsact-viewstack" css class
     * @memberof ElementUtils
     */
    static viewStack(_viewStackId) {
        return document.querySelector(".jsact-viewstack." + _viewStackId);;
    }


    /**
     *
     * Find  ViewNavigator DOM Element by ViewNavigatorID
     * @example 
        let tmpNavigatorId = this.id; 
        let viewEl = ElementUtils.viewNavigator(tmpNavigatorId);
     * @static
     * @param {string} _viewNavId
     * @returns {string} ViewNavigator DOM Element with ".jsact-viewnavigator" css class
     * @memberof ElementUtils
     */
    static viewNavigator(_viewNavId) {
        return document.querySelector(".jsact-viewnavigator." + _viewNavId);;
    }


    /**
     *
     * Creates  Component Base DOM Element by ComponentID
     * @static
     * @param {string} _componentId
     * @returns {string} Component DOM Element with ".jsact-component" css class
     * @memberof ElementUtils
     */
    static constructComponentBaseElement(_componentId) {
        return `<div class="jsact-component ${_componentId}"></div>`;
    }


    /**
     *
     * Creates  Container Base DOM Element by ContainerID
     * @static
     * @param {string} _containerId
     * @returns {string} Container DOM Element with ".jsact-container" css class
     * @memberof ElementUtils
     */
    static constructContainerBaseElement(_containerId) {
        return `<div class="jsact-container ${_containerId}"></div>`;
    }

    /**
     *
     * Creates  View Base DOM Element by ViewID
     * @static
     * @param {string} _viewId
     * @returns {string} View DOM Element with ".jsact-view" css class
     * @memberof ElementUtils
     */
    static constructViewBaseElement(_viewId) {
        return `<div class="jsact-view ${_viewId}"></div>`;
    }


    /**
     *
     * Creates  ViewStack Base DOM Element by ViewStackID
     * @static
     * @param {string} _viewStackId
     * @returns {string} ViewStack DOM Element with ".jsact-viewstack" css class
     * @memberof ElementUtils
     */
    static constructViewStackBaseElement(_viewStackId) {
        return `<div class="jsact-viewstack ${_viewStackId}"></div>`;
    }


    /**
     *
     * Creates  ViewNavigator Base DOM Element by ViewNavigatorID
     * @static
     * @param {string} _navigatorId
     * @returns {string} ViewNavigator DOM Element with ".jsact-viewnavigator" css class
     * @memberof ElementUtils
     */
    static constructNavigatorBaseElement(_navigatorId) {
        return `<div class="jsact-viewnavigator ${_navigatorId}"></div>`;
    }


    /**
     *
     * Hide DOM Element
     * @static
     * @param {string} _el - DOM Element
     * @memberof ElementUtils
     */
    static hideElement(_el) {
        _el.style.display = 'none';
    }


    /**
     *
     * Show DOM Element
     * @static
     * @param {string} _el -  DOM Element
     * @memberof ElementUtils
     */
    static showElement(_el) {
        _el.style.display = 'block';
    }


    /**
     *
     * Check if DOM Element is visible
     * @static
     * @param {string} _el - DOM Element
     * @returns {Boolean} 
     * @memberof ElementUtils
     */
    static isVisible(_el){
        return (_el.style.display == "block") ? true :false;
    }


    /**
     *
     * Generate Unique Component Instance ID
     * @static
     * @returns {string} 
     * @memberof ElementUtils
     */
    static generateComponentId(){
        return "component"+InstanceId.generate;
    }


    /**
     *
     * Generate Unique Container Instance ID
     * @static
     * @returns {string}
     * @memberof ElementUtils
     */
    static generateContainerId(){
        return "container"+InstanceId.generate;
    }
}

export default ElementUtils;