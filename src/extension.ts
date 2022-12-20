// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { subscribeToDocumentChanges, NPMMODULE_MENTION } from './diagnostics';

/// extension 시작
export function activate(context: vscode.ExtensionContext) {
    /// 구독	
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('markdown', new NpmImporter(), {
            providedCodeActionKinds: NpmImporter.providedCodeActionKinds
        }));

    const importDiagnostics = vscode.languages.createDiagnosticCollection("import");

    /// 문서 변화 구독	
    subscribeToDocumentChanges(context, importDiagnostics);

    /// 타입 스크립트에 코드 액션 등록
    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider('typescript', new NpmInfo(), {
            providedCodeActionKinds: NpmInfo.providedCodeActionKinds
        })
    );

    // context.subscriptions.push(
    // 	vscode.commands.registerCommand(COMMAND, () => vscode.
    // );
}

/// npm importer
export class NpmImporter implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] | undefined { 
        /// @ 로 시작하지 않음
        if(!this.isAtStartOfNpmModule(document, range)) {return;}
        
        const replaceWithImportFix = this.createFix(document, range, );

        return [
        ];
    }

    // @...
    private isAtStartOfNpmModule(document: vscode.TextDocument, range: vscode.Range) {
            /// 커서 첫 위치
            const start = range.start;
            /// 커서가 해당하는 라인
            const line = document.lineAt(start.line);

            return line.text[start.character] === '@';
        }

    private createFix(document: vscode.TextDocument, range: vscode.Range) : vscode.CodeAction {

    }
}

/// 코드 액션
export class NpmInfo implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];
}


// this method is called when your extension is deactivated
export function deactivate() {}
