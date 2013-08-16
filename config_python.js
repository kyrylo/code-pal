var my_cnfg =
{
    python:
    {
        keywords :
        [
            'abstract',
            'assert',
            'boolean',
            'break',
            'byte',
        ],
        keywordsNavigator:
        [
            'class',
            'function',
            'variable'
        ],
        contents:   '',
        comments:
        [
        ],
        backlight:
        {
            rgExp:
            {
                iclass: function(target)
                {
                    return new RegExp('([\\s\\(])('+target+')([\\s\\(\\)])', 'g');
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

        }
    }
}