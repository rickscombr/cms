const asserts = require('assert'),
    expect = require("chai").expect,
    request = require("request"),
    amd = require("amd-loader"),
    { JSDOM } = require('jsdom'),
    jsdom = new JSDOM('<!doctype html><html><body></body></html>'),
    { window } = jsdom,
    $ = global.jQuery = require('jquery')(window);




describe('Paises - Verifica status da API - GET', () => {

    module.response;
    module.url = [];

    const url = "/sites/api/paises";

    it('status : 200', (done) => {
        request.get(process.env.NODE_ENV + url, (err, res, body) => {

            expect(res.statusCode).to.equal(200);
            module.response = JSON.parse(res.body);

            done();
        })
    })
})


describe('Paises - Verifica se todos os objetos ESPERADOS estão preenchidos', () => {

    it('_link_, id, pais', (done) => {
        for (var i in module.response) {

            module.url.push(module.response[i]._link_);
            expect(module.response[i]).to.have.all.keys('_link_', 'pais');
        }
        done();
    })
})