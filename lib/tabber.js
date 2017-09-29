'use babel'

let disp

export function activate () {
  disp = atom.commands.add('atom-text-editor:not(.autocomplete-active)', {
    'tabber:tab': (e) => tab(e)
  })
}

export function deactivate () {
  disp.dispose()
}

function getCurrentEditor () {
  for (let ed of atom.textEditors.editors) {
    if (ed.getElement().contains(document.activeElement)) {
      return ed
    }
  }

  return null
}

function tab (e) {
  let ed = getCurrentEditor()
  // no editor focused
  if (ed === null) return

  let sels = ed.getSelections()
  let pos = ed.getCursorBufferPosition()
  let textBefore = ed.getTextInBufferRange([[pos.row, 0], [pos.row, pos.column]])
  // no selections in editor
  if (sels.length == 1 &&
      sels[0].getBufferRange().start.row == sels[0].getBufferRange().end.row &&
      sels[0].getBufferRange().start.column == sels[0].getBufferRange().end.column &&
      // check the char immediately in front of the cursor
      /[^\s\\n\(\)\[\]{};,]$/.test(textBefore)) {
    atom.commands.dispatch(ed.getElement(), 'autocomplete-plus:activate')
    e.stopPropagation()
  } else {
    atom.commands.dispatch(ed.getElement(), 'editor:indent')
    e.stopPropagation()
  }
}
