// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import authorize from './commands/authorize';
import sumbit_current_file from './commands/submit_task';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('sort-me-integration.authorize', () => authorize(context)));
	context.subscriptions.push(vscode.commands.registerCommand('sort-me-integration.submit-current-file', () => sumbit_current_file(context)));
}

// This method is called when your extension is deactivated
export function deactivate() {}
