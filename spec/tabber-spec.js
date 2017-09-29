'use babel'

import Tabber from '../lib/tabber'

describe('Tabber', () => {
  let editor

  beforeEach(() => {
    waitsForPromise(() => {
      return atom.workspace.open().then((ed) => editor = ed)
    })
    waitsForPromise(() => { return atom.packages.activatePackage('language-javascript') })
    waitsForPromise(() => { return atom.packages.activatePackage('autocomplete-plus') })
  })

  describe('when the tab key is pressed', () => {
    it('inserts an indent if the cursor is not positioned after a word', () => {
      expect(editor.getText()).toBe('')
      atom.commands.dispatch(editor.getElement(), 'tabber:tab')
      expect(/\s*/.test(editor.getText())).toBeTruthy()

      atom.commands.dispatch(editor.getElement(), 'tabber:tab')
      expect(/\s*/.test(editor.getText())).toBeTruthy()

      editor.setText('(asd)')
      editor.setCursorBufferPosition([0, Infinity])
      atom.commands.dispatch(editor.getElement(), 'tabber:tab')
      expect(/\(asd\)\s*/.test(editor.getText())).toBeTruthy()
    })

    it('triggers autocomplete if the cursor is positioned after a word', async () => {
      expect(editor.getText()).toBe('')
      editor.setGrammar(atom.grammars.grammarForScopeName('source.js'))
      editor.setText('atom.works')
      editor.setCursorBufferPosition([0, Infinity])
      atom.commands.dispatch(editor.getElement(), 'tabber:tab')
      await new Promise(resolve => setTimeout(resolve, 200))
      atom.commands.dispatch(editor.getElement(), 'tabber:tab')
      await new Promise(resolve => setTimeout(resolve, 200))
      expect(editor.getText()).toBe('atom.workspace')
    })
  })
})
