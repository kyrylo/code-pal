@CodePal.module 'WorkspaceApp', (WorkspaceApp, Backbone, Marionette, $, _) ->
  @startWithParent = false

  API =
    showWorkspace: ->
      WorkspaceApp.Show.Controller.showWorkspace()

  WorkspaceApp.on 'start', ->
    API.showWorkspace()
