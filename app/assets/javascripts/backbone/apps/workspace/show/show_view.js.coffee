@CodePal.module 'WorkspaceApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  class Show.Layout extends Marionette.Layout
    template: 'workspace/show/templates/layout'

    regions:
      structureRegion: '#structure-region'
      codeRegion:      '#code-region'
      tweakingRegion:  '#tweaking-region'
      textRegion:      '#text-region'

  class Show.Structure extends Marionette.ItemView
    template: 'workspace/show/templates/_structure'

  class Show.Code extends Marionette.ItemView
    template: 'workspace/show/templates/_code'

  class Show.Tweaking extends Marionette.ItemView
    template: 'workspace/show/templates/_tweaking'
    id: 'tweaking'

  class Show.Text extends Marionette.ItemView
    template: 'workspace/show/templates/_text'
