/**
 * Activates the "Commit Pieces AI" extension, which provides a command to generate a commit message based on the changes in the current Git repository.
 *
 * The extension listens for the "commit-pieces-ai.createCommit" command, which can be triggered either on a specific file or for all files in the current repository. It then generates a commit message based on the changes in the repository and sets it in the repository's input box.
 *
 * The extension uses the `vscode.git` extension to interact with the Git repository and the `getCommitMessage` and `getSummary` functions from the `generator` module to generate the commit message.
 *
 * @param context - The extension context, which is used to register the command and subscribe to the extension's lifecycle events.
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import type { GitExtension, Repository } from "./types/git";
import { getCommitMessage, getSummary } from './generator';
import { fetchModels } from './types/fetchModels';

export function activate(context: vscode.ExtensionContext) {
	const createCommitDisposable = vscode.commands.registerCommand("commit-pieces-ai.createCommit", async (uri?) => {
		const git = getGitExtension();
		if (!git) {
			vscode.window.showErrorMessage("Unable to load Git Extension");
			return;
		}

		if (uri) {
			const uriPath = uri._rootUri?.path || uri.rootUri.path;
			const selectedRepository = git.repositories.find((repository) => repository.rootUri.path === uriPath);
			if (selectedRepository) {
				await createCommitMessage(context, selectedRepository);
			}
		} else {
			for (const repo of git.repositories) {
				await createCommitMessage(context, repo);
			}
		}

	});

	const fetchModelsCommand = vscode.commands.registerCommand('commit-pieces-ai.fetchModels', async () => {
		await fetchModels(context);
	});

	context.subscriptions.push(createCommitDisposable, fetchModelsCommand);
}

async function getSummaryUriDiff(context: vscode.ExtensionContext, repo: Repository, uri: string) {
	const diff = await repo.diffIndexWithHEAD(uri);
	return await getSummary(context, diff);
}

async function createCommitMessage(context: vscode.ExtensionContext, repo: Repository) {
	vscode.window.withProgress(
		{
			location: vscode.ProgressLocation.SourceControl,
			cancellable: false,
			title: "Loading commit message",
		},
		async () => {
			vscode.commands.executeCommand("workbench.view.scm");
			try {
				const ind = await repo.diffIndexWithHEAD();

				if (ind.length === 0) {
					throw new Error("No changes to commit. Please stage your changes first.");
				}

				const summaries = await Promise.all(ind.map((change) => getSummaryUriDiff(context, repo, change.uri.fsPath)));
				const commitMessage = await getCommitMessage(context, summaries);
				repo.inputBox.value = commitMessage;
			} catch (error: any) {
				if (error?.message) {
					vscode.window.showErrorMessage(error.message);
				}
			}
		}
	);
}

function getGitExtension() {
	const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
	return vscodeGit?.exports?.getAPI(1);
}

export function deactivate() { }