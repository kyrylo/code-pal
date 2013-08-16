var cnfg =
{
    while:
    {
        keywords:
        [
//            'program',
//            'begin',
            'if',
            'then',
            'else',
//            'end'
        ],
        backlight:
        {
            rgExp:
            {
                iclass: function(target)
                {
                    return new RegExp('([\\s\\(])('+target+')([\\s\\(\\{\\)]*)', 'g');
                },
                ifunction: function(target)
                {
                    return new RegExp('([\\s\\(\\.\\>])('+target+')([\\<\\s\\(\\)])', 'g');
                },
                ivariable: function(target)
                {
                    return new RegExp('([^A-Za-z0-9])('+target+')([^A-Za-z0-9])', 'g');
                }
            },
            replaceText:
            {
                iclass: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                },
                ifunction: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                },
                ivariable: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                }
            }

        },
        entities:
        [
            {
                name: 'program',
                coder:
                {
                    regExp: /(\bprogram(?:[\s\t\n]+)([A-Za-z_]+)(?:[\s\t\n\S]+)(?:~~~braces_([0-9]+)~~~))/g,
                    callback: function()
                    {
                        var name = arguments[2];
                        var bracesID = arguments[3];
                        var currentParent = Code.currentParent;
                        var nn = Code.baby.length;
                        Code.baby.push({
                            type:       'programm',
                            name:       name,
                            id:         nn,
                            parent:     currentParent
                        });
                        var result = '<span class="entity" data-type="program" data-id="'+nn+'">';
                        result += '<span class="kwrd">program</span> <span class="name" id="name_'+nn+'">' + name + '</span>';
                        result += '<br/><span class="kwrd">begin</span><br/><span class="braces">' + Code.toParse(Code.bloker.braces[bracesID], nn) + '</span><br/><span class="kwrd">end</span><br/>';
                        result += '</span>';
                        Code.currentParent = currentParent;
                        return result;

                    }
                }
            }
        ],
        braces:
        {
            findRegExp: /begin([\s\S]*)end/g

        }
    },
    java:
    {
        keywords :
        [
//            'abstract',
            'assert',
            'boolean',
            'break',
            'byte',
            'case',
            'catch',
            'char',
//            'class',
            'const',
            'continue',
            'default',
            'do',
            'double',
            'else',
            'enum',
//            'extends',
            'false',
//            'final',
            'finally',
            'float',
            'for',
            'goto',
            'if',
//            'implements',
            'import',
            'instanceof',
            'int',
//            'interface',
            'long',
            'native',
            'new',
            'null',
            'package',
//            'private',
//            'protected',
//            'public',
            'return',
            'short',
//            'static',
            'strictfp',
            'super',
            'switch',
            'synchronized',
            'this',
            'throw',
//            'throws',
            'true',
            'transient',
            'try',
//            'void',
            'volatile',
            'while'
        ],
        backlight:
        {
            rgExp:
            {
                iclass: function(target)
                {
                    return new RegExp('([\\s\\(])('+target+')([\\s\\(\\{\\)]*)', 'g');
                },
                ifunction: function(target)
                {
                    return new RegExp('([\\s\\(\\.\\>])('+target+')([\\<\\s\\(\\)])', 'g');
                },
                ivariable: function(target)
                {
                    return new RegExp('([^A-Za-z0-9])('+target+')([^A-Za-z0-9])', 'g');
                }
            },
            replaceText:
            {
                iclass: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                },
                ifunction: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                },
                ivariable: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                }
            }

        },
        entities:
        [
            {
                name:               'interface',
                coder:
                {
                    regExp: /(public|private){0,1}(?:[\s\t\n]*)interface(?:[\s\t\n]+)([A-Za-z_]+)(<[A-Za-z_]+>){0,1}(?:[\s\t\n]*)(?:extends){0,1}(?:[\s\t\n]*)([A-Za-z_]*)(?:[\s\t\n]*)(?:~~~braces_([0-9]+)~~~)/g,
                    callback: function(m, f1, f2, f3, f4, f5, f6, f7)
                    {
                        var currentParent = Code.currentParent;
                        var nn = Code.baby.length;
                        Code.baby.push({
                            type:       'interface',
                            name:       f2,
                            generic:    f3,
                            extends:    f4,
                            implements: f5,
                            id:         nn,
                            parent:     currentParent
                        });
                        var result = '<span class="entity" data-type="class" data-id="'+nn+'">';
                        if(f1 !== undefined)
                        {
                            result += ' <span class="kwrd">'+f1+'</span> ';
                        }
                        var generic = '';
                        if(f3 !== undefined)
                        {
                            generic = '<'+f3+'>';
                        }
                        result += '<span class="kwrd">class</span> <span class="name" id="name_'+nn+'">' + f2+generic + '</span>';
                        if(f4 !== '')
                        {
                            result += ' <span class="kwrd">extends</span> <span class="extends">' + f4 + '</span>';
                        }
                        result += '{<span class="braces">' + Code.toParse(Code.bloker.braces[f5], nn) + '</span>}';
                        result += '</span>';
                        Code.currentParent = currentParent;
                        return result;
                    }
                }
            },
            {
                name:               'class',
                coder:
                {
                    regExp: /(public|private|protected|static|abstract|final){0,1}(?:[\s\t\n]*)(public|private|protected|static|abstract|final){0,1}(?:[\s\t\n]*)(public|private|protected|static|abstract|final){0,1}(?:[\s\t\n]*)class(?:[\s\t\n]+)([A-Za-z_]+){1}(?:<([A-Za-z_ ]+)>){0,1}(?:[\s\t\n]*)(extends|implements){0,1}(?:[\s\t\n]*)([A-Za-z_]*)(?:[\s\t\n]*)(extends|implements){0,1}(?:[\s\t\n]*)([A-Za-z_]*)(?:[\s\t\n]*)(?:~~~braces_([0-9]+)~~~)/g,
                    callback: function(m, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11)
                    {
//                        for(key in arguments)
//                        {
//                            console.log(key+': '+arguments[key]);
//                        }
                        var currentParent = Code.currentParent;
                        var nn = Code.baby.length;
                        Code.baby.push({
                            type:       'class',
                            name:       f4,
                            generic:    f5,
                            extends:    f6,
                            implements: f7,
                            id:         nn,
                            parent:     currentParent
                        });
                        var result = '<span class="entity" data-type="class" data-id="'+nn+'">';
                        if(f1 !== undefined)
                        {
                            result += ' <span class="kwrd">'+f1+'</span> ';
                        }
                        if(f2 !== undefined)
                        {
                            result += ' <span class="kwrd">'+f2+'</span> ';
                        }
                        if(f3 !== undefined)
                        {
                            result += ' <span class="kwrd">'+f3+'</span> ';
                        }
                        var generic = '';
                        if(f5 !== undefined)
                        {
                            generic = '&lt;'+f5+'&gt;';
                        }
                        result += '<span class="kwrd">class</span> <span class="name" id="name_'+nn+'">' + f4+generic + '</span>';
                        if(f6 !== undefined)
                        {
                            result += ' <span class="kwrd">'+f6+'</span> <span class="extends">' + f7 + '</span>';
                        }
                        if(f8 !== undefined)
                        {
                            result += ' <span class="kwrd">'+f8+'</span> <span class="extends">' + f9 + '</span>';
                        }
                        result += '{<span class="braces">' + Code.toParse(Code.bloker.braces[f10], nn) + '</span>}';
                        result += '</span>';
                        Code.currentParent = currentParent;
                        return result;
                    }
                }
            },
            {
                name:               'function',
                coder:
                {
                    regExp: /((public|private|protected|static|final){0,1}(?:[\s\t\n]*)(static|final){0,1}(?:[\s\t\n]*)(static|final){0,1}(?:[\s\t\n]*)([A-Za-z_]+)(?:[\s\t\n]+)([A-Za-z_]+)(?:[\s\t\n]*)\((.*)\)(?:[\s\t\n]*)(?:(?:~~~braces_([0-9]+)~~~)|(;)))/g,
                    callback: function(m, f1, f2, f3, f4, f5, f6, f7, f8, f9, f10)
                    {
                        if(f5 != 'new' && f6 != 'if')
                        {
                            var currentParent = Code.currentParent;
                            var nn = Code.baby.length;
                            Code.baby.push({
                                type:       'function',
                                name:       f6,
                                dataType:   f5,
                                argument:   f7,
                                id:         nn,
                                parent:     currentParent
                            });
                            var result = '<span class="entity" data-type="funuction" data-id="'+nn+'">';
                            if(f2 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f2+'</span> ';
                            }
                            if(f3 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f3+'</span> ';
                            }
                            if(f4 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f4+'</span> ';
                            }
                            result += f5 + ' <span class="name" id="name_'+nn+'">' + f6 + '</span>';
                            result += ' (<span class="arguments">' + Code.toParse(f7, nn) + '</span>)';
                            if(f8 !== undefined)
                            {
                                result += '{<span class="braces">' + Code.toParse(Code.bloker.braces[f8], nn) + '</span>}';
                            }
                            if(f9 !== undefined)
                            {
                                result += f9;
                            }
                            result += '</span>';
                            Code.currentParent = currentParent;
                            return result;
                        }
                        return m;
                    }
                }
            },
            {
                name:               'variable',
                coder:
                {
                    regExp: /((public|private|protected|static|final){0,1}(?:[\s\t\n]*)(static|final){0,1}(?:[\s\t\n]*)(static|final){0,1}(?:[\s\t\n]*)([A-Za-z_]+)(?:[\s\t\n]+)([A-Za-z_]+)(?:[\s\t\n]*)(;|=))/g,
                    callback: function(m, f1, f2, f3, f4, f5, f6, f7)
                    {
//                        console.log('variable');
//                        console.log(arguments);
                        if(f5 != 'span' && f5 != 'return' && f5 != 'package')
                        {
                            var currentParent = Code.currentParent;
                            var nn = Code.baby.length;
                            Code.baby.push({
                                type:       'variable',
                                name:       f6,
                                dataType:   f5,
                                id:         nn,
                                parent:     currentParent
                            });
                            var result = '<span class="entity" data-type="variable" data-id="'+nn+'">';
                            if(f2 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f2+'</span> ';
                            }
                            if(f3 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f3+'</span> ';
                            }
                            if(f4 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f4+'</span> ';
                            }
                            result += f5 + ' <span class="name" id="name_'+nn+'">' + f6 + '</span>';
                            result += '</span> ' + f7;
                            Code.currentParent = currentParent;
                            return result;
                        }
                        else
                        {
                            return f1;
                        }
                    }
                },
                parser:
                {
                    regExp: new RegExp('(public|private|protected) +([A-Za-z_-]+ +){0,3}([A-Za-z_-]+) *(=|;)', 'ig'),
                    callback: function(m, f1, f2, f3)
                    {
                        return f3;
                    }
                }
            }
        ],
        braces:
        {
            findRegExp: /{([^{}]*)}/g

        }
    },
    php:
    {
        keywords:
        [
            '__halt_compiler',
            'abstract',
            'and',
            'array',
            'as',
            'break',
            'callable',
            'case',
            'catch',
//            'class',
            'clone',
            'const',
            'continue',
            'declare',
            'default',
            'die',
            'do',
            'echo',
            'else',
            'elseif',
            'empty',
            'enddeclare',
            'endfor',
            'endforeach',
            'endif',
            'endswitch',
            'endwhile',
            'eval',
            'exit',
//            'extends',
            'final',
            'for',
            'foreach',
//            'function',
            'global',
            'goto',
            'if',
            'implements',
            'include',
            'include_once',
            'instanceof',
            'insteadof',
            'interface',
            'isset',
            'list',
            'namespace',
            'new',
            'or',
            'package',
            'print',
//            'private',
//            'protected',
//            'public',
            'require',
            'require_once',
            'return',
//            'static',
            'switch',
            'throw',
            'trait',
            'try',
            'unset',
            'use',
            'var',
            'while',
            'xor'
        ],
        keywordsNavigator:
            [
                'class',
                'function',
                'variable'
            ],
        backlight:
        {
            rgExp:
            {
                iclass: function(target)
                {
                    return new RegExp('([\\s\\(])('+target+')([\\s\\(\\{\\)]*)', 'g');
                },
                ifunction: function(target)
                {
                    return new RegExp('([\\s\\(\\.\\>])('+target+')([\\<\\s\\(\\)])', 'g');
                },
                ivariable: function(target)
                {
                    return new RegExp('([^A-Za-z0-9])(\\'+target+')([^A-Za-z0-9])', 'g');
                }
            },
            replaceText:
            {
                iclass: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                },
                ifunction: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                },
                ivariable: function(target)
                {
                    return '$1'+tmpl.backlight.forInsert('$2')+'$3';
                }
            }

        },
        entities:
            [
                {
                    name:               'class',
                    coder:
                    {
                        regExp: /class(?:[\s\t\n]+)([A-Za-z_]+)(?:[\s\t\n]*)(?:extends){0,1}(?:[\s\t\n]*)([A-Za-z_]*)(?:[\s\t\n]*)(?:~~~braces_([0-9]+)~~~)/g,
                        callback: function(m, f1, f2, f3)
                        {
                            var currentParent = Code.currentParent;
                            var nn = Code.baby.length;
                            Code.baby.push({
                                type:       'class',
                                name:       f1,
                                extends:    f2,
                                id:         nn,
                                parent:     currentParent
                            });
                            var result = '<span class="entity class" data-id="'+nn+'">';
                            result += '<span class="kwrd">class</span> <span class="name" id="name_'+nn+'">' + f1 + '</span>';
                            if(f2 !== '')
                            {
                                result += ' <span class="kwrd">extends</span> <span class="extends">' + f2 + '</span>';
                            }
                            result += '{<span class="braces">' + Code.toParse(Code.bloker.braces[f3], nn) + '</span>}';
                            result += '</span>';
                            Code.currentParent = currentParent;
                            return result;
                        }
                    },
                    parser:
                    {
                        regExp: /class(?:[\s\t\n]*)+([A-Za-z_-]+)([A-Za-z_\s^{^}]*){/ig,
                        callback: function(m, f1)
                        {
                            return f1;
                        }
                    }
                },
                {
                    name:               'function',
                    coder:
                    {
                        regExp: /(public|private){0,1}(?:[\s\t\n]*)(static|protected){0,1}(?:[\s\t\n]*)function(?:[\s\t\n]+)([A-Za-z_]+)(?:[\s\t\n]*)\((.*)\)(?:[\s\t\n]*)(?:~~~braces_([0-9]+)~~~)/g,
                        callback: function(m, f1, f2, f3, f4, f5)
                        {
                            var currentParent = Code.currentParent;
                            var nn = Code.baby.length;
                            Code.baby.push({
                                type:       'function',
                                name:       f3,
                                arguments:  f4,
                                id:         nn,
                                parent:     currentParent
                            });
                            var result = '<span class="entity function" data-id="'+nn+'">';
                            if(f1 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f1+'</span> ';
                            }
                            if(f2 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f2+'</span> ';
                            }
                            result += '<span class="kwrd">function</span> <span class="name" id="name_'+nn+'">' + f3 + '</span>';
                            result += ' (<span class="arguments">' + Code.toParse(f4, nn) + '</span>)';
                            result += '{<span class="braces">' + Code.toParse(Code.bloker.braces[f5], nn) + '</span>}';
                            result += '</span>';
                            Code.currentParent = currentParent;
                            return result;
                        }
                    },
                    parser:
                    {
                        regExp: /[(public)(private)(protected)(static)\s]*function +([A-Za-z_]+) *\(/ig,
                        callback: function(m, f1, f2, f3)
                        {
                            return f1;
                        }
                    }
                },
                {
                    name:               'variable',
                    coder:
                    {
                        regExp: /(?:(public|private|var|static|protected){1}(?:[\s\t\n]*)(static|protected){0,1}(?:[\s\t\n]*)(\$[A-Za-z_>-]+)(?:[\s\t\n]*)(?=|;))|(?:(\$[A-Za-z_]+)(?:[\s\t\n]*)([.=;-]{1}))/g,
                        callback: function(m, f1, f2, f3, f4, f5, f6, f7)
                        {
                            var currentParent = Code.currentParent;
                            var nn = Code.baby.length;
                            var name = '';
                            if(f3 !== undefined)
                            {
                                name = f3;
                            }
                            else if(f4 !== undefined)
                            {
                                name = f4;
                            }
                            else if(f5 == undefined)
                            {
                                f5 = '';
                            }
                            var result = Code.addBaby({
                                type:       'variable',
                                name:       name,
                                id:         nn,
                                parent:     currentParent
                            });
                            var idHTML = 'id="name_'+nn+'"';
                            if(typeof result == 'Object')
                            {
                                nn = result.id;
                                idHTML = '';
                            }
                            var result = '<span class="entity variable" data-id="'+nn+'">';
                            if(f1 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f1+'</span> ';
                            }
                            if(f2 !== undefined)
                            {
                                result += ' <span class="kwrd">'+f2+'</span> ';
                            }
                            result += '<span class="name name_'+nn+'" '+idHTML+'>'+name+'</span>'+f5;
                            result += '</span>';
                            return result;
                        }
                    },
                    parser:
                    {
                        regExp: /[(public)(private)(protected)(static)(var)]* +(\$(?!this)[A-Za-z_>]+)/ig,
                        callback: function(m, f1, f2, f3)
                        {
                            return f1;
                        }
                    }
                }
            ],
        braces:
        {
            findRegExp: /{([^{}]*)}/g
        }
    }
};
