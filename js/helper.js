var helper =
{
    parseJSON: function( data )
    {
        var res = null;
        if ( window.JSON && window.JSON.parse )
        {
            try
            {
                res = window.JSON.parse( data );
            }
            catch(e)
            {
                res = null;
            }
        }
        if ( typeof data === "string" )
        {
            try
            {
                res = eval("("+data+")");
            }
            catch(e)
            {
                res=null;
            }
        }
        return res;
    },
    addEvent: function(html_element, event_name, event_function)
    {
        html_element = typeof html_element == "string" ? document.getElementById(html_element) : html_element;
        if(html_element.attachEvent)
        {
            //Internet Explorer
            html_element.attachEvent("on" + event_name, function() {event_function.call(html_element);});
        }
        else if(html_element.addEventListener)
        {
            //Firefox & company
            html_element.addEventListener(event_name, event_function, false);
            //don't need the 'call' trick because in FF everything already works in the right way
        }
    },
    proxy: function( fn, context )
    {
        var args, proxy, tmp;
        if ( typeof context === "string" )
        {
            tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }
        if ( typeof fn != "function" )
        {
            return undefined;
        }
        // Simulated bind
        args = Array.prototype.slice.call(arguments,2);
        proxy = function()
        {
            return fn.apply( context || this, args.concat( Array.prototype.slice.call(arguments) ) );
        };
        return proxy;
    },
    getProperty: function(obj,propertyName,defaultValue)
    {
        if( (typeof(obj)).toLowerCase() == "object" && obj != null && propertyName in obj)
        {
            return obj[propertyName];
        }
        return defaultValue;
    },
    clone: function (obj)
    {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
}