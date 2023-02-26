import  EventRouter  from '../src/jsactions/core/EventRouter';
import { expect } from 'chai';

describe('EventRouter', () => {
    let helloEvntRoutes = [
        { navEvent: "Hello_NavEvent", viewstackId: "HelloWorldStack", viewId: "helloview", path: "/hello" }
    ];
    let eventRouter = new EventRouter(helloEvntRoutes);

    it('should check addRoute and findRoute by Navigation Event ', function () {
        eventRouter.addRoute("Test_NavEvent","TestViewStack","testview","/testpath");
        let evtroute = eventRouter.findRoute("Test_NavEvent");
        expect(eventRouter.findRoute("Test_NavEvent")[1].path).to.equal("/testpath");
    });

    it('should check findView Id ', function () {
        eventRouter.printRoutes();
        expect(eventRouter.findViewId("Hello_NavEvent","/hello")).to.equal('helloview');
    });

    it('should check findViewStackId Id ', function () {
        expect(eventRouter.findViewStackId("Hello_NavEvent","/hello")).to.equal('HelloWorldStack');
    });

});