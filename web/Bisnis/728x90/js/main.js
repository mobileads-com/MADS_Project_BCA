/*
*
* mads - version 2.00.01  
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var mads = function () {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }
    
    /* Unique ID on each initialise */
    this.id = this.uniqId();
    
    /* Tracked tracker */
    this.tracked = [];
    
    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];
    
    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];
    
    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');
    
    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';
};

/* Generate unique ID */
mads.prototype.uniqId = function () {
    
    return new Date().getTime();
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

	if(typeof url != "undefined" && url !=""){
		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		}else{
			window.open(url);
		}
	}
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {
    
    /* 
    * name is used to make sure that particular tracker is tracked for only once 
    * there might have the same type in different location, so it will need the name to differentiate them
    */
    name = name || type; 
    
    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');
            
            if (typeof value == 'undefined') {
                value = '';
            }
            
            /* Insert Macro */
            var src = this.custTracker[i].replace('{{type}}', type);
            src = src.replace('{{tt}}', tt);
            src = src.replace('{{value}}', value);
            /* */
            img.src = src + '&' + this.id;
            
            img.style.display = 'none';
            this.bodyTag.appendChild(img);
            
            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;
    
    if (typeof callback != 'undefined') {
        script.onload = callback;
    }
    
    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');
    
    this.headTag.appendChild(link);
}

/*
*
* Unit Testing for mads 
*
*/
var testunit = function () {
    var app = new mads();
    
    console.log(typeof app.bodyTag != 'undefined');
    console.log(typeof app.headTag != 'undefined');
    console.log(typeof app.custTracker != 'undefined');
    console.log(typeof app.path != 'undefined');
    console.log(typeof app.contentTag != 'undefined');
    
    app.loadJs('https://code.jquery.com/jquery-1.11.3.min.js',function () {
        console.log(typeof window.jQuery != 'undefined');
    });
    
    app.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css');
    
    app.contentTag.innerHTML = 
        '<div class="container"><div class="jumbotron"> \
            <h1>Hello, world!</h1> \
            <p>...</p> \
            <p><a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a></p> \
        </div></div>';
    
    app.custTracker = ['http://www.tracker.com?type={{type}}&tt={{tt}}','http://www.tracker2.com?type={{type}}'];
    
    app.tracker('CTR', 'test');
    app.tracker('E','test','name');
    
    app.linkOpener('http://www.google.com');
}

var bisnis = function () {

    this.app = new mads();
    
    this.app.loadCss(this.app.path + 'css/style.css');
    this.app.loadJs('https://code.jquery.com/jquery-1.11.3.min.js', this.curry(this.render, this));
}

bisnis.prototype.curry = function(fn, scope /*, arguments */) {
    scope = scope || window;
    var actualArgs = arguments;

    return function() {
        var args = [];
        for(var j = 0; j < arguments.length; j++) {
            args.push(arguments[j]);
        }

        for(var i = 2; i < actualArgs.length; i++) {
            args.push(actualArgs[i]);
        }

        return fn.apply(scope, args);
    };
};

bisnis.prototype.render = function () {
    
    var _this = this;
    
    this.app.contentTag.innerHTML = '<div id="bisnis"><img src="'+this.app.path+'img/ERateBisnis728x90.png"/><div id="bisnis-usd-rate">13625.00</div></div>';
    
    $.get('https://api.mobileads.com/scrapper/bca/index.php', function (node) {
        console.log(node)
        document.getElementById('bisnis-usd-rate').innerHTML = node;
    })
    
    document.getElementById('bisnis').addEventListener('click', function () {
        _this.app.tracker('CTR', 'site');
        _this.app.linkOpener('http://bca.co.id/id/kurs-sukubunga/kurs_counter_bca/kurs_counter_bca_landing.jsp');
    });
}

new bisnis();