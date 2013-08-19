@CodePal.module 'WorkspaceApp.Show', (Show, App, Backbone, Marionette, $, _) ->

  Show.Controller =

    showWorkspace: ->
      @layout = @getLayoutView()

      @layout.on 'show', =>
        @structureRegion()
        @codeRegion()
        @tweakingRegion()
        @textRegion()

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

    textRegion: ->
      textView = @getTextView()
      @layout.textRegion.show textView

    getStructureView: ->
      new Show.Structure

    getCodeView: ->
      new Show.Code

    getTweakingView: ->
      new Show.Tweaking

    getTextView: ->
      new Show.Text

    getLayoutView: ->
      new Show.Layout
