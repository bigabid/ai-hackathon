(function(){
  'use strict';

  var featureFlags={
    analytics:false
  };

  var state={
    cards:[],
    currentIndex:0,
    isReady:false
  };

  function getMraid(){
    if(typeof window.mraid!=='undefined') return window.mraid;
    return window.__mraidShim;
  }

  function onReady(){
    state.isReady=true;
    try{
      var m=getMraid();
      if(m && m.setOrientationProperties){
        m.setOrientationProperties({allowOrientationChange:false,forceOrientation:'portrait'});
      }
    }catch(e){}
    loadManifest().then(function(manifest){
      state.cards=manifest.cards||[];
      render(manifest);
    }).catch(function(){
      console.warn('manifest load failed');
    });
  }

  function loadManifest(){
    return fetch('manifest.json').then(function(r){return r.json()});
  }

  function $(sel){return document.querySelector(sel)}

  function render(manifest){
    var root=$('#root');
    var stack=$('.card-stack');
    var cta=$('.cta');
    var progress=$('.progress');

    // Theme
    if(manifest.theme){
      if(manifest.theme.primaryColor) document.documentElement.style.setProperty('--primary-color',manifest.theme.primaryColor);
      if(manifest.theme.ctaTextColor) document.documentElement.style.setProperty('--cta-text',manifest.theme.ctaTextColor);
      if(manifest.theme.backgroundColor) document.documentElement.style.setProperty('--background',manifest.theme.backgroundColor);
    }

    // Progress dots
    progress.innerHTML='';
    for(var i=0;i<state.cards.length;i++){
      var d=document.createElement('div');
      d.className='dot'+(i===0?' dot--active':'');
      progress.appendChild(d);
    }

    // Cards
    stack.innerHTML='';
    state.cards.forEach(function(card,idx){
      var el=document.createElement('article');
      el.className='card';
      el.style.zIndex=String(1000-idx);

      el.innerHTML='<img class="card__image" alt="" src="'+escapeHtml(card.image)+'" />\n'
        +'<div class="card__overlay">\n'
        +'<h2 class="headline">'+escapeHtml(card.headline||'')+'</h2>\n'
        +'<p class="subcopy">'+escapeHtml(card.subcopy||'')+'</p>\n'
        +'</div>';

      attachGestures(el, idx, card);
      stack.appendChild(el);
    });

    // CTA behavior aligns with top card
    updateCta(cta);
    cta.addEventListener('click', function(){ positiveIntent(); });
  }

  function positiveIntent(){
    var card=state.cards[state.currentIndex];
    if(!card) return;
    var m=getMraid();
    if(m && m.open){ m.open(card.clickthroughUrl); }
    else{ window.open(card.clickthroughUrl,'_blank'); }
    advance();
  }

  function advance(){
    var prevIndex=state.currentIndex;
    state.currentIndex++;
    var cards=document.querySelectorAll('.card');
    if(cards[prevIndex]){
      cards[prevIndex].style.transition='transform 220ms ease, opacity 220ms ease';
      cards[prevIndex].style.transform='translateX(120vw) rotate(10deg)';
      cards[prevIndex].style.opacity='0';
      setTimeout(function(){ if(cards[prevIndex] && cards[prevIndex].parentNode){cards[prevIndex].parentNode.removeChild(cards[prevIndex]);} }, 260);
    }

    var dots=document.querySelectorAll('.dot');
    dots.forEach(function(dot,i){ dot.classList.toggle('dot--active', i===state.currentIndex); });

    if(state.currentIndex>=state.cards.length){
      showEndCard();
    }else{
      updateCta($('.cta'));
    }
  }

  function updateCta(cta){
    var card=state.cards[state.currentIndex];
    cta.textContent=card && card.ctaText? card.ctaText : 'Learn more';
  }

  function showEndCard(){
    var stack=document.querySelector('.card-stack');
    stack.innerHTML='';
    var end=document.createElement('article');
    end.className='card';
    end.innerHTML='<div class="card__overlay">\n'
      +'<h2 class="headline">Thanks for exploring</h2>\n'
      +'<p class="subcopy">Tap to learn more</p>\n'
      +'</div>';
    stack.appendChild(end);
  }

  function attachGestures(el, idx, card){
    var startX=0, startY=0, dx=0, dy=0, active=false;
    var threshold=60, velocityExit=0.5;
    var lastT=0, lastX=0, vx=0;

    function onDown(x, y, timeStamp){
      active=true; startX=x; startY=y; dx=0; dy=0; lastT=timeStamp||0; lastX=x;
    }
    function onMove(x, y, timeStamp, prevent){
      if(!active) return;
      dx=x-startX; dy=y-startY;
      var dt=(timeStamp||0)-lastT; if(dt>0){ vx=(x-lastX)/dt; lastT=timeStamp||0; lastX=x; }
      var rot=dx/25;
      if(prevent) try{ prevent(); }catch(_){}
      el.style.transform='translate('+dx+'px,'+dy+'px) rotate('+rot+'deg)';
    }
    function onUp(){
      if(!active) return; active=false;
      if(dx>threshold || vx>velocityExit){
        positiveIntent();
      }else if(dx<-threshold || vx<-velocityExit){
        advance();
      }else{
        el.style.transition='transform 180ms ease';
        el.style.transform='translate(0,0) rotate(0)';
        setTimeout(function(){ el.style.transition=''; }, 200);
      }
    }

    // Pointer Events
    if(window.PointerEvent){
      el.addEventListener('pointerdown', function(e){
        onDown(e.clientX, e.clientY, e.timeStamp);
        try{ el.setPointerCapture(e.pointerId); }catch(_){ }
      }, {passive:true});
      el.addEventListener('pointermove', function(e){
        onMove(e.clientX, e.clientY, e.timeStamp);
      }, {passive:true});
      el.addEventListener('pointerup', function(){ onUp(); }, {passive:true});
      el.addEventListener('pointercancel', function(){ active=false; }, {passive:true});
      return;
    }

    // Touch Events fallback
    el.addEventListener('touchstart', function(e){
      var t=e.touches[0]; if(!t) return; onDown(t.clientX, t.clientY, e.timeStamp);
    }, {passive:true});
    el.addEventListener('touchmove', function(e){
      var t=e.touches[0]; if(!t) return; onMove(t.clientX, t.clientY, e.timeStamp, function(){ e.preventDefault(); });
    }, {passive:false});
    el.addEventListener('touchend', function(){ onUp(); }, {passive:true});
    el.addEventListener('touchcancel', function(){ active=false; }, {passive:true});

    // Mouse fallback
    el.addEventListener('mousedown', function(e){ onDown(e.clientX, e.clientY, e.timeStamp); }, {passive:true});
    window.addEventListener('mousemove', function(e){ onMove(e.clientX, e.clientY, e.timeStamp); }, {passive:true});
    window.addEventListener('mouseup', function(){ onUp(); }, {passive:true});
  }

  function escapeHtml(str){
    return String(str||'').replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c])});
  }

  function boot(){
    var m=getMraid();
    if(m && m.getState){
      if(m.getState()==='loading') m.addEventListener('ready', onReady); else onReady();
    }else{
      onReady();
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', boot);
  }else{
    boot();
  }
})();


