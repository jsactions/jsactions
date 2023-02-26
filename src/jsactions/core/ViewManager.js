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
import Router from './Router';
import ViewNavigator from './ViewNavigator';
import EventBroadCaster from '../events/EventBroadcaster';
import EventUtils from '../utils/EventUtils';

/**
 *
 * ViewManager manages ViewNavigator.
 * 
 * It Subscribe to EventBroadcaster's Navigation channel to receive navigation change events.
 * 
 * ViewManager find ViewNavigator based on Path Routes data and it match route info received in navigation change event.
 * 
 * Following methods overrides and implement by ViewManager subclass executes in given order :
 * 
 *  1) initialize
 * 
 *  2) createNavigator
 * 
 *  3) initRoutes
 * 
 * 
 */
class ViewManager extends EventDispatcher {


    /**
     * @description ViewManager manages ViewNavigator.It Subscribe to EventBroadcaster's Navigation channel to receive navigation change events.
     * ViewManager find ViewNavigator based on Path Routes data and it match route info received in navigation change event.
     * 
     * @memberof ViewManager
     */
    constructor() {
        super();
        this.preinitialize();
        this.initialize();
    }


    /**
     * @description preinitialize navigators,router etc.
     * @private
     * @memberof ViewManager
     */
    preinitialize() {
        
        this.router = new Router();
        this.rootId = "root";

        this.navigators = {};
        this.currentRouteNavArray = [];
        this.currentRoute = null;

        EventBroadCaster.navEventChannel.addEventListener(EventUtils.NAV_CHANGE_EVENT, event => { this.handleNavChangeEvent(event); });
    }

    /**
     * @description Implement by subclass to initialise 
     * @example initialize method is to be override in "AppViewManager" class (subclass of ViewManager) 
     
       initialize() {
        super.initialize();
        this.initRoutes();
        }
     * 
     * @override
     * @public
     * @memberof ViewManager
     */
    initialize() {

    }

    /**
     * @description 
     * Viewmanager find Viewnavigator based on Routes info set in Router Object
     * 
     @example Sample Router Object is to be implement in "AppViewManager" class (subclass of ViewManager) 
     
        initRoutes() {
            let tmpRoutes = [
                { path: "/login", navigatorId: " LoginNavigator",parentId: "root" },
                { path: "/file", navigatorId: " FileNavigator",parentId: "root" },
                { path: "/logout", navigatorId: "ExitNavigator",parentId: "root" },
            ]
            this.routes = new Router(tmpRoutes);
        }

      Here "path" is routeID, "navigatorId" is viewNavigatorId, "parentId" is DOM Element Id or ViewId or ContainerId.
      By Default Main DOM Element have id="root"

     * 
     * @description Here path is routeID, navigatorID is viewNavigatorId, 
     * parentId is DOM Element Id or ViewId in case of Nested View Navigators
     * By Default Main DOM Element have id="root"
     * 
     * @memberof ViewManager
     */

    set routes(_router) {
        if (!_router instanceof Router) {
            throw new Error("ViewManager: Wrong Type of Router");
        }
        this.router = _router;
    }


    get routes() {
        return this.router;
    }

    /**
     * @description ViewManager calls createNavigator method when ViewNavigator is not created yet. 
     * 
     * @example createNavigator method is to be override in "AppViewManager" class (subclass of ViewManager) 
       
       createNavigator(_navigatorId, _parentId,_parentContainerId) {
        let tmpNavigator = null;
        switch (_navigatorId) {
            case "simpleNavigator":
                tmpNavigator = new SimpleNavigator(_navigatorId, _parentId,_parentContainerId);
            break;

            default:
                tmpNavigator = new ViewNavigator(_navigatorId, _parentId,_parentContainerId);

        }
        return tmpNavigator;
    }
     * 
     * @param {string} _navigatorId - ViewNavigatorId
     * @param {string} _parentId - ParentId is DOM Element id or ViewID
     * @param {string} _parentConId - ParentContainerID used in case of NestedNavigator
     * @returns {Object} - New Instance of ViewNavigator
     * @memberof ViewManager
     */
    createNavigator(_navigatorId, _parentId,_parentConId) {
        return new ViewNavigator(_navigatorId, _parentId,_parentConId);
    }

    /**
     * @description ViewManager maintains navigators object in Key, Value form.
     * Where key is viewNavigatorID and value is ViewNavigator Object Instance
     * @param {Object} _navigator - ViewNavigator
     * @param {string} _navigatorId - ViewNavigatorID
     * @memberof ViewManager
     */
    addNavigator(_navigator, _navigatorId) {
        this.navigators[_navigatorId] = _navigator;
        //this.currentNavigatorIds.push(_navigatorId);
    }


    addNavIdRoute(_route, _navigatorId) {
        //let newNavRoute = {route:"/path2",navId:"Navigator2"};
        let newNavRoute = {route:_route,navId:_navigatorId};
        this.currentRouteNavArray.push(newNavRoute);
    }

    /**
     * @returns {Object} - ViewNavigator Object Instance by ViewNavigatorId.
     * @param {string} _navigatorId - ViewNavigatorID
     * @memberof ViewManager
     */
    getNavigator(_navigatorId) {
        let tmpnavNav = null;
        if (this.navigators[_navigatorId] != null)
            tmpnavNav = this.navigators[_navigatorId];
        return tmpnavNav;
    }

    /**
     * @returns {Array} - NavigatorID Array 
     * @param {string} _route - Path Route Name
     * @memberof ViewManager 
     */
    findRouteNavigator(_route) {
        let tmpNavigatorIds = this.router.findNavigator(_route);
        return tmpNavigatorIds;
    }

    /**
     * @returns {string} - ParentID of ViewNavigator 
     * @param {string} _navigatorId - ViewNavigatorID
     * @memberof ViewManager
     */
    getNavigatorParent(_navigatorId) {
        let tmpNavParentId = this.router.findNavigatorParent(_navigatorId);
        return tmpNavParentId;
    }

    /**
     * @returns {string} - Parent Container ID of ViewNavigator 
     * @param {string} _route - Path Route Name
     * @param {string} _navParentViewId - Parent ViewID
     * @memberof ViewManager
     */
    getParentNavContainer(_route,_navParentViewId,_tmpNavId) {
        // { path: "/path9/path8", navigatorId: "Navigator4",parentId: "p9view1" },
        let tmpParentNavContrEl = this.rootId;
        if(_navParentViewId != this.rootId){
            let tmpNewRouteArray = _route.split("/");
            tmpNewRouteArray.shift();
            tmpNewRouteArray.splice(tmpNewRouteArray.length-1, 1);

            let tmpParentRouteId = "";
            let tmpparentRouteArray = [];
            for(let y=0;y < tmpNewRouteArray.length;y++){
                tmpParentRouteId += "/"+tmpNewRouteArray[y];
            }
            //let tmpParentRouteId = tmpparentRouteArray.toString();
            let tmpParentNavId = null;
                    for(let z= 0; z < this.currentRouteNavArray.length;z++){
                        let tmpRouteId = this.currentRouteNavArray[z].route;
                        if(tmpRouteId == tmpParentRouteId){
                            tmpParentNavId = this.currentRouteNavArray[z].navId;
                        }
                    }
            let tmpParentNav = this.navigators[tmpParentNavId];
            let tmpParentNavView = tmpParentNav.getView(_navParentViewId);
            tmpParentNavContrEl = tmpParentNavView.getNavContainerId(_tmpNavId);
        }
        return tmpParentNavContrEl;
    }

    handleNavChangeEvent(e) {
        let tmpRoute = e.route;
        let tmpNavEvtName = e.eventName;
        let tmpNavparams = e.params;
        this.changeNavigation(tmpRoute,tmpNavEvtName,tmpNavparams);    
    }

    /**
     * @description 
     * changeNavigation method called when ViewManager Receive Forward Navigation Event
     * @private
     * @param {String} _route - Navigation Route / Path 
     * @param {Event} _naveventname - Navigation EventName
     * @param {Object} _navparams - Navigation Parameters pass to ViewNavigator
     * @memberof ViewManager
     */
    changeNavigation(_route, _naveventname, _navparams) {
        let newRoute = _route;
        let navigatorIds = this.findRouteNavigator(_route);
        if (_naveventname == EventUtils.BACK_NAV_EVENT) {
            // No Need to destroy / hide navigator assuming its same navigator
            this.changeBackNavigation(navigatorIds, _route);
        } else {

            // 1) FirstTime load /path1
            if((this.currentRoute == null)&&(this.currentRouteNavArray.length == 0)){
                this.currentRoute = newRoute;
                this.changeForwardNavigation(navigatorIds, newRoute, _naveventname, _navparams);
            } else{
                let tmpResultArray = this.chkNewRouteHaveCurrentRoute(newRoute);
                if((this.currentRoute != newRoute)&& (tmpResultArray.length == 0)){
                    let unusedNavIds = [];
                    let tmpRouteAryLength = this.currentRouteNavArray.length -1;
                    for(let i=tmpRouteAryLength; i >= 0 ;i--){
                        unusedNavIds.push(this.currentRouteNavArray[i].navId);
                    }
                    this.destroyUnusedNavigators(unusedNavIds);
                    this.currentRouteNavArray = [];
                    this.currentRoute = newRoute;
                    this.changeForwardNavigation(navigatorIds, newRoute, _naveventname, _navparams);
                    
                } else {
                    //((this.currentRoute != newRoute)&& (tmpResultArray.length > 0))
                    //((this.currentRoute == newRoute)&& (tmpResultArray.length > 0))
                    //this.chkAndDestroyNestedNavs(this.currentRoute);
                    this.chkAndDestroyNestedNavs(newRoute);
                    this.currentRoute = newRoute;
                        this.changeForwardNavigation(navigatorIds, newRoute, _naveventname, _navparams);
                }
            } 
        } 
    }

    
    chkNewRouteHaveCurrentRoute(_newRoute){
        let tmpNewRouteArray = _newRoute.split("/");
        tmpNewRouteArray.shift();
        let tmpCurrRouteArray = this.currentRoute.split("/");
        tmpCurrRouteArray.shift();
        let tmpResultArray = tmpCurrRouteArray.filter(x => tmpNewRouteArray.includes(x));
        return tmpResultArray;
    }

    /**
     * @description 
     * changeBackNavigation change from current view to one previous view of viewstack by calling navigateBack method of multiple ViewNavigators associated same path route.
     * @private
     * @param {Array} _navigatorIds - Array of ViewNavigators.
     * @param {String} _route - Path route
     * @memberof ViewManager
     */
    changeBackNavigation(_navigatorIds, _route) {
        if (_navigatorIds.length > 0) {
            for (let j = 0; j < _navigatorIds.length; j++) {
                let tmpNavId = _navigatorIds[j];
                let tmpNavigator = this.getNavigator(tmpNavId);
                if(tmpNavigator.history == true){
                    tmpNavigator.navigateBack(_route);
                }
            }
        }

    }

    /**
     * @description 
     * changeForwardNavigation method called when ViewManager Receive Forward Navigation Event
     * @private
     * @param {Array} _navigatorIds - NavigatorId Array
     * @param {String} _route - Navigation Route / Path 
     * @param {Event} _navevent - Navigation Event
     * @param {Object} _navparams - Navigation Parameters pass to ViewNavigator
     * @memberof ViewManager
     */
    changeForwardNavigation(_navigatorIds, _route, _navevent, _navparams) {
        //this.checkAndDestroyNavigators(_navigatorIds, _route);
        if (_navigatorIds.length > 0) {
            for (let k = 0; k < _navigatorIds.length; k++) {
                let tmpNavid = _navigatorIds[k];
                let tmpNavigator = this.getNavigator(tmpNavid);
                if (tmpNavigator == null) {
                    // Add code here to find parent of Navigator.
                    let tmpNavParentId = this.getNavigatorParent(tmpNavid);
                    let tmpNavParentConId = this.getParentNavContainer(_route,tmpNavParentId,tmpNavid);
                    tmpNavigator = this.createNavigator(tmpNavid, tmpNavParentId,tmpNavParentConId);
                    this.addNavigator(tmpNavigator, tmpNavid);
                    this.addNavIdRoute(_route,tmpNavid);
                    tmpNavigator.render();
                    /* createNavigator will call internally addNavigator to save created navigator */
                    // tmpNavigator.addEventListner("changeNavEvent",onNavChangeEvent); 
                }
                tmpNavigator.navigate(_route, _navevent, _navparams);
            }
        }

    }

    chkAndDestroyNestedNavs(_route) {
        // Find Navigators Ids with current active route
        let tmpCurrNavIds = this.findRouteNavigator(_route);
        //let tmpNavIds = this.router.findRouteNavigators(_route);
        //let tmpCurrentNavIds = this.router.findRouteNavigators(this.currentRoute);
        let tmpCurrViewIds = [];
        let tmpNestNavIds = [];

        // Chk Active route Navigators have history false
        // If History false then get its ViewId
        if (tmpCurrNavIds.length > 0) {
            for (let x = 0; x < tmpCurrNavIds.length; x++) {
                let tmpCurrNavId = tmpCurrNavIds[x];
                if(this.navigators[tmpCurrNavId] != null)  {
                    let tmpViewId = this.navigators[tmpCurrNavId].activeViewId;
                    if(this.navigators[tmpCurrNavId].history == false){
                        tmpCurrViewIds.push(tmpViewId);
                    }
                } 
            }
        }

        // Find Navigators who have Active ViewId as Parent
        if (tmpCurrViewIds.length > 0) {
            for (let y = 0; y < tmpCurrViewIds.length; y++) {
                let tmpViwId = tmpCurrViewIds[y];
                let tmpNestNavId = this.chkViewAsNavigatorParent(tmpViwId);
                if(tmpNestNavId != null){
                    tmpNestNavIds.push(tmpNestNavId);
                }
            }
        }

        // Destory Navigators who have Active ViewId as Parent
        if(tmpNestNavIds.length > 0){
            this.destroyUnusedNavigators(tmpNestNavIds);
            this.delNavFromCurrRouteArr(tmpNestNavIds);
        }

    }

    delNavFromCurrRouteArr(_tmpNavIds){
        let p = _tmpNavIds.length;
        while(p >= 0){
            for(let n= 0; n < this.currentRouteNavArray.length;n++){
                let tmpRouteNavId = this.currentRouteNavArray[n].navId;
                if(tmpRouteNavId == _tmpNavIds[p]){
                    this.currentRouteNavArray.splice(n, 1); 
                }
            }
            p--;
        }

    }
    
    chkViewAsNavigatorParent(_viewId) {
        let tmpNavId = null;
        for( let nav in this.navigators){
            if(this.navigators[nav] != null){
                let tmpParentId = this.navigators[nav].parentId;
                if ((tmpParentId != null) && (tmpParentId == _viewId)){
                    tmpNavId = this.navigators[nav].id;
                } 
            } 
        }
        return tmpNavId;
    }

    /**
     * @description destroy unused Navigators
     * @private
     * @param {Array} _unusedNavigators 
     * @memberof ViewManager
     */
    destroyUnusedNavigators(_unusedNavigators) {
        if (_unusedNavigators.length > 0) {
            for (let p = 0; p < _unusedNavigators.length; p++) {
                let tmpNavid = _unusedNavigators[p];
                this.removeNavigator(tmpNavid);
            }
        }
    }

    /**
     * @description removes ViewNavigator object instance from navigators array.
     * @param {String} _navigatorId - NavigatorId
     * @memberof ViewManager
     */
    removeNavigator(_navigatorId) {
        let tmpnav = this.navigators[_navigatorId];
        tmpnav.destroy();
        tmpnav = null;
        this.navigators[_navigatorId] = null;
    };

    /**
     *
     * @todo Implment destroy method
     * @memberof ViewManager
     */
    destroyAll() {
        //TODO
    }
}

export default ViewManager;