function Coder()
{
    var th = this;
    th.source = '';
    th.baby = [];
    th.bloker = new Blocker();
    th.currentParent = 'root';

    th.addBaby = function(data)
    {
        if(typeof data.name !== 'undefined' && typeof data.parent !== 'undefined')
        {
            var baby;
            var key;
            for(key in th.baby)
            {
                baby = th.baby[key];
                if(baby.name == data.name && baby.parent == data.parent)
                {
                    return baby;
                }
            }
            th.baby.push(data);
            return true;
        }
        return false;
    }
    th.getPackCode = function(code)
    {
        if(code == undefined)
        {
            code = th.source;
        }
        code = th.bloker.removeComments(code);
        code = th.bloker.removeStrings(code);
        code = th.bloker.removeRegexp(code);

//        code = Parser.toMin(code);
//        code = Parser.toMax(code);


        code = th.bloker.bracesing(code);
        return code;
    }
    th.toParse = function(packCode, parent)
    {
        if(parent == undefined)
        {
            parent = "root";
        }
        th.currentParent = parent;
        var parsCode = packCode;
        for(key in Config.entities)
        {
            parsCode = parsCode.replace(
                Config.entities[key].coder.regExp,
                Config.entities[key].coder.callback
            );
        }
        parsCode = th.bloker.rebracesing(parsCode, th.toParse, parent);
        return parsCode;
    }
    th.getRepackCode = function(parsCode)
    {
        var code = parsCode;
        var packCode = '';
//        code = th.bloker.rebracesing(code, th.toParse);
        code = th.bloker.insertComment(code);
        code = th.bloker.insertRegexp(code);
        code = th.bloker.insertStrings(code);
        return code;
    }
    th.getNavigatorTree = function(parent)
    {
        var result = {};
        if(parent == undefined)
        {
            parent = 'root';
        }

        for(key in th.baby)
        {
            if(th.baby[key].parent == parent)
            {
                var item = th.baby[key];
                var type = th.baby[key].type
                item.baby = [];
                var baby = th.getNavigatorTree(th.baby[key].id)
                item.baby.push(baby);
                if(typeof result[type] == 'undefined')
                {
                    result[type] = [];
                }
                result[type].push(item);
            }
        }
        return result;
    }

}
function Blocker()
{
    var th      = this;
    th.braces   = [];
    th.comments = [];
    th.res      = [];
    th.strings  = [];
    th.safe     = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };

    th.safeHTML = function(code)
    {
        return code.replace(
            /[<>&]/g,
            function (m)
            {
                return th.safe[m];
            }
        );
    }
    th.removeStrings = function(code)
    {
        return code
            .replace(
                /([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*"))/g,
                function(m, f, s)
                    {
                        var l = th.strings.length;
                        th.strings.push(th.safeHTML(s));
                        return f+'~~~S'+l+'~~~';
                    }
            );
    }
    th.insertStrings = function(code)
    {
        return code.replace(
            /(~~~S([0-9]+)~~~)/g,
            function(m, f1, f2)
            {
                var string = th.strings[f2].replace(
                    /(<br \/>)|(<br\/>)/g,
                    ''
                );
                return '<span class="S">'+string+'</span>';
            }
        );
    }
    th.removeRegexp = function(code)
    {
        return code
            .replace(
                /\/(\\\/|[^\/\n])*\/[gim]{0,3}/g,
                function(m)
                {
                    var l = th.res.length;
                    th.res.push(m);
                    return '~~~R'+l+'~~~';
                }
        );
    }
    th.insertRegexp = function(code)
    {
        return code.replace(
            /(~~~R([0-9]+)~~~)/g,
            function(m, f1, f2)
            {
                return '<span class="R">'+th.res[f2]+'</span>';
            }
        );
    }
    th.removeComments = function(code)
    {
        return code
            .replace(
                /((\/\*[\s\S]*?\*\/)|(([^\\])\/\/[^\n]*\n))/g,
                function(m)
                {
                    var l=th.comments.length;
                    th.comments.push(m);
                    return '~~~C'+l+'~~~';
                }
            );
    }
    th.insertComment = function(code)
    {
        return code.replace(
            /(~~~C([0-9]+)~~~)/g,
            function(m, f1, f2)
            {
                var comment = th.comments[f2].replace(
                    /((<br \/>)|(<br\/>)|(<br>))/g,
                    ''
                );
                return '<span class="C">'+comment+'</span>';
            }
        );
    }
    th.bracesing = function (code)
    {
        var newCode = code.replace(
            Config.braces.findRegExp,
            function(m, f)
            {
                th.braces.push(f);
                var key = th.braces.lastIndexOf(f)
                var name = '~~~braces_'+key+'~~~';
                return ' '+name+' ';
            }
        );
        if(newCode !== code)
        {
            newCode = th.bracesing(newCode);
        }
        return newCode;
    }
    th.rebracesing = function (code, callback, parent)
    {
        var newCode = code.replace(
            /(~~~braces_([0-9]+)~~~)/g,
            function(m, f1, f2)
            {
                var content = th.braces[f2];
                if(typeof callback == 'function')
                {
                    content = callback(content, parent);
                }
                return '{<span class="braces">' +content + '}</span>';
            }
        );
        if(newCode !== code)
        {
            newCode = th.rebracesing(newCode, callback, parent);
        }
        return newCode;
    }
    th.markKeywords = function(code)
    {
        return code
            .replace(
                new RegExp( '(?:[^\\$\\(\\:]{1})\\b('+Config.keywords+')\\b', 'g'),
                function(m, f1)
                {
                    return '<span class="kwrd"> '+f1+' </span>';
                }
            );
    }


}


