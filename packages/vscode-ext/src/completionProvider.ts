import * as vscode from 'vscode';

export class InkyScriptCompletionProvider implements vscode.CompletionItemProvider {
    private builtinChars = ['Narrator'];

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[]> {
        const line = document.lineAt(position).text;
        const linePrefix = line.substring(0, position.character);
        const trimmed = linePrefix.trim();

        const completionItems: vscode.CompletionItem[] = [];

        // ── @char ──────────────────────────────────────────────
        if (trimmed === '@') {
            const item = new vscode.CompletionItem('char', vscode.CompletionItemKind.Keyword);
            item.insertText = new vscode.SnippetString('char ${1:CharacterName}\n\tname: "${2:Display Name}"\n\tsprite: "${3:sprite.png}"\n\tcolor: "${4:#FF69B4}"\n');
            item.documentation = new vscode.MarkdownString('Define a new character');
            completionItems.push(item);
            return completionItems;
        }

        // ── Label definition ───────────────────────────────────
        if (trimmed === '=' || trimmed === '==') {
            const item = new vscode.CompletionItem('Label', vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString('= ${1:LabelName} ==\n$0');
            item.documentation = new vscode.MarkdownString('Create a new label/scene');
            completionItems.push(item);
            return completionItems;
        }

        // ── Variable operations after ~ ────────────────────────
        if (trimmed === '~') {
            for (const op of ['=', '+=', '-=', '*=', '/=']) {
                const item = new vscode.CompletionItem(`variableName ${op}`, vscode.CompletionItemKind.Operator);
                item.insertText = new vscode.SnippetString(`\${1:variableName} ${op} \${2:value}`);
                item.documentation = new vscode.MarkdownString(`Variable operation: \`${op}\``);
                completionItems.push(item);
            }
            return completionItems;
        }

        // ── String interpolation: {variable} or {Char.attr} ───
        // Only trigger when inside a quoted string
        if (context.triggerCharacter === '{' && /^[^"]*"[^"]*$/.test(linePrefix)) {
            const variables = this.getDefinedVariables(document);
            for (const varName of variables) {
                const item = new vscode.CompletionItem(varName, vscode.CompletionItemKind.Variable);
                item.documentation = new vscode.MarkdownString(`Variable: \`${varName}\``);
                completionItems.push(item);
            }

            const allChars = [...this.getDefinedCharacters(document), ...this.builtinChars];
            for (const char of allChars) {
                for (const attr of ['name', 'color', 'sprite']) {
                    const item = new vscode.CompletionItem(`${char}.${attr}`, vscode.CompletionItemKind.Property);
                    item.documentation = new vscode.MarkdownString(`${char}'s \`${attr}\` attribute`);
                    completionItems.push(item);
                }
            }
            return completionItems;
        }

        // ── After -> : label targets ───────────────────────────
        if (/->\s*\w*$/.test(linePrefix)) {
            for (const label of this.getDefinedLabels(document)) {
                const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Reference);
                item.documentation = new vscode.MarkdownString(`Jump to label: \`${label}\``);
                completionItems.push(item);
            }
            return completionItems;
        }

        // ── After 'at': positions ──────────────────────────────
        if (/\bat\s+\w*$/.test(linePrefix)) {
            for (const pos of ['left', 'center', 'right']) {
                const item = new vscode.CompletionItem(pos, vscode.CompletionItemKind.EnumMember);
                item.documentation = new vscode.MarkdownString(`Position: \`${pos}\``);
                completionItems.push(item);
            }
            return completionItems;
        }

        // ── After 'play': audio types ──────────────────────────
        if (/\bplay\s+\w*$/.test(linePrefix)) {
            for (const type of ['music', 'sound']) {
                const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.Keyword);
                item.documentation = new vscode.MarkdownString(`Audio type: \`${type}\``);
                completionItems.push(item);
            }
            return completionItems;
        }

        // ── Line-start completions ─────────────────────────────
        if (trimmed === '') {
            this.addLineStartCompletions(completionItems);

            // Character names for dialogue
            const allChars = [...this.getDefinedCharacters(document), ...this.builtinChars];
            for (const char of allChars) {
                const item = new vscode.CompletionItem(char, vscode.CompletionItemKind.Variable);
                item.insertText = new vscode.SnippetString(`${char} "\${1:Dialogue text}"`);
                item.documentation = new vscode.MarkdownString(`Dialogue for **${char}**`);
                completionItems.push(item);
            }
            return completionItems;
        }

        // ── Partial word: character name for dialogue ──────────
        if (/^\w+$/.test(trimmed)) {
            const allChars = [...this.getDefinedCharacters(document), ...this.builtinChars];
            for (const char of allChars) {
                const item = new vscode.CompletionItem(char, vscode.CompletionItemKind.Variable);
                item.insertText = new vscode.SnippetString(`${char} "\${1:Dialogue text}"`);
                item.documentation = new vscode.MarkdownString(`Dialogue for **${char}**`);
                completionItems.push(item);
            }
        }

        return completionItems;
    }

    private addLineStartCompletions(items: vscode.CompletionItem[]): void {
        const commands: Array<[string, string, string]> = [
            ['scene',  'scene ${1:SceneName}',                                    'Change the background scene'],
            ['show',   'show ${1:character} ${2:expression} at ${3|left,center,right|}', 'Show a character on screen'],
            ['hide',   'hide ${1:character}',                                     'Hide a character from screen'],
            ['clear',  'clear',                                                   'Clear all characters from screen'],
            ['play',   'play ${1|music,sound|} ${2:filename.mp3}',                'Play audio'],
            ['stop',   'stop music${1: fadeout ${2:1000}}',                       'Stop music playback'],
            ['pause',  'pause music',                                              'Pause music'],
            ['->',     '-> ${1:TargetLabel}',                                     'Jump to a label'],
            ['~',      '~ ${1:variableName} = ${2:value}',                        'Set a variable'],
            ['*',      '* ${1:Choice text} -> ${2:TargetLabel}',                  'Create a choice'],
            ['{ condition }', '{ ${1:condition} }\n\t$0',                         'Conditional block (if)'],
            ['{ else }', '{ else }\n\t$0',                                        'Else block'],
        ];

        for (const [label, snippet, doc] of commands) {
            const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString(snippet);
            item.documentation = new vscode.MarkdownString(doc);
            items.push(item);
        }
    }

    // ── Helpers ────────────────────────────────────────────────

    private getDefinedCharacters(document: vscode.TextDocument): string[] {
        const chars: string[] = [];
        const pattern = /@char\s+(\w+)/g;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(document.getText())) !== null) {
            chars.push(match[1]);
        }
        return chars;
    }

    private getDefinedLabels(document: vscode.TextDocument): string[] {
        const labels: string[] = [];
        const pattern = /==\s*(\w+)\s*==/g;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(document.getText())) !== null) {
            labels.push(match[1]);
        }
        return labels;
    }

    private getDefinedVariables(document: vscode.TextDocument): string[] {
        const variables: string[] = [];
        // Match ~ varName = / += / -= / *= / /=
        const pattern = /~\s*(\w+)\s*(?:\+|-|\*|\/)?=/g;
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(document.getText())) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }
        return variables;
    }
}
