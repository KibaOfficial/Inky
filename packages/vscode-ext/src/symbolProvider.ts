import * as vscode from 'vscode';

export class InkyScriptDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        const symbols: vscode.DocumentSymbol[] = [];
        const text = document.getText();
        const lines = text.split('\n');
        
        // Character definitions section
        const characters: vscode.DocumentSymbol[] = [];
        
        // Labels/Scenes section  
        const labels: vscode.DocumentSymbol[] = [];
        
        // Variables section
        const variablesSet = new Set<string>();
        const variableSymbols: vscode.DocumentSymbol[] = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Character definitions
            const charMatch = line.match(/@char\s+(\w+)/);
            if (charMatch) {
                const charName = charMatch[1];
                const charRange = new vscode.Range(i, 0, i, line.length);
                
                // Find the end of character definition
                let endLine = i;
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].trim() === '' || lines[j].match(/^(@char|==)/)) {
                        endLine = j - 1;
                        break;
                    }
                    if (j === lines.length - 1) {
                        endLine = j;
                    }
                }
                
                const fullRange = new vscode.Range(i, 0, endLine, lines[endLine].length);
                
                const charSymbol = new vscode.DocumentSymbol(
                    charName,
                    'Character',
                    vscode.SymbolKind.Class,
                    fullRange,
                    charRange
                );
                
                // Add character attributes as children
                for (let j = i + 1; j <= endLine; j++) {
                    const attrMatch = lines[j].match(/(\w+):\s*"([^"]+)"/);
                    if (attrMatch) {
                        const attrName = attrMatch[1];
                        const attrValue = attrMatch[2];
                        const attrRange = new vscode.Range(j, 0, j, lines[j].length);
                        
                        const attrSymbol = new vscode.DocumentSymbol(
                            `${attrName}: ${attrValue}`,
                            '',
                            vscode.SymbolKind.Property,
                            attrRange,
                            attrRange
                        );
                        
                        charSymbol.children.push(attrSymbol);
                    }
                }
                
                characters.push(charSymbol);
            }
            
            // Labels
            const labelMatch = line.match(/==\s*(\w+)\s*==/);
            if (labelMatch) {
                const labelName = labelMatch[1];
                const labelRange = new vscode.Range(i, 0, i, line.length);
                
                // Find end of label section (next label or end of file)
                let endLine = i;
                for (let j = i + 1; j < lines.length; j++) {
                    if (lines[j].match(/==\s*\w+\s*==/)) {
                        endLine = j - 1;
                        break;
                    }
                    if (j === lines.length - 1) {
                        endLine = j;
                    }
                }
                
                const fullRange = new vscode.Range(i, 0, endLine, lines[endLine].length);
                
                const labelSymbol = new vscode.DocumentSymbol(
                    labelName,
                    'Label',
                    vscode.SymbolKind.Method,
                    fullRange,
                    labelRange
                );
                
                labels.push(labelSymbol);
            }
            
            // Variables
            const varMatch = line.match(/~\s*(\w+)\s*(\+|-|\*|\/)?=/);
            if (varMatch) {
                const varName = varMatch[1];
                if (!variablesSet.has(varName)) {
                    variablesSet.add(varName);
                    const varRange = new vscode.Range(i, 0, i, line.length);
                    
                    const varSymbol = new vscode.DocumentSymbol(
                        varName,
                        'Variable',
                        vscode.SymbolKind.Variable,
                        varRange,
                        varRange
                    );
                    
                    variableSymbols.push(varSymbol);
                }
            }
        }
        
        // Create sections
        if (characters.length > 0) {
            const charSection = new vscode.DocumentSymbol(
                'Characters',
                `${characters.length} characters`,
                vscode.SymbolKind.Module,
                new vscode.Range(0, 0, lines.length - 1, 0),
                new vscode.Range(0, 0, 0, 0)
            );
            charSection.children = characters;
            symbols.push(charSection);
        }
        
        if (labels.length > 0) {
            const labelSection = new vscode.DocumentSymbol(
                'Labels/Scenes',
                `${labels.length} labels`,
                vscode.SymbolKind.Module,
                new vscode.Range(0, 0, lines.length - 1, 0),
                new vscode.Range(0, 0, 0, 0)
            );
            labelSection.children = labels;
            symbols.push(labelSection);
        }
        
        if (variableSymbols.length > 0) {
            const varSection = new vscode.DocumentSymbol(
                'Variables',
                `${variableSymbols.length} variables`,
                vscode.SymbolKind.Module,
                new vscode.Range(0, 0, lines.length - 1, 0),
                new vscode.Range(0, 0, 0, 0)
            );
            varSection.children = variableSymbols;
            symbols.push(varSection);
        }
        
        return symbols;
    }
}