function Rules(name)
{
    if(name == undefined)
    {
        name = 'java';
    }
    var key;
    var config = helper.getProperty(cnfg, name, false);
    if(!(config))
    {
        return false;
    }

    var Rule =
    {
        name:               name,
        keywords:           helper.getProperty(config, 'keywords', []).join('|'),
        keywordsNavigator:  helper.getProperty(config, 'keywordsNavigator', []),
        backlight:          helper.getProperty(config, 'backlight', []),
        comments:           helper.getProperty(config, 'comments', ''),
        entities:           helper.getProperty(config, 'entities', []),
        braces:             helper.getProperty(config, 'braces', []),

        addFromContent: function(content)
        {

            eval(content);
            for (key in my_cnfg)
            {
                cnfg[key] = my_cnfg[key];
            }
            Render.uploadListConfig();
            MyStorage.synchronizationConfig();
        }
    };
    return Rule;
}
