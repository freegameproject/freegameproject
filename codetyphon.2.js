/*
 * 文档操作核心库
 * www.dingdingwenan.com
 * 新浪微博 @丁丁文案
 * */
function _(query){
    return new __(query);
}
var __=function(query){
    this.es=document.querySelectorAll(query);
    return this;
}
__.prototype={
    _get:function(k){
        return this.es[0].getAttribute(k);
    },
    _return:function(k){
        return this.es[0][k];
    },
    _set: function (fn) {
        for(i=0;i<this.es.length;i++){
            var e=this.es[i];
            fn(e);
        }
        return this;
    },
    show:function(){
        this._set(function(e){
            /*
             if(e.getAttribute("old-display").length>0){
             e.style.display= e.getAttribute("old-display");
             }else{
             }*/
            e.style.display="block";
        });
        return this;
    },
    hide:function(){
        this._set(function(e){
            /*e.setAttribute("old-display", e.style.display);*/
            e.style.display="none";
        });
        return this;
    }
    ,
    attr:function(k,v){
        if(v===undefined){

            this._get(k);
        }else{
            this._set(function(e){
                e.setAttribute(k,v);
            });
        }
        return this;
    },
    className:function(v){
        if(v===undefined){
            return this._return("className");
        }else{
            this.attr('class',v);
        }
        return this;
    },
    html:function(v){
        if(v===undefined){
            return this._return("innerHTML");
        }else{
            this._set(function(e){
                e.innerHTML=v;
            });
        }
        return this;
    },
    click:function(fn){
        this._set(function(e){
            var eventFn="touchstart";
            if(/iphone|nokia|sony|ericsson|mot|samsung|sgh|lg|philips|panasonic|alcatel|lenovo|cldc|midp|wap|android|iPod/i.test(navigator.userAgent.toLowerCase())){

            }else{
                eventFn="click";
            }

            e.addEventListener(eventFn,function(){
                event.preventDefault();
                fn(e);
            });
        });
    },
    aniend:function(fn){
        this._set(function(e){
            e.addEventListener('webkitAnimationEnd',function(){
                //event.preventDefault();
                fn();
            });
        });
    },
    val:function(v){
        if(v===undefined){
            return this._return('value');
        }else{
            this._set(function(e){
                e.value=v;
            });
        }
    }
}

_.setJsValue=function(value){
    _.jsValue=value;
}
_.getjs=function(url,arr,cb,error){
    _.jsValue='nojsvaluexxx';

    var js_url="?";

    for (var name in arr) {
        if (arr.hasOwnProperty(name)) {
            js_url+="&";
            js_url+=name;
            js_url+="=";
            js_url+=arr[name];
            console.log(arr[name])
        }
    }
    js_url=url+js_url+"&cb=_.setJsValue";
    //console.log(js_url);

    var importScript = (function (oHead) {

        function loadError (oError) {
            error();
            throw new URIError("The script " + oError.target.src + " is not accessible.");
        }

        return function (sSrc, fOnload) {

            var oScript = document.createElement("script");
            oScript.type = "text\/javascript";

            oScript.onerror = loadError;
            if (fOnload) { oScript.onload = function(){
                fOnload(_.jsValue);
                oHead.removeChild(oScript);
            }; }
            oHead.appendChild(oScript);
            oScript.src = sSrc;
        }
    })(document.head || document.getElementsByTagName("head")[0]);
    importScript(js_url,cb);
    /*
     _.getjs('http://www.heimasheying.com/user_count.php',{},function(x){alert(x)},function(){alert('err')})
     */
}
