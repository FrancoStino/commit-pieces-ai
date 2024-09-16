import * as vscode from 'vscode';
import * as Pieces from '@pieces.app/pieces-os-client';
import { createConfig } from '../config';

export async function fetchModels(context: vscode.ExtensionContext) {
    const config = createConfig(context);
    let inferenceConfig;

    try {
        inferenceConfig = await config.getInferenceConfig();
    } catch (error) {
        vscode.window.showErrorMessage('Failed to get inference config: ' + (error instanceof Error ? error.message : 'Unknown error'));
        return;
    }

    const { configurationUrl } = inferenceConfig;
    const modelsApiInstance = new Pieces.ModelsApi(configurationUrl);

    try {
        const response = await modelsApiInstance.modelsSnapshot();

        if (!response || response.iterable.length === 0) {
            vscode.window.showErrorMessage('No models available from Pieces for Developers.');
            return;
        }

        const models = response.iterable;

        const modelsWithProvider = models.map((model: Pieces.Model) => {
            if (model.foundation && (model.foundation.includes('PHI'))) {
                return { ...model, provider: 'Microsoft' };
            }
            if (model.foundation && (model.foundation.includes('LLAMA'))) {
                return { ...model, provider: 'Meta' };
            }
            if (model.foundation && (model.foundation.includes('GEMMA'))) {
                return { ...model, provider: 'Google' };
            }
            if (model.foundation && (model.foundation.includes('GRANITE'))) {
                return { ...model, provider: 'IBM' };
            }
            return model;
        });

        const cloudModels = modelsWithProvider.filter(model => model.cloud === true);

        console.log(cloudModels);

        const modelItems = cloudModels.map((model) => ({
            label: model.unique ?? 'Unknown Model',
            description: model.provider && typeof model.provider === 'string' ? model.provider.toLowerCase().charAt(0).toUpperCase() + model.provider.toLowerCase().slice(1) : 'Unknown Provider',
            iconPath: vscode.Uri.file(context.asAbsolutePath(`assets/${(typeof model.provider === 'string' ? model.provider : '').toLowerCase().replace(/\s+/g, '-')}.webp`)),
        }))
            .sort((a, b) => a.description.localeCompare(b.description));

        const selectedModel = await vscode.window.showQuickPick(modelItems, {
            placeHolder: 'Select a model for commit generation'
        });

        if (selectedModel) {
            await vscode.workspace.getConfiguration().update('commit-pieces-ai.model', selectedModel.label, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Model "${selectedModel.label}" has been selected.`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to retrieve models from Pieces for Developers: ${errorMessage}`);
    }
}