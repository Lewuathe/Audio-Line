(function(){"use strict";function e(){this.impl=null,this.isPlaying=!1,this.samplerate=44100,this.channels=2,this.cellsize=128,this.streammsec=20,this.streamsize=0,this.generator=null}var t=null,i=function(){return"undefined"!=typeof window?window.webkitAudioContext||window.AudioContext:void 0}();t=i!==void 0?function(e){var t,a,n=new i;this.maxSamplerate=n.sampleRate,this.defaultSamplerate=n.sampleRate,this.env="webkit";var s=navigator.userAgent;s.match(/linux/i)?e.streammsec*=8:s.match(/win(dows)?\s*(nt 5\.1|xp)/i)&&(e.streammsec*=4),this.play=function(){var i,s,r,o=e.getAdjustSamples(n.sampleRate),l=e.streamsize;e.samplerate===n.sampleRate?i=function(t){var i=t.outputBuffer;e.process(),i.getChannelData(0).set(e.strmL),i.getChannelData(1).set(e.strmR)}:2*e.samplerate===n.sampleRate?i=function(t){var i,a,n=e.strmL,s=e.strmR,r=t.outputBuffer,o=r.getChannelData(0),l=r.getChannelData(1),c=r.length;for(e.process(),i=a=0;c>i;i+=2,++a)o[i]=o[i+1]=n[a],l[i]=l[i+1]=s[a]}:(s=l,r=e.samplerate/n.sampleRate,i=function(t){var i,a=e.strmL,n=e.strmR,o=t.outputBuffer,c=o.getChannelData(0),p=o.getChannelData(1),u=o.length;for(i=0;u>i;++i)s>=l&&(e.process(),s-=l),c[i]=a[0|s],p[i]=n[0|s],s+=r}),t=n.createBufferSource(),a=n.createJavaScriptNode(o,2,e.channels),a.onaudioprocess=i,t.noteOn(0),t.connect(a),a.connect(n.destination)},this.pause=function(){t.disconnect(),a.disconnect()}}:"function"==typeof Audio&&"function"==typeof(new Audio).mozSetup?function(e){var t=function(){var e="var t=0;onmessage=function(e){if(t)t=clearInterval(t),0;if(typeof e.data=='number'&&e.data>0)t=setInterval(function(){postMessage(0);},e.data);};",t=new Blob([e],{type:"text/javascript"}),i=window.URL.createObjectURL(t);return new Worker(i)}();this.maxSamplerate=48e3,this.defaultSamplerate=44100,this.env="moz",this.play=function(){var i=new Audio,a=new Float32Array(e.streamsize*e.channels),n=e.streammsec,s=0,r=1e3*(e.streamsize/e.samplerate),o=Date.now(),l=function(){if(!(s>Date.now()-o)){var t=e.strmL,n=e.strmR,l=a.length,c=t.length;for(e.process();c--;)a[--l]=n[c],a[--l]=t[c];i.mozWriteAudio(a),s+=r}};i.mozSetup(e.channels,e.samplerate),t.onmessage=l,t.postMessage(n)},this.pause=function(){t.postMessage(0)}}:function(){this.maxSamplerate=48e3,this.defaultSamplerate=44100,this.env="nop",this.play=function(){},this.pause=function(){}};var a=[8e3,11025,12e3,16e3,22050,24e3,32e3,44100,48e3],n=[32,64,128,256];e.prototype.bind=function(e,t){if("function"==typeof e){var i=new e(this,t);"function"==typeof i.play&&"function"==typeof i.pause&&(this.impl=i,this.impl.defaultSamplerate&&(this.samplerate=this.impl.defaultSamplerate))}return this},e.prototype.setup=function(e){if("object"==typeof e)-1!==a.indexOf(e.samplerate)&&(this.samplerate=e.samplerate<=this.impl.maxSamplerate?e.samplerate:this.impl.maxSamplerate),-1!==n.indexOf(e.cellsize)&&(this.cellsize=e.cellsize);else if("string"==typeof e)switch(e){case"mobile":this.samplerate=22050,this.cellsize=128;break;case"high-res":this.cellsize=32;break;case"low-res":this.cellsize=256}return this},e.prototype.getAdjustSamples=function(e){var t,i;return e=e||this.samplerate,t=this.streammsec/1e3*e,i=Math.ceil(Math.log(t)*Math.LOG2E),i=8>i?8:i>14?14:i,1<<i},e.prototype.play=function(e){return this.isPlaying||"object"!=typeof e?this:(this.isPlaying=!0,this.generator=e,this.streamsize=this.getAdjustSamples(),this.strmL=new Float32Array(this.streamsize),this.strmR=new Float32Array(this.streamsize),this.cellL=new Float32Array(this.cellsize),this.cellR=new Float32Array(this.cellsize),this.impl.play(),this)},e.prototype.pause=function(){return this.isPlaying&&(this.isPlaying=!1,this.impl.pause()),this},e.prototype.process=function(){for(var e,t,i=this.cellL,a=this.cellR,n=this.strmL,s=this.strmR,r=this.generator,o=i.length,l=0,c=this.streamsize/this.cellsize;c--;)for(r.process(i,a),e=0;o>e;++e,++l)t=i[e],n[l]=-1>t?-1:t>1?1:t,t=a[e],s[l]=-1>t?-1:t>1?1:t};var s=(new e).bind(t),r={setup:function(e){return s.setup(e),this},bind:function(e,t){return s.bind(e,t),this},play:function(e){return s.play(e),this},pause:function(){return s.pause(),this}};Object.defineProperties(r,{env:{get:function(){return s.impl.env}},samplerate:{get:function(){return s.samplerate}},channels:{get:function(){return s.channels}},cellsize:{get:function(){return s.cellsize}},isPlaying:{get:function(){return s.isPlaying}}}),"undefined"!=typeof module&&module.exports?module.exports=global.pico=r:"undefined"!=typeof window&&(window.Float32Array===void 0&&(window.Float32Array=function(e){var t;if(Array.isArray(e))t=e.slice();else if("number"==typeof e){t=Array(e);for(var i=0;e>i;++i)t[i]=0}else t=[];return t.set=function(e,t){t===void 0&&(t=0);var i,a=Math.min(this.length-t,e.length);for(i=0;a>i;++i)this[t+i]=e[i]},t.subarray=function(e,t){return t===void 0&&(t=this.length),this.slice(e,t)},t}),r.noConflict=function(){var e=window.pico;return function(){return window.pico===r&&(window.pico=e),r}}(),window.pico=r),function(){function e(e){try{return t.plugins&&t.mimeTypes&&t.mimeTypes.length?t.plugins["Shockwave Flash"].description.match(/([0-9]+)/)[e]:new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version").match(/([0-9]+)/)[e]}catch(i){return-1}}if("undefined"!=typeof window&&"nop"===window.pico.env){var t=navigator;if(!(10>e(0))){var i,a="PicoFlashPlayerDiv",n=function(){var e=document.getElementsByTagName("script");if(e&&e.length)for(var t,i=0,a=e.length;a>i;++i)if(t=/^(.*\/)pico(?:\.dev)?\.js$/i.exec(e[i].src))return t[1]+"pico.swf"}();window.picojs_flashfallback_init=function(){function e(e){var t=0;this.maxSamplerate=44100,this.defaultSamplerate=44100,this.env="flash",this.play=function(){var a,s=Array(e.streamsize*e.channels),r=e.streammsec,o=0,l=1e3*(e.streamsize/e.samplerate),c=Date.now();a=function(){if(!(o>Date.now()-c)){var t=e.strmL,a=e.strmR,n=s.length,r=t.length;for(e.process();r--;)s[--n]=0|32768*a[r],s[--n]=0|32768*t[r];i.writeAudio(s.join(" ")),o+=l}},i.setup?(i.setup(e.channels,e.samplerate),t=setInterval(a,r)):console.warn("Cannot find "+n)},this.pause=function(){0!==t&&(i.cancel(),clearInterval(t),t=0)}}s.bind(e),delete window.picojs_flashfallback_init};var r,o,l=n,c=l+"?"+ +new Date,p="PicoFlashPlayer",u=document.createElement("div");u.id=a,u.style.display="inline",u.width=u.height=1,t.plugins&&t.mimeTypes&&t.mimeTypes.length?(r=document.createElement("object"),r.id=p,r.classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",r.width=r.height=1,r.setAttribute("data",c),r.setAttribute("type","application/x-shockwave-flash"),o=document.createElement("param"),o.setAttribute("name","allowScriptAccess"),o.setAttribute("value","always"),r.appendChild(o),u.appendChild(r)):u.innerHTML='<object id="'+p+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1" height="1"><param name="movie" value="'+c+'" /><param name="bgcolor" value="#FFFFFF" /><param name="quality" value="high" /><param name="allowScriptAccess" value="always" /></object>',window.addEventListener("load",function(){document.body.appendChild(u),i=document[p]})}}}()})();
//@ sourceMappingURL=pico.js.map