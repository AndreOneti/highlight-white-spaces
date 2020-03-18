'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log("Congratulations, your extension 'highlight-whitespaces' is now active!");

  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (!editor) return;

    updateDecorations(editor);
  }, null, context.subscriptions);

  vscode.window.onDidChangeTextEditorSelection(event => {
    if (!event.textEditor) {
      console.error("onDidChangeTextEditorSelection(" + event + "): no active text editor.");
      return;
    }

    updateDecorations(event.textEditor);
  });

  vscode.workspace.onDidChangeTextDocument(event => {
    if (!vscode.window.activeTextEditor) {
      console.error("onDidChangeTextDocument(" + event + "): no active text editor.");
      return;
    }

    updateDecorations(vscode.window.activeTextEditor);
  }, null, context.subscriptions);

  let spacesDecoration = vscode.window.createTextEditorDecorationType({
    backgroundColor: "#ff00004d"
  });

  function updateDecorations(activeTexEditor: vscode.TextEditor) {

    if (!activeTexEditor) {
      console.error("updateDecorations(): no active text editor.");
      return;
    }

    const regex = /\s+$/g;
    const document = activeTexEditor.document;
    const decorationOptions: vscode.DecorationOptions[] = [];
    for (let index = 0; index < document.lineCount; index++) {
      let line = document.lineAt(index).text;
      if (index === activeTexEditor.selection.active.line) {
        continue;
      }

      let match;
      while (match = regex.exec(line)) {
        let starPosition = new vscode.Position(index, match.index);
        let endPosition = new vscode.Position(index, match.index + match[0].length);
        const decoration = {
          range: new vscode.Range(starPosition, endPosition),
          hoverMessage: `Number **${match[0].length}**`
        }
        decorationOptions.push(decoration);
      }
    }
    activeTexEditor.setDecorations(spacesDecoration, decorationOptions);
  }

  updateDecorations(vscode.window.activeTextEditor);

}

export function deactivate() {
  console.log("The extension 'highlight-whitespaces' is now deactivated.");
}