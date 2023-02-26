import  Container  from '../src/jsactions/core/Container';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('Container', () => {
    let container1 = null;
    before(function() {
        return JSDOM.fromFile('./test/indextest.html')
          .then((dom) => {
            global.window = dom.window;
            global.document = window.document;

            container1 = new Container("RootViewPanel","rootview",false);
            container1.init();
            container1.attach();
            container1.enabled = true;
            container1.visible = true;
          });
      })

    

    
    it('should check Container isEnabled', function () {
        expect(container1.enabled).to.equal(true);
    });


    it('should check Container visible', function () {
        expect(container1.visible).to.equal(true);
    });

    it('should get Container ParentView', function () {
        expect(container1.parent).to.equal("rootview");
    });

});