/**
 * Created by ethan on 2014/8/13.
 */
describe('e2e tests for wizard page', function () {


    beforeEach(function () {
        //select SUV and save
        browser.get('#/wizardPage');
    });

    it('test whether the watch function is working', function () {
        element(by.model('selectedModel')).sendKeys('SUV');
        //submit button should be enabled
        expect(element(by.id('wiz-next')).getAttribute('disabled')).toBeFalsy();
        expect(element(by.id('wiz-next')).isEnabled()).toBeTruthy();


        //inputs should be filled by watch function
        expect(element(by.model('consumption')).getAttribute('value')).toBe('12');
        expect(element(by.model('tankVol')).getAttribute('value')).toBe('60');

    });

});