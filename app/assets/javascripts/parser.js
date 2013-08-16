function prsr ()
{
    return {
    // Keywords to parse
        keywordsNavigator: Config.keywordsNavigator,
        getClasses: function(keywordNavigator){
            var content =  Config.contents;
            var rule =   this._setRegExp(keywordNavigator);
            var classes = content.match(rule.regexp);
            if(classes == null){
                return [];
            }

            var result = [];
            for(var n = 0; n < classes.length; n++){
                var item = classes[n].replace(rule.regexp, rule.group)
                var write = true;
                for(key in result)
                {
                    if(result[key] == item)
                    {
                        write = false;
                    }
                }
                if(write)
                {
                    result.push(item);
                }
            }
            return result;
        },
        getAllObjects: function(){
            var objects = [];
            for(var n = 0; n < this.keywordsNavigator.length; n++){
               var keywordNavigator = this.keywordsNavigator[n];
               objects[keywordNavigator] = this.getClasses(keywordNavigator);
               Render.navigator(objects, keywordNavigator);
            }
            return objects;
        },
        _setRegExp: function(keyword){
            var rule =
            {
                regexp: '',
                group:  ''
            };
            for(key in Config.entities)
            {
                if(keyword == Config.entities[key].name)
                {
                    rule.regexp =  Config.entities[key].parser.regExp;
                    rule.group  =  Config.entities[key].parser.callback;
                }
            }
            return rule;
        },
        matchBraces: function(html){
             var left_brace_qty = html.match(/{/g).length;
             var right_brace_qty = html.match(/}/g).length;

             if(left_brace_qty != right_brace_qty){
                 alert('Parse error - check braces');
             }
        },
        toMin: function(content)
        {
            content = content.replace(
                /(\/\/[^\n]*\n)/g,
                function(m, f1)
                {
                    return '/*'+f1+'*/';
                }
            )
            content = content.replace(
                /(\n|\t|[\s]{2})/g,
                function(m, f1)
                {
                    return '';
                }
            )
            return content;
        },
        toMax: function(content)
        {
            content = content.replace(
                /(;|(\*\/(?!\/))|\{|\})|(case([^\:]*):)/g,
                function(m, f1, f2, f3, f4)
                {
                    if(f3 !== undefined)
                    {
                        return f3+'<br/>'+'\n';
                    }
                    return f1+'<br/>'+'\n';
                }
            )
            content = content.replace(
                /(for\s*\([^\)\(]*\))/g,
                function(m, f1)
                {
                    return f1.replace(/\n/g,'');
                }
            )
            content = content.replace(
                /(\/\*(\/\/[^\n]*\n)\*\/)/g,
                function(m, f1, f2)
                {
                    return f2;
                }
            )
            var contentA = content.split('\n');
            var level = 0;
            for(key in contentA)
            {
                var countEnd = contentA[key].match(/(\})/g);
                if(countEnd!==null)
                {
                    level = parseInt(level) - parseInt(countEnd.length);
                }

                for(var i=0;level>i;i++)
                {
                    contentA[key] = '&nbsp;&nbsp;&nbsp;&nbsp;' + contentA[key];
                }

                var countBegin = contentA[key].match(/(\{)/g);
                if(countBegin!==null)
                {
                    level = parseInt(level) + parseInt(countBegin.length);
                }
            }
            content = contentA.join('\n');
            return content;
        }
    };
}