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


import EventChannel from './EventChannel';

/**
 * 
 * EventBroadCaster is Centralize Singleton Static Class use to Broadcast Events in Application on Application Channel or Navigation Channel from Publisher to Subscribers Objects such View, ViewNavigator, ViewManager, Component etc.  
 * 
 * Supports Event Communication with One to One , One to Many pattern
 */
class EventBroadCasters {


    /**
     * @example Publish using Navigation Channel
       //create Navigation Event
       let helloNavEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, "Hello_NavEvent", "Message :: Hello World !!!", "/hello");

       // Dispatch Navigation Event on Navigation Event Channel
       EventBroadCaster.navEventChannel.dispatchEvent(navEvent);

       @example Subscribe using Navigation Channel to Receive Navigation Event
       
       EventBroadCaster.navEventChannel.addEventListener(EventUtils.NAV_CHANGE_EVENT, event => { this.handleNavChangeEvent(event); });


     * @memberof EventBroadCaster
     */
    constructor() {
        if (!EventBroadCasters.instance) {
            EventBroadCasters.instance = this;
            this.appEvtChannel = new EventChannel("APPLICATIONEVENT");
            this.navEvtChannel = new EventChannel("NAVIGATIONEVENT");
        }
        return EventBroadCasters.instance;

    }


    /**
     * @description Returns Application Event Channel Instance
     * @returns {Object}
     * @readonly
     * @memberof EventBroadCaster
     */
    get appEventChannel() {
        return this.appEvtChannel;
    }


    /**
     * @description Returns Navigation Event Channel Instance
     * @returns {Object} 
     * @readonly
     * @memberof EventBroadCaster
     */
    get navEventChannel() {
        return this.navEvtChannel;
    }



}

const EventBroadCaster = new EventBroadCasters();
// prevents new properties from being added to the object
Object.freeze(EventBroadCaster);

export default EventBroadCaster;