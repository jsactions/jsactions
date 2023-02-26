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


/**
 * EventRouter holds and manages array of event routes.
 * Event Routes are used by ViewNavigator to find associated View and Viewstack
 * 
 * Viewnavigator find View and ViewStack based on Routes info set in EventRouter Object see Example
 * 
 */

 class EventRouter {


    /**
     * @example Sample Event Router Object is in "SimpleNavigator" class (subclass of ViewNavigator) 
     
        initEventRoutes() {
            let evtRoutes = [

               { navEvent: " Login_NavEvent ", viewstackId: “LoginStack", viewId: “loginView", path: "/login" },
               { navEvent: " Register_NavEvent ", viewstackId: “LoginStack", viewId: “registerView", path: "/login" },
               { navEvent: " ForgotPwd_NavEvent", viewstackId: “LoginStack", viewId: “forgotpwdView", path: "/login" }

            ]
            this.eventRouter = new EventRouter(evtRoutes);
        }

        Here "navEvent" is Event Name, "viewstackId" is ViewStack Id, "viewId" is ViewId and "path" is routeID by which ViewNavigator associated.

     * 
     * @param {array} [_routes=[]] - Events routes array
     * @memberof EventRouter
     */
    constructor(_routes = []) {
        this.routes = _routes;
    }


    /**
     *
     * @description Adds new Event Route
     * @param {string} _navEvent - Navigation Event Name
     * @param {string} _viewstackId - ViewStack ID
     * @param {string} _viewId -  View ID
     * @param {string} _path -  Navigator Route path associted 
     * @memberof EventRouter
     */
    addRoute(_navEvent, _viewstackId, _viewId, _path) {
        let route = {};
        route.navEvent = _navEvent;
        route.viewstackId = _viewstackId;
        route.viewId = _viewId;
        route.path = _path;
        this.routes.push(route);
    }


    /**
     *
     * @description find Event Route using Naviagtion EventName
     * @param {string} _navEvent
     * @returns {Object} Event Route Object
     * @memberof EventRouter
     */
    findRoute(_navEvent) {
        let tmpRoute = [];
        for (let x = 0; x < this.routes.length; x++) {
            if (this.routes[x].navEvent == _navEvent)
                tmpRoute[x] = this.routes[x];
        }
        return tmpRoute;
    }


    /**
     *
     * @description finds associated view by Navigation EventName and Path
     * @param {string} _navEvent
     * @param {string} _path
     * @returns {string} - ViewID 
     * @memberof EventRouter
     */
    findViewId(_navEvent, _path) {
        let tmpViewId = [];
        for (let i = 0; i < this.routes.length; i++) {
            if ((this.routes[i].navEvent == _navEvent) && (this.routes[i].path == _path))
                tmpViewId = this.routes[i].viewId;
        }
        return tmpViewId;
    }


    /**
     *
     * @description finds associated viewstack by Navigation EventName and Path
     * @param {string} _navEvent
     * @param {string} _path
     * @returns {string} - ViewStackID
     * @memberof EventRouter
     */
    findViewStackId(_navEvent, _path) {
        let tmpViewStackId = null;
        for (let j = 0; j < this.routes.length; j++) {
            if ((this.routes[j].navEvent == _navEvent) && (this.routes[j].path == _path))
                tmpViewStackId = this.routes[j].viewstackId;
        }
        return tmpViewStackId;
    }


    /**
     *
     * @description Remove and Resets existing event routes
     * @memberof EventRouter
     */
    reset() {
        this.routes = [];
    }


    /**
     *
     * @description prints Event Routes
     * @memberof EventRouter
     */
    printRoutes() {
        if (this.routes.length > 0) {
            for (let i = 0; i < this.routes.length; i++) {
                console.log("navEvent:" + this.routes[i].navEvent + " viewstackId:" + this.routes[i].viewstackId + " viewId:" + this.routes[i].viewId);
            }
        } else {
            console.log("No Routes Found");
        }
    }

}

export default EventRouter;