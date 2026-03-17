import * as vscode from 'vscode';

export class InkyScriptHoverProvider implements vscode.HoverProvider {
    private commandDocs = new Map<string, string>([
        ['scene',  '**scene** *SceneName*\n\nChanges the background scene.\n\n```\nscene Classroom_Day\n```'],
        ['show',   '**show** *character expression* **at** *position*\n\nShows a character at the given position.\n\n```\nshow sayori happy at center\n```'],
        ['hide',   '**hide** *character*\n\nHides the character from the scene.\n\n```\nhide sayori\n```'],
        ['clear',  '**clear**\n\nRemoves all characters from the scene.'],
        ['play',   '**play** *music|sound filename* [loop] [fadein duration] [volume]\n\nPlays audio.\n\n```\nplay music bgm.mp3\nplay sound door.wav 0.5\nplay music theme.mp3 loop fadein 2000\n```'],
        ['stop',   '**stop** *music* [fadeout duration]\n\nStops playing music.\n\n```\nstop music fadeout 1000\n```'],
        ['pause',  '**pause** *music*\n\nPauses music playback.'],
        ['at',     '**at** *position*\n\nPositions: `left` · `center` · `right`'],
        ['with',   '**with** *transition*\n\nTransitions: `fade` · `dissolve` · `wipeleft` · `wiperight`'],
        ['loop',   '**loop**\n\nLoops the audio indefinitely.'],
        ['fadein', '**fadein** *ms*\n\nFades in audio over *ms* milliseconds.'],
        ['fadeout','**fadeout** *ms*\n\nFades out audio over *ms* milliseconds.'],
    ]);

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
    ): vscode.ProviderResult<vscode.Hover> {
        const line = document.lineAt(position).text;
        const trimmed = line.trim();
        const wordRange = document.getWordRangeAtPosition(position);
        const word = wordRange ? document.getText(wordRange) : '';

        // Character definition
        if (/@char\s+\w+/.test(line)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**Character Definition**\n\nDefines a character with attributes:\n- `name` – Display name\n- `sprite` – Image path or `path/{expression}.png` template\n- `color` – Hex color for dialogue name'
            ));
        }

        // Label
        if (/==\s*\w+\s*==/.test(line)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**Label**\n\nDefines a story section. Jump here with `-> LabelName`.'
            ));
        }

        // Variable assignment
        if (/~\s*\w+\s*(?:\+|-|\*|\/)?=/.test(line)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**Variable Operation**\n\nOperators: `=` assign · `+=` add · `-=` subtract · `*=` multiply · `/=` divide\n\n```\n~ affection += 10\n~ playerName = "Alex"\n```'
            ));
        }

        // Choice
        if (/\*.*->/.test(line)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**Choice**\n\n```\n* Choice text -> TargetLabel\n* [condition] Choice text -> TargetLabel\n```'
            ));
        }

        // { else }
        if (/^\s*\{\s*else\s*\}\s*$/.test(line)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**Else Block**\n\nExecuted when the preceding `{ condition }` is false.\n\n```\n{ affection >= 10 }\n    Sayori "I like you!"\n{ else }\n    Sayori "Nice to meet you."\n```'
            ));
        }

        // Conditional block { condition }
        if (/\{.*\}/.test(line)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**Condition**\n\nExecutes the block only when true. Supports `{ else }`.\n\nOperators: `==` · `!=` · `>` · `<` · `>=` · `<=`\n\nCombine: `&&` (and) · `||` (or)\n\n```\n{ affection >= 10 && knowsSecret == true }\n    Sayori "I trust you!"\n{ else }\n    Sayori "I\'m not sure yet."\n```'
            ));
        }

        // Jump
        if (/->\s*\w+/.test(line)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**Jump**\n\nJumps to the specified label.\n\n```\n-> NextScene\n```'
            ));
        }

        // Command keyword hover
        if (this.commandDocs.has(word.toLowerCase())) {
            return new vscode.Hover(new vscode.MarkdownString(this.commandDocs.get(word.toLowerCase())!));
        }

        // Character dialogue → show character info
        const dialogueMatch = line.match(/^(\w+)\s+"[^"]*"/);
        if (dialogueMatch && dialogueMatch[1] === word) {
            const info = this.getCharacterInfo(document, word);
            if (info) {
                return new vscode.Hover(new vscode.MarkdownString(`**Character: ${word}**\n\n${info}`));
            }
        }

        // String interpolation {var} or {Char.attr}
        if (/\{[\w.]+\}/.test(trimmed)) {
            return new vscode.Hover(new vscode.MarkdownString(
                '**String Interpolation**\n\nInserts values into dialogue text.\n\n```\n"{playerName} arrived."\n"{Sayori.name} smiles."\n```'
            ));
        }

        return;
    }

    private getCharacterInfo(document: vscode.TextDocument, charName: string): string | null {
        if (charName === 'Narrator') return 'Built-in narrator character.';

        const text = document.getText();
        const regex = new RegExp(`@char\\s+${charName}\\s*\\n([\\s\\S]*?)(?=@char|==|$)`, '');
        const match = regex.exec(text);
        if (!match) return null;

        const attrs = match[1];
        const info: string[] = [];

        const name   = attrs.match(/name:\s*"([^"]+)"/);
        const sprite = attrs.match(/sprite:\s*"([^"]+)"/);
        const color  = attrs.match(/color:\s*"([^"]+)"/);

        if (name)   info.push(`Name: **${name[1]}**`);
        if (sprite) info.push(`Sprite: \`${sprite[1]}\``);
        if (color)  info.push(`Color: \`${color[1]}\``);

        return info.length > 0 ? info.join('\n\n') : null;
    }
}
