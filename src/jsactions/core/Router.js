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
 *
 * Router holds and manages array of Path routes
 * Path Routes are used by ViewManager to find associated Navigator and Viewstack
 * Viewmanager find Viewnavigator based on Routes info set in Router Object
 * see Example
 */
class Router {

    /**
     *  @example Sample Router Object is to be implement in "AppViewManager" class (subclass of ViewManager) 
     
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
     * @param {array} [_routes=[]] - Path routes array
     * @memberof Router
     */
    constructor(_routes = []) {
        this.routes = _routes;
    }


    /**
     *
     * @description Adds new Path Route
     * @param {string} _path - Path Name
     * @param {string} _navigatorId -  Navigator ID
     * @param {string} _parentId -  Parent Object / Element ID
     * @memberof Router
     */
    addRoute(_path, _navigatorId, _parentId) {
        let route = {};
        route.path = _path;
        route.navigatorId = _navigatorId;
        route.parentId = _parentId;
        this.routes.push(route);
    }


    /**
     *
     * @description finds associated Navigator by Path route Name
     * @param {string} _route
     * @returns {Array} - NavigatorID Array
     * @memberof Router
     */
    findNavigator(_route) {
        let tmpNavigatorIds = [];
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].path === _route)
                tmpNavigatorIds.push(this.routes[i].navigatorId);
        }
        return tmpNavigatorIds;
    }

    findRouteNavigators(_route){
        //let path = "/rootpath/path9/path8"
        let tmpNewRouteArray = _route.split("/");
        let tmpNavigatorIds = [];
        tmpNewRouteArray.shift();
        let length =  tmpNewRouteArray.length;
        let routesArray = [];
        for (let x = 0; x < tmpNewRouteArray.length; x++) {
            let tmppathStr = "";
            for (let y = 0; y <= x; y++){
                tmppathStr += "/" + tmpNewRouteArray[y];
            }
            routesArray.push(tmppathStr);
            //["/rootpath", "/rootpath/path9", "/rootpath/path9/path8"]
        
        }
        for (let z = 0; z < routesArray.length; z++) {
            let tmpRouteArr = this.findNavigator(routesArray[z]);
            tmpNavigatorIds[z] = tmpRouteArr[0];
        }
        return tmpNavigatorIds;
    }


    /**
     *
     * @description finds associated Navigator Parent by navigator ID
     * @param {string} _navigatorId
     * @returns {string} - Parent ID
     * @memberof Router
     */
    findNavigatorParent(_navigatorId) {
        let tmpParentId = "root";
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].navigatorId === _navigatorId)
                tmpParentId = this.routes[i].parentId;
        }
        return tmpParentId;
    }


    /**
     *
     * @description finds associated ViewStack  by Path route Name
     * @param {string} _route
     * @returns {string} - ViewStack ID
     * @memberof Router
     */
    findViewStack(_route) {
        let tmpViewStackId = null;
        for (let j = 0; j < this.routes.length; j++) {
            if (this.routes[j].path == _route)
                tmpViewStackId = this.routes[j].viewstackId;
        }
        return tmpViewStackId;
    }

    /**
     *
     * @description Remove and Resets existing path routes
     * @memberof Router
     */
    reset() {
        this.routes = [];
    }

    /**
     *
     * @description prints path Routes
     * @memberof Router
     */
    printRoutes() {
        if (this.routes.length > 0) {
            for (let i = 0; i < this.routes.length; i++) {
                console.log("path:" + this.routes[i].path + " navigatorId:" + this.routes[i].navigatorId);
            }
        } else {
            console.log("No Routes Found");
        }
    }

}

export default Router;