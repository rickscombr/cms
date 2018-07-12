requirejs.config({
    urlArgs: function(id, url) {
        var args = hashGlobal;
      
        return (url.indexOf('?') === -1 ? '?' : '&') + args;
    }
});
