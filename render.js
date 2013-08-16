var Render = 
{   error_area: '',
    // String numeration
    addLineNumbers: function (html){
        var line_num            = html.match(/<br\/>/g).length;
        var num_area            = document.getElementById('line_numbers');
        var comment_area        = document.getElementById('line_comment');
        var line_html           = '';
        var commentLineHTML     = '';
        for(var i = 1; i <= line_num; i++){
            line_html += '<span class="line_num">' + i + '</span></br>';
            commentLineHTML += '<span class="line_comment" data-num="'+i+'" onclick="Comment.edit({id:\''+i+'\'});"></span></br>';

        }
        num_area.innerHTML      = line_html;
        comment_area.innerHTML  = commentLineHTML;
    },
    // Navigation area
    navigator: function(objects, keyword){ 
        this.error_area = document.getElementById("error_area");
        var items = '';
        for(var i = 0; i < objects[keyword].length ;i++){
            items += tmpl.navigator.item({
                type: keyword,
                name: objects[keyword][i]
            });
        }
        var html = tmpl.navigator.group({
            type:  keyword,
            items: items
        });

        this.error_area.innerHTML +=  html;
        var object = document.getElementById('nav_'+ keyword);
//        if(keyword != 'class'){
//            this.moveObjects(object);
//        }
    },
    clearNavigator: function(){
        this.error_area = document.getElementById("error_area");
        this.error_area.innerHTML = '';
    },
    toggle: function(keyword){
        if(keyword == 'class' ){
            return false;
        }
        var element = document.getElementById('nav_'+ keyword);
        for(var n = 0; n < element.children.length; n++ ){
            toggle(element.children[n]);              
        }           
    },
    moveObjects: function(object){
        var class_li = document.getElementById('nav_class');
        object.parentNode.removeChild(object);
        class_li.innerHTML += object.outerHTML;

    },
    backlight: function(target, keywordsNavigator)
    {
        var content = document.getElementById("output_area").innerHTML;
        content = content.replace(
            tmpl.backlight.forClear.rgExp(),
            tmpl.backlight.forClear.replaceText()
        );
        content = content.replace(
            Config.backlight.rgExp['i'+keywordsNavigator](target),
            Config.backlight.replaceText['i'+keywordsNavigator](target)
        );
        document.getElementById("output_area").innerHTML = content;
        var backlights = document.getElementsByClassName('backlight');
        if(backlights.length > 0)
        {
            var backlight = backlights[0];
            document.getElementById("left_aside").scrollTop = backlight.offsetTop;
        }
    },
    backlightTree: function(id)
    {
        var elementsWithBacklight = document.getElementsByClassName('backlight');
        if(elementsWithBacklight.length > 0)
        {
            for(keyElement in elementsWithBacklight)
            {
                if(typeof elementsWithBacklight[keyElement] == 'object')
                {
                    elementsWithBacklight[keyElement].setAttribute("class", "name");
                }
            }
        }
        var element = document.getElementById('name_'+id)
        element.setAttribute("class", "name backlight");
        var backlights = document.getElementsByClassName('backlight');
        if(backlights.length > 0)
        {
            var backlight = backlights[0];
            document.getElementById("left_aside").scrollTop = backlight.offsetTop;
        }
    },
    uploadListConfig: function()
    {
        var result = '';
        for(key in cnfg)
        {
            result += tmpl.html.option({
                value:      key,
                selected:   Config.name===key ? true : false
            });
        }
        MyStorage.set('selectedLang',Config.name);
        document.getElementById("select-rule").innerHTML = result;
    },
    navigatorTreeR: function(tree)
    {
        var result = '';
        for(type in tree)
        {
            var items = '';
            var cType = type;
            for(key in tree[cType])
            {
                if(typeof tree[cType][key] != 'undefined')
                {
                    var typeBaby = tree[cType][key].type;
                    var id = tree[cType][key].id;
                    var name = tree[cType][key].name;
                    var argument = false;
                    if(typeof tree[cType][key].argument)
                    {
                        argument = tree[cType][key].argument;
                    }
                    var child = '';
                    for(keyBaby in tree[cType][key].baby)
                    {
                        if(typeof tree[cType][key].baby[keyBaby] == 'object')
                        {
                            var childTree = helper.clone(tree[cType][key].baby[keyBaby]);
                            child +=Render.navigatorTreeR(childTree);
                        }
                    }
                    items += tmpl.navigatorTree.item({
                        type: typeBaby,
                        id: id,
                        name: name,
                        child: child,
                        argument: argument
                    });
                }
            }
            result += tmpl.navigator.group({
                type:   cType,
                items:  items
            });
        }
        return result;
    },
    navigatorTree: function(tree)
    {
        var result = Render.navigatorTreeR(tree);
        document.getElementById("error_area").innerHTML = result;
    }
};
var tmpl =
{
    html:
    {
        option: function(data)
        {
            var value       = helper.getProperty(data, 'value', '');
            var content     = helper.getProperty(data, 'content', value);
            var selected    = helper.getProperty(data, 'selected', false);
            if(selected)
            {
                selected = 'selected';
            }
            return '<option value="'+value+'"'+selected+'>'+content+'</option>';
        }
    },
    navigator:
    {
        item: function(data)
        {
            var argument = '';
            if(data.argument)
            {
                argument = '('+data.argument+')';
            }

            var result = '<li class="nav_objects_' + data.type + '" onclick="Render.backlight(\''+ data.name + '\',\'' + data.type + '\')">' + data.name + argument + '</li>';
            return result;
        },
        group: function(data)
        {
            return '<ul id="nav_' + data.type + '" >'+ data.type + ':' + data.items + '</ul>';
        }
    },
    navigatorTree:
    {
        item: function(data)
        {
            var argument = '';
            if(data.argument)
            {
                argument = ' ('+data.argument+')';
            }
            var result = '<li class="nav_objects_' + data.type + '">';
            result += '<span onclick="Render.backlightTree(\'' + data.id + '\')">';
            result += data.name + argument;
            result += '</span>';
            result += data.child;
            result += '</li>';
            return  result;
        },
        group: function(data)
        {
//            return '<ul id="nav_' + data.type + '" onclick="Render.toggle(\''+ data.type + '\')">'+ data.type + ':' + data.items + '</ul>';
            return '<ul id="nav_' + data.type + '" >'+ data.type + ':' + data.items + '</ul>';
        }
    },
    backlight:
    {
        forInsert: function(target)
        {
            return '<span class="backlight">'+target+'</span>';
        },
        forClear:
        {
            rgExp: function()
            {
                return new RegExp('(\<span class=\"backlight\"\>)([A-Za-z0-9\s_\$]+)(\<\/span\>)', 'g')
            },
            replaceText: function()
            {
                return '$2';
            }
        }
    }
}

