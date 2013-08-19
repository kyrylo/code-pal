@CodePal.module 'WorkspaceApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  Show.Controller =

    showWorkspace: ->
      @layout = @getLayoutView()

      @layout.on 'show', =>
        @structureRegion()
        @codeRegion()
        @tweakingRegion()

      App.mainRegion.show @layout

    structureRegion: ->
      structureView = @getStructureView()
      @layout.structureRegion.show structureView

    codeRegion: ->
      codeView = @getCodeView()
      @layout.codeRegion.show codeView

    tweakingRegion: ->
      tweakingView = @getTweakingView()
      @layout.tweakingRegion.show tweakingView

    getStructureView: ->
      new Show.Structure

    getCodeView: ->
      new Show.Code

    getTweakingView: ->
      new Show.Tweaking

    getLayoutView: ->
      new Show.Layout
