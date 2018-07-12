'use strict';

const asserts = require('chai').assert,
    expect = require('chai').expect,
    request = require('request'),
    amdLoader = require('amd-loader'),
    { JSDOM } = require('jsdom'),
    jsdom = new JSDOM('<!doctype html><html><body></body></html>'),
    { window } = jsdom,
    $ = global.jQuery = require('jquery')(window),
    utils = require('../../app/assets/js/components/utils/main');


describe('Teste API Cidades', answerApi => {
    module.response;
    module.url = [];

    const url = "https://www.claro.com.br/sites/api/cidades";
    //const url = "http://localhost:3000/data/paises.json";

    it('Cidades - Status 200', done => {
        request.get(url, (err, res, body) => {
            expect(res.statusCode).to.equal(200);

            module.response = JSON.parse(res.body);

            done();
        })
    });

    it('Cidades - Verifica se o objeto possui as chaves e valores esperados ( "estado", "ddd", "nome" )', done => {
        expect(module.response[0]).to.have.all.keys('estado', 'ddd', 'nome');

        /*		
        for (var i in module.response) {
        	expect( module.response[i] ).to.have.all.keys( 'estado', 'ddd', 'nome' );
        }
        */

        done();
    });
});