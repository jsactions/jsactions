import  EventBroadcaster  from '../src/jsactions/events/EventBroadcaster';
import  EventChannel  from '../src/jsactions/events/EventChannel';
import  NavigationEvent  from '../src/jsactions/events/NavigationEvent';
import  EventUtils from '../src/jsactions/utils/EventUtils';
import { expect } from 'chai';


describe('EventBroadcaster', () => {
    
    EventBroadcaster.navEventChannel.addEventListener(EventUtils.NAV_CHANGE_EVENT, event => { handleEvent(event) });
    let helloNavEvent = new NavigationEvent(EventUtils.NAV_CHANGE_EVENT, "Test_NavEvent", "Message :: Hello World !!!", "/hello");
    EventBroadcaster.navEventChannel.dispatchEvent(helloNavEvent);

    function handleEvent(e) {
        let tmpRoute = e.route;
        let tmpNavEvtName = e.eventName;
        let tmpNavparams = e.params;
        it('should check navigation channel eventname , route, navigation params ', function () { 
            expect(tmpRoute).to.equal('/hello');
            expect(tmpNavEvtName).to.equal('Test_NavEvent');
            expect(tmpNavparams).to.equal("Message :: Hello World !!!");
        });  
    }
    
});