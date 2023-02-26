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
 *
 * EventUtils is static class and provides common Event Constants.
 */
class EventUtils {
    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get FORGOTPWD_NAV_EVENT() {
        return "Forgotpwd_Nav_Event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get REGISTER_NAV_EVENT() {
        return "Register_Nav_Event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get BACK_NAV_EVENT() {
        return "Back_Nav_Event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get NAV_CHANGE_EVENT() {
        return "navigation_change_event";
    }

    //View,Navigator Specific Events

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get INITIALIZE_EVENT() {
        return "initialize_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get ATTACHED_EVENT() {
        return "attached_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get DETACHED_EVENT() {
        return "detached_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get ACTIVATE_EVENT() {
        return "activate_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get DEACTIVATE_EVENT() {
        return "deactivate_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get CHANGE() {
        return "change";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get CLICK() {
        return "click";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get VIEW_EVENT(){
        return "view_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get MODEL_EVENT(){
        return "model_event";
    }

    /**
     *
     *
     * @readonly
     * @static
     * @memberof EventUtils
     */
    static get COMPONENT_EVENT(){
        return "component_event";
    }


}

export default EventUtils;