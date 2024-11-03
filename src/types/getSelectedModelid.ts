/**
 * Retrieves the selected model from the Pieces Models API.
 *
 * This function fetches the available models from the Pieces Models API and
 * returns the ID of the selected model based on the configuration. If the
 * selected model is not available, an error is thrown.
 *
 * @returns {Promise<string>} The ID of the selected model.
 * @throws {Error} If the selected model is not available.
 */
import * as Pieces from '@pieces.app/pieces-os-client'; // Import client Pieces
import { createConfig } from '../config';
import * as vscode from 'vscode';
import { fetchModels } from './fetchModels';

// Define a function to get the selected model
export async function getSelectedModelid(context: vscode.ExtensionContext): Promise<string | undefined> {
    const config = createConfig(context);
    const inferenceConfig = await config.getInferenceConfig();
    const { configurationUrl } = inferenceConfig;

    // Check if the selected model exists
    try {
        if (!inferenceConfig.modelName) {
            await fetchModels(context);
        }
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }

    const selectedModelUnique = inferenceConfig.modelName;
    const modelsApiInstance = new Pieces.ModelsApi(configurationUrl);

    try {
        const modelsSnapshot = await modelsApiInstance.modelsSnapshot();
        const selectedModel = modelsSnapshot.iterable?.find(model => model.unique === selectedModelUnique);
        console.log(selectedModel?.unique);

        if (selectedModel) {
            return selectedModel.id;
        }

    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
}