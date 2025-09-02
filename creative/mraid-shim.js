(function(){
  if(window.mraid) return;
  var listeners={};
  window.__mraidShim={
    getState:function(){return 'default'},
    isViewable:function(){return true},
    addEventListener:function(type,fn){(listeners[type]=listeners[type]||[]).push(fn)},
    removeEventListener:function(type,fn){var a=listeners[type]||[];var i=a.indexOf(fn);if(i>-1)a.splice(i,1)},
    setOrientationProperties:function(){},
    open:function(url){window.open(url,'_blank')}
  };
})();


