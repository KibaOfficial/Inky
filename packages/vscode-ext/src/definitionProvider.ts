import * as vscode from 'vscode';

export class InkyScriptDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        const line = document.lineAt(position).text;
        const wordRange = document.getWordRangeAtPosition(position);
        
        if (!wordRange) {
            return;
        }
        
        const word = document.getText(wordRange);
        
        // Jump targets (-> LabelName)
        const jumpMatch = line.match(/->\s*(\w+)/);
        if (jumpMatch && jumpMatch[1] === word) {
            const labelLocation = this.findLabel(document, word);
            if (labelLocation) {
                return labelLocation;
            }
        }
        
        // Choice targets (* text -> LabelName)
        const choiceMatch = line.match(/\*.*->\s*(\w+)/);
        if (choiceMatch && choiceMatch[1] === word) {
            const labelLocation = this.findLabel(document, word);
            if (labelLocation) {
                return labelLocation;
            }
        }
        
        // Character usage in dialogue
        const dialogueMatch = line.match(/^(\w+)\s+"[^"]*"/);
        if (dialogueMatch && dialogueMatch[1] === word) {
            const charLocation = this.findCharacterDefinition(document, word);
            if (charLocation) {
                return charLocation;
            }
        }
        
        // Character attributes (e.g., {Character.name})
        const attrMatch = line.match(/\{(\w+)\.(\w+)\}/);
        if (attrMatch && attrMatch[1] === word) {
            const charLocation = this.findCharacterDefinition(document, word);
            if (charLocation) {
                return charLocation;
            }
        }
        
        // Variables in string interpolation
        const varMatch = line.match(/\{(\w+)\}/);
        if (varMatch && varMatch[1] === word) {
            const varLocation = this.findVariableDefinition(document, word);
            if (varLocation) {
                return varLocation;
            }
        }
        
        return;
    }
    
    private findLabel(document: vscode.TextDocument, labelName: string): vscode.Location | null {
        const text = document.getText();
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const labelMatch = lines[i].match(/==\s*(\w+)\s*==/);
            if (labelMatch && labelMatch[1] === labelName) {
                const position = new vscode.Position(i, 0);
                return new vscode.Location(document.uri, position);
            }
        }
        
        return null;
    }
    
    private findCharacterDefinition(document: vscode.TextDocument, charName: string): vscode.Location | null {
        const text = document.getText();
        const lines = text.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const charMatch = lines[i].match(/@char\s+(\w+)/);
            if (charMatch && charMatch[1] === charName) {
                const position = new vscode.Position(i, 0);
                return new vscode.Location(document.uri, position);
            }
        }
        
        return null;
    }
    
    private findVariableDefinition(document: vscode.TextDocument, varName: string): vscode.Location | null {
        const text = document.getText();
        const lines = text.split('\n');
        
        // Find first assignment of the variable
        for (let i = 0; i < lines.length; i++) {
            const varMatch = lines[i].match(/~\s*(\w+)\s*=/);
            if (varMatch && varMatch[1] === varName) {
                const position = new vscode.Position(i, lines[i].indexOf(varName));
                return new vscode.Location(document.uri, position);
            }
        }
        
        return null;
    }
}