var control;
var controlCNF;
var output_area;
var Code = new Coder();
var Config = Rules('java');
//reader file
var reader = new FileReader();
reader.onload = function(event)
{
    if (Config)
    {
        Render.uploadListConfig();
        var contents = event.target.result;
        contents = Parser.toMin(contents);
        contents = Parser.toMax(contents);
        Code.baby = [];
        var packCode = Code.getPackCode(contents);
        var parsCode = Code.toParse(packCode);
        var finisedCode = Code.getRepackCode(parsCode);
        finisedCode = Code.bloker.markKeywords(finisedCode);
        output_area.innerHTML = finisedCode;
        Render.addLineNumbers(finisedCode);
        Render.clearNavigator();
        var tree = Code.getNavigatorTree();
        Render.navigatorTree(tree);
    }
};
reader.onerror = function(event)
{
    console.error("File cannot be read! Code " + event.target.error.code);
};

//reader file of config
var readerCNF = new FileReader();
readerCNF.onload = function(event) {
    var contents = event.target.result;
    Config.addFromContent(contents);
};
reader.onerror = function(event) {
    console.error("File cannot be read! Code " + event.target.error.code);
};

helper.addEvent(window,"load",function()
{
    if(MyStorage.get('selectedLang') !== undefined)
    {
        Config = Rules(MyStorage.get('selectedLang'));
    }
    MyStorage.synchronizationConfig();

    Render.uploadListConfig();

    helper.addEvent('select-rule', 'change', function()
    {
        var key = this.value;
        Config = Rules(key);
        Render.uploadListConfig();
    });
    helper.addEvent('output_area', 'click', function(event)
    {
        var element = document.getElementById('left_aside');
        var style = window.getComputedStyle(element);
        var lineHeight = style.getPropertyValue('line-height');
        console.log(element.offsetTop);
        var numberLine = Math.ceil((parseInt(event.offsetY)-10)/parseInt(lineHeight));
        Menu.init();

        Menu.show({
            offsetY:event.clientX,
            offsetX:event.clientY
        });
        Menu.changeInfo('<div>Line number: '+numberLine+'</div>');
        Menu.addButton({
            id: 'editComment',
            text: 'Edit Comment',
            onclick: 'Comment.edit({id:"'+numberLine+'"});'
        });
    });
    helper.addEvent('arrow', 'click', function(event)
    {
        var nav = document.getElementById('error_area');
        var arrow = document.getElementsByClassName('arrow')[0];


        console.log(document.getElementById('error_area'));
        if(nav.style.display == '')
        {
            nav.style.display = 'none';
            arrow.setAttribute('src','image/arrow_right.png');
        }
        else
        {
            nav.style.display = '';
            arrow.setAttribute('src','image/arrow_left.png');
        }
    });

    control = document.getElementById("your-files");
    control.addEventListener("change", function(event) {
        // Onchange input - new files added
        var files = control.files;
        var fileName = control.value;
        var exe;
        fileName.replace(
            /(\.)([a-z]+)$/g,
            function()
            {
                exe = arguments[2];
            }
        );
        Config = Rules(exe);
        if(Config)
        {
            reader.readAsText(files[0]);
            Render.uploadListConfig();
        }
    }, false);

    controlCNF = document.getElementById("your-rule");
    controlCNF.addEventListener("change", function(event) {
        // Onchange input - new files added
        var files = controlCNF.files;
        readerCNF.readAsText(files[0]);
    }, false);

    output_area = document.getElementById("output_area");

    Parser = prsr();

});


 function LoadFile(file){
    var ext = file.match(/[^.]+$/); // extention
    var link = '';
    if(ext == 'css'){
        link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");
        link.setAttribute("href", file);
    }
    if(ext == 'js'){
        link = document.createElement("script");
        link.setAttribute("type","text/javascript");
        link.setAttribute("src", file);
    }
	document.getElementsByTagName("head")[0].appendChild(link)
} 

function getTheme(){
    var theme = document.getElementById('theme_select').value;
    var theme_load = document.getElementById('theme_load');
    var theme_file = 'theme/' + theme + '.css';
    theme_load.setAttribute('href', theme_file);
}

function splitClasses(code){
        return code.split(/(abstract|private)? *class /);
}

function clearClass(code){
        // Remove comments
     return code.replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/([^\\])\/\/[^\n]*\n/g, '')
            // Remove regexp
                .replace(/\/(\\\/|[^\/\n])*\/[gim]{0,3}/g, '')
            // Remove strings
                .replace(/([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*"))/g, '');
}
var Menu = {
    element:  '',
    info: '',
    actives: '',

    init: function()
    {
        Menu.element = document.getElementById('menu');
        Menu.wrapper = Menu.element.getElementsByClassName('wrapper')[0];
        Menu.info = Menu.element.getElementsByClassName('block info')[0];
        Menu.actives = Menu.element.getElementsByClassName('block actives')[0];
        Menu.actives.innerHTML = '';
        Menu.info.innerHTML = '';
    },
    show: function(data)
    {
        if(typeof data.offsetX == 'number')
        {
            Menu.wrapper.style.top = data.offsetX+'px';
        }
        if(typeof data.offsetY == 'number')
        {
            Menu.wrapper.style.left = data.offsetY+'px';
        }
        Menu.element.style.display = 'block';
    },
    hide: function()
    {
        Menu.element.style.display = 'none';
    },
    addInfo: function(content)
    {
        Menu.info.appendChild(content);
    },
    changeInfo: function(content)
    {
        Menu.info.innerHTML = content;
    },
    addButton: function(data)
    {
        var button = document.createElement('div');
        button.id = data.id;
        button.innerHTML = data.text;
        button.setAttribute('onclick', data.onclick);
        Menu.actives.appendChild(button);
    }
}
var Comment = {
    element: '',
    title: '',
    id: 0,
    commentLine: '',

    edit: function(data)
    {
        Comment.init({
            id: data.id,
            title: 'Edit a comment to '+data.id+' line'
        });
    },
    init: function(data)
    {
        Comment.id = data.id;

        Comment.element = document.getElementById('comment');

        Comment.title = Comment.element.getElementsByClassName('block title')[0];
        Comment.text = Comment.element.getElementsByClassName('text')[0];
        Comment.commentLine = Comment.getCommentLine();
        Comment.text.value = Comment.commentLine.innerHTML;
        Comment.title.innerHTML = data.title;

        Comment.show();
    },
    show: function(data)
    {
        Menu.hide();
        Comment.element.style.display = 'block';
        Comment.text.focus();
    },
    hide: function()
    {
        Comment.element.style.display = 'none';
    },
    save: function(data)
    {
        Comment.commentLine.innerHTML = Comment.text.value;
        Comment.hide();
    },
    getCommentLine: function()
    {
        var commentLines = document.getElementsByClassName('line_comment');
        var key;
        for(key in commentLines)
        {
            var commentLine = commentLines[key];
            if(commentLine.getAttribute('data-num') == Comment.id)
            {
                return commentLine;
            }
        }
        return false;
    }

}


//to delete later

//function Syntax(code){
////	var Blocks = Blocker();
////    newCode = Blocks.blocking(code);
////    newCode = Blocks.reblocking(newCode);
////    console.log(newCode);
//    var comments	= [];	// collect all comments
//    var strings		= [];	// collect all strings
//    var res			= [];	// collect all RegExp
//    var all			= { 'C': comments, 'S': strings, 'R': res };
//    var safe		= { '<': '<', '>': '>', '&': '&' };
//    var keywords =	Config.keywords;
//
//    var keywords_regexp = new RegExp( '(?:[^\\$]){1}\\b(' + keywords + ')\\b' + '([^a-z0-9\$_])', 'gi');
//
//
//    var test = code
//        // Mask HTML
//        .replace(/[<>&]/g, function (m)
//        { return safe[m]; })
//        // Remove comments
//        .replace(/\/\*[\s\S]*?\*\//g, function(m)
//        { var l=comments.length; comments.push(m); return '~~~C'+l+'~~~';   })
//        .replace(/([^\\])\/\/[^\n]*\n/g, function(m, f)
//        { var l=comments.length; comments.push(m); return f+'~~~C'+l+'~~~'; })
//        // Remove regexp
//        .replace(/\/(\\\/|[^\/\n])*\/[gim]{0,3}/g, function(m)
//        { var l=res.length; res.push(m); return '~~~R'+l+'~~~';   })
//        // Remove strings
//        .replace(/([^\\])((?:'(?:\\'|[^'])*')|(?:"(?:\\"|[^"])*"))/g, function(m, f, s)
//        { var l=strings.length; strings.push(s); return f+'~~~S'+l+'~~~'; })
//        // emphasize keywords
//        .replace(keywords_regexp,
//            '<span class="kwrd"> $1</span>$2')
//        // emphasize braces
//        .replace(/(\{|\}|\]|\[|\|)/gi,
//            '<span class="gly">$1</span>')
//        // emphasize funct names
//        .replace(
//        /([a-z\_\$][a-z0-9_]*)[\s]*\(/gi,
//        function(m, f, s)
//        {
//            return '<span class="func">'+f+'</span>(';
//        }
//    );
//
//
////    console.log(test);
//    code = test;
//    return code
//        // Return comments, strings, RegExp
//        .replace(/~~~([CSR])(\d+)~~~/g, function(m, t, i)
//        { return '<span class="'+t+'">'+all[t][i]+'</span>'; })
//        // Set line breaks
//        .replace(/\n/g,
//            '<br/>')
//        // Change Tab to ;&nbsp
//        .replace(/\t/g,
//            '&nbsp;&nbsp;&nbsp;&nbsp;');
//}
