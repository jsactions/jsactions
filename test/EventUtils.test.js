import  EventUtils  from '../src/jsactions/utils/EventUtils';
import { expect } from 'chai';

describe('EventUtils', () => {

    it('should check Forgetpassword navigation event name ', function () {
        expect(EventUtils.FORGOTPWD_NAV_EVENT).to.equal('Forgotpwd_Nav_Event');
    });

    it('should check Register navigation event name ', function () {
        expect(EventUtils.REGISTER_NAV_EVENT).to.equal('Register_Nav_Event');
    });

    it('should check Back navigation event name ', function () {
        expect(EventUtils.BACK_NAV_EVENT).to.equal('Back_Nav_Event');
    });

    it('should check  navigation change event name ', function () {
        expect(EventUtils.NAV_CHANGE_EVENT).to.equal('navigation_change_event');
    });

    it('should check intialize   event name ', function () {
        expect(EventUtils.INITIALIZE_EVENT).to.equal('initialize_event');
    });

    it('should check attached   event name ', function () {
        expect(EventUtils.ATTACHED_EVENT).to.equal('attached_event');
    });

    it('should check detached   event name ', function () {
        expect(EventUtils.DETACHED_EVENT).to.equal('detached_event');
    });

    it('should check activate  event name ', function () {
        expect(EventUtils.ACTIVATE_EVENT).to.equal('activate_event');
    });

    it('should check deactivate  event name ', function () {
        expect(EventUtils.DEACTIVATE_EVENT).to.equal('deactivate_event');
    });

    it('should check  change event name ', function () {
        expect(EventUtils.CHANGE).to.equal('change');
    });

    it('should check click event name ', function () {
        expect(EventUtils.CLICK).to.equal('click');
    });

    it('should check view event name ', function () {
        expect(EventUtils.VIEW_EVENT).to.equal('view_event');
    });

    it('should check model event name ', function () {
        expect(EventUtils.MODEL_EVENT).to.equal('model_event');
    });

    it('should check component event name ', function () {
        expect(EventUtils.COMPONENT_EVENT).to.equal('component_event');
    });


});