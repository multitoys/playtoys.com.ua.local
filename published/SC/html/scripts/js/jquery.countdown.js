(function($){var init=function(userOptions){var options={stepTime:60,format:"dd:hh:mm:ss",startTime:"01:12:32:55",digitImages:6,digitWidth:53,digitHeight:77,autoStart:true,timerEnd:function(){},image:"digits.png"};var digits=[],interval;var createDigits=function(where){var c=0;var hCounter=0;var mCounter=0;var sCounter=0;if((typeof options.startTime=='object')&&(options.startTime.constructor==Date)){var now=new Date();if(options.startTime.getTime()<now.getTime()){options.startTime.setFullYear(options.startTime.getFullYear()+1);}
var datediff=Math.ceil((options.startTime.getTime()-now.getTime())/1000);var days=Math.floor(datediff/86400);var hours=Math.floor((datediff%86400)/3600);var minutes=Math.floor(((datediff%86400)%3600)/60);var seconds=((datediff%86400)%3600)%60;options.startTime=days+":"+hours+":"+minutes+":"+seconds;}
_startTime=options.startTime.split("");cCounter=0;for(var i=0;i<_startTime.length;i++){if(isNaN(parseInt(_startTime[i]))){cCounter=cCounter+1;}}
var chunks=options.startTime.split(":");var newstartTime="";for(var i=0;i<chunks.length;i++){var max=59;if(chunks.length==3){if(i==0){max=23;}}
if(chunks.length==4){if(i==0){max=9999;}
if(i==1){max=23;}}
if(chunks[i]>max){chunks[i]=max;}
if(chunks[i].length<2){chunks[i]="0"+chunks[i];}}
options.startTime=chunks.join(":");switch(cCounter){case 3:if(options.startTime.split(":")[0].length==3){options.format="ddd:hh:mm:ss";}else{options.format="dd:hh:mm:ss";}
break;case 2:options.format="hh:mm:ss";break;case 1:options.format="mm:ss";break;case 0:options.format="ss";break;}
options.startTime=options.startTime.split("");options.format=options.format.split("");for(var i=0;i<options.startTime.length;i++){if(parseInt(options.startTime[i])>=0){var elem=jQuery('<div id="cnt_'+i+'" class="cntDigit" />').css({height:options.digitHeight*options.digitImages*10,"float":'left',background:'url(\''+options.image+'\')',width:options.digitWidth});digits.push(elem);margin(c,-((parseInt(options.startTime[i])*options.digitHeight*options.digitImages)));digits[c].__max=9;switch(options.format[i]){case'h':if(hCounter<1){digits[c].__max=2;hCounter=1;}else{digits[c].__condmax=3;}
break;case'd':digits[c].__max=9;break;case'm':if(mCounter<1){digits[c].__max=5;mCounter=1;}else{digits[c].__condmax=9;}
break;case's':if(sCounter<1){digits[c].__max=5;sCounter=1;}else{digits[c].__condmax=9;}
break;}
++c;}else{elem=jQuery('<div class="cntSeparator"/>').css({"float":'left'}).text(options.startTime[i]);}
where.append('<div>');where.append(elem);where.append('</div>');}};var margin=function(elem,val){if(val!==undefined)
return digits[elem].css({'marginTop':val+'px'});return parseInt(digits[elem].css('marginTop').replace('px',''));};var moveStep=function(elem){digits[elem]._digitInitial=-(digits[elem].__max*options.digitHeight*options.digitImages);return function _move(){mtop=margin(elem)+options.digitHeight;if(mtop==options.digitHeight){margin(elem,digits[elem]._digitInitial);if(elem>0)moveStep(elem-1)();else{clearInterval(interval);for(var i=0;i<digits.length;i++)margin(i,0);options.timerEnd();return;}
if((elem>0)&&(digits[elem].__condmax!==undefined)&&(digits[elem-1]._digitInitial==margin(elem-1)))
margin(elem,-(digits[elem].__condmax*options.digitHeight*options.digitImages));return;}
margin(elem,mtop);if(margin(elem)/options.digitHeight%options.digitImages!=0)
setTimeout(_move,options.stepTime);if(mtop==0)digits[elem].__isma=true;}};var start=function(){if(interval==undefined)
interval=setInterval(moveStep(digits.length-1),1000);}
var pause=function(){if(interval){window.clearInterval(interval);interval=undefined;}}
this.data("countdown",{"start":start,"pause":pause});$.extend(options,userOptions);this.css({height:options.digitHeight,overflow:'hidden'});createDigits(this);if(options.autoStart){start();}};$.fn.countdown=function(method){var methods=this.data("countdown");if(methods&&methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else if(typeof method==='object'||!method){return init.apply(this,arguments);}else{$.error('Method '+method+' does not exist on jQuery.countdown');}};})(jQuery);