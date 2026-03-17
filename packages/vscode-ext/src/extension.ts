import * as vscode from 'vscode';
import { InkyScriptCompletionProvider } from './completionProvider';
import { InkyScriptHoverProvider } from './hoverProvider';
import { InkyScriptDefinitionProvider } from './definitionProvider';
import { InkyScriptDocumentSymbolProvider } from './symbolProvider';

// Keywords that are valid at the start of a line and must not be
// mistaken for character names in dialogue diagnostics.
const COMMAND_KEYWORDS = new Set([
    'scene', 'show', 'hide', 'clear', 'play', 'stop', 'pause',
    'wait', 'shake', 'flash', 'Narrator'
]);

export function activate(context: vscode.ExtensionContext) {
    console.log('InkyScript extension is now active!');

    const selector = { language: 'inkyscript', scheme: 'file' };

    const completionProvider = vscode.languages.registerCompletionItemProvider(
        selector,
        new InkyScriptCompletionProvider(),
        '.', ' ', '@', '~', '-', '>', '*', '{', '['
    );

    const hoverProvider = vscode.languages.registerHoverProvider(
        selector,
        new InkyScriptHoverProvider()
    );

    const definitionProvider = vscode.languages.registerDefinitionProvider(
        selector,
        new InkyScriptDefinitionProvider()
    );

    const symbolProvider = vscode.languages.registerDocumentSymbolProvider(
        selector,
        new InkyScriptDocumentSymbolProvider()
    );

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('inkyscript');

    const updateDiagnostics = (document: vscode.TextDocument) => {
        if (document.languageId !== 'inkyscript') return;

        const diagnostics: vscode.Diagnostic[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        // Must have a Start label
        if (!/^==\s*Start\s*==/m.test(text)) {
            diagnostics.push(new vscode.Diagnostic(
                new vscode.Range(0, 0, 0, 0),
                'Missing required "Start" label',
                vscode.DiagnosticSeverity.Error
            ));
        }

        // Collect defined characters
        const definedChars = new Set<string>();
        const charDefPattern = /^@char\s+(\w+)/gm;
        let match: RegExpExecArray | null;
        while ((match = charDefPattern.exec(text)) !== null) {
            definedChars.add(match[1]);
        }

        // Collect defined labels for jump validation
        const definedLabels = new Set<string>();
        const labelPattern = /^==\s*(\w+)\s*==/gm;
        while ((match = labelPattern.exec(text)) !== null) {
            definedLabels.add(match[1]);
        }

        lines.forEach((line, lineIndex) => {
            const trimmed = line.trim();

            // Undefined character in dialogue
            // Only match lines that look like:  Word "..."
            // and where Word is not a known command keyword
            const dialogueMatch = trimmed.match(/^(\w+)\s+"[^"]*"$/);
            if (dialogueMatch) {
                const charName = dialogueMatch[1];
                if (!definedChars.has(charName) && !COMMAND_KEYWORDS.has(charName)) {
                    diagnostics.push(new vscode.Diagnostic(
                        new vscode.Range(lineIndex, line.indexOf(charName), lineIndex, line.indexOf(charName) + charName.length),
                        `Character "${charName}" is not defined. Add "@char ${charName}" at the top of the file.`,
                        vscode.DiagnosticSeverity.Warning
                    ));
                }
            }

            // Undefined label in jump (-> Label)
            const jumpMatch = trimmed.match(/^->\s*(\w+)$/);
            if (jumpMatch && !definedLabels.has(jumpMatch[1])) {
                const target = jumpMatch[1];
                const col = line.indexOf(target);
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(lineIndex, col, lineIndex, col + target.length),
                    `Label "${target}" is not defined.`,
                    vscode.DiagnosticSeverity.Warning
                ));
            }

            // Undefined label in choice (* text -> Label)
            const choiceMatch = trimmed.match(/^\*.*->\s*(\w+)$/);
            if (choiceMatch && !definedLabels.has(choiceMatch[1])) {
                const target = choiceMatch[1];
                const col = line.lastIndexOf(target);
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(lineIndex, col, lineIndex, col + target.length),
                    `Label "${target}" is not defined.`,
                    vscode.DiagnosticSeverity.Warning
                ));
            }
        });

        diagnosticCollection.set(document.uri, diagnostics);
    };

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => updateDiagnostics(e.document)),
        vscode.workspace.onDidOpenTextDocument(updateDiagnostics),
        completionProvider,
        hoverProvider,
        definitionProvider,
        symbolProvider,
        diagnosticCollection
    );

    vscode.workspace.textDocuments.forEach(updateDiagnostics);
}

export function deactivate() {}
