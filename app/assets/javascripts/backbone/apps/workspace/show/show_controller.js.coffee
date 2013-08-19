@CodePal.module 'WorkspaceApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  Show.Controller =

    showWorkspace: ->
      showView = @getShowView()

      App.mainRegion.show showView

    getShowView: ->
      new Show.Workspace
