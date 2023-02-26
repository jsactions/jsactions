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


import Event from "../../createjs/Event";


/**
 *
 * Navigation Generates Event with Navigation Type . Useful to dispatched Event with EventName, Params, Event Type, Route
 * 
 * It support loosely connected View and ViewNavigator.
 */
class NavigationEvent extends Event {

    /**
      *  @example 
       //create Navigation Event
       let helloNavEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, "Hello_NavEvent", "Message :: Hello World !!!", "/hello");

       // Dispatch Navigation Event on Navigation Event Channel
       EventBroadCaster.navEventChannel.dispatchEvent(navEvent);
       
     * @param {string} _type
     * @param {string} _eventName
     * @param {Object} _params
     * @param {string} _route
     * @param {*} _bubbles
     * @param {Boolean} _cancelable
     * @memberof NavigationEvent
     */
    constructor(_type, _eventName, _params, _route, _bubbles, _cancelable, ) {
        super(_type, _bubbles, _cancelable);
        this.type = _type;
        this.eventName = _eventName;
        this.params = _params;
        this.route = _route;
    }


    /**
     *
     *
     * @returns {Object} - creates and return NavigationEvent Instance
     * @memberof NavigationEvent
     */
    clone() {
        return new NavigationEvent(this.type, this.eventName, this.params, this.route, this.bubbles, this.cancelable);
    }
}

export default NavigationEvent;