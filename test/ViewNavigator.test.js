import  ViewNavigator  from '../src/jsactions/core/ViewNavigator';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('ViewNavigator', () => {
    let tmpNavigator = null;
    before(function() {
        return JSDOM.fromFile('./test/indextest.html')
          .then((dom) => {
            global.window = dom.window;
            global.document = window.document;
          });
      })

    it('should check ViewNavigator created and activate', function () {
        tmpNavigator = new ViewNavigator("rootNavigator1", "root");
        tmpNavigator.render();
        let tmpNavigatorEl = document.querySelector(".rootNavigator1");
        expect(tmpNavigatorEl.outerHTML).to.equal('<div class="jsact-viewnavigator rootNavigator1"></div>');
    });

});