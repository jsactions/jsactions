import  Router  from '../src/jsactions/core/Router';
import { expect } from 'chai';

describe('Router', () => {
    let tmpRoutes = [
        { path: "/hello", navigatorId: "simpleNavigator",parentId: "root" }
    ];
    let routes = new Router(tmpRoutes);

    it('should check add Routes and findNavigator ', function () {
        routes.addRoute("/testpath","testnavigator","root");
        expect(routes.findNavigator("/testpath")[0]).to.equal('testnavigator');
    });

    it('should check findNavigatorParent ', function () {
        routes.printRoutes();
        expect(routes.findNavigatorParent("simpleNavigator")).to.equal("root");
    });
});