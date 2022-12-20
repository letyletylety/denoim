import * as vscode from 'vscode';

export const NPMMODULE_MENTION = 'emoji_mention';

/** String to detect in the text document. */
const NPMMODULE = '@';

/// 진단 도구 만들기
function createDiagnostic(doc: vscode.TextDocument, lineOfText: vscode.TextLine, lineIndex: number): vscode.Diagnostic {
    // npm module 찾기
    const index = lineOfText.text.indexOf(NPMMODULE);
    // end index
    const blankIndex = lineOfText.text.indexOf(' ');

    // get module name
    const range = new vscode.Range(lineIndex, index, lineIndex, blankIndex);

    const diagnostic = new vscode.Diagnostic(range, "npm module name",
    vscode.DiagnosticSeverity.Information);
    diagnostic.code = NPMMODULE_MENTION;
    return diagnostic;
}

/**
 * Analyzes the text document for problems. 
 * 진단 새로고침
 * This demo diagnostic problem provider finds all mentions of 'emoji'.
 * @param doc text document to analyze
 * @param moduleDiagnostics diagnostic collection
 */
export function refreshDiagnostics(doc: vscode.TextDocument, moduleDiagnostics: vscode.DiagnosticCollection): void {
    const diagnostics: vscode.Diagnostic[] = [];

    for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
        const lineOfText = doc.lineAt(lineIndex);
        if (lineOfText.text.includes(NPMMODULE)) {
            diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex));
        }
    }
    moduleDiagnostics.set(doc.uri, diagnostics);
}

/// 문서 변화 체크
export function subscribeToDocumentChanges(context: vscode.ExtensionContext, moduleDiagnostics: vscode.DiagnosticCollection): void {
    /// 텍스트 에디터 창 에서
    if (vscode.window.activeTextEditor) {
        // 진단 새로고침
        refreshDiagnostics(vscode.window.activeTextEditor.document, moduleDiagnostics);
    }

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                refreshDiagnostics(editor.document, moduleDiagnostics);
            }
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, moduleDiagnostics))
    );

    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument(doc => moduleDiagnostics.delete(doc.uri))
    );
}