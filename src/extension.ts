// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('multiincrement has been loaded');

	function sortByPosition(a: vscode.Selection, b: vscode.Selection) {
		return a.anchor.line === b.anchor.line
			? a.anchor.character - b.anchor.character
			: a.anchor.line - b.anchor.line;
	}

	function isValidNumber(text: string) {
		return /^\d+(\.\d+)?$/.test(text);
	}

	function incrementSelectionsBy(increment: number) {
		const selections = vscode.window.activeTextEditor?.selections;
		
		vscode.window.activeTextEditor?.edit(editBuilder => {
			// const orderedSelections = [];
			// orderedSelections.or

			if (!selections) {
				return;
			}

			(<vscode.Selection[]>selections).sort(sortByPosition).forEach((selection, i) => {
				// orderedSelections.push(selection);
				const text = vscode.window.activeTextEditor?.document.getText(selection);
				if (!text) {
					return;
				}
				const number = parseFloat(text);
				if (isNaN(number)) {
					return;
				}
				const toIncrement = (i + 1) * increment;
				const newText = (number + toIncrement).toString();
				editBuilder.replace(selection, newText);
			});
		});
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('multiincrement.incrementAccumulative', async () => {		
		const input = await vscode.window.showInputBox({
			title: 'Enter the increment value',
			value: '1',
			validateInput: (text: string) => {
				if (!isValidNumber(text)) {
					return 'Please enter a valid number';
				}
				return null;
			}
		});
		if (!input) {
			vscode.window.showErrorMessage('Invalid input');
			return;
		}
		const increment = parseFloat(input);
		incrementSelectionsBy(increment);
	});

	const disposable2 = vscode.commands.registerCommand('multiincrement.incrementBy1Accumulative', () => {		
		incrementSelectionsBy(1);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
