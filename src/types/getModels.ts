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
import { configurationPort } from "./os";
import { config } from '../config';


// Configure the Models API instance
const modelsApiInstance = new Pieces.ModelsApi(configurationPort);

// Define a function to get the selected model
export const getSelectedModel = async (): Promise<string> => {
    const { modelName } = config.inference;

    try {
        const modelsSnapshot = await modelsApiInstance.modelsSnapshot();
        const selectedModel = modelsSnapshot.iterable?.find(model => model.cloud && model.unique === modelName);
        console.log(selectedModel?.unique);

        if (selectedModel) {
            return selectedModel.id;
        }

        throw new Error(`The model: "${modelName}" is not available`);
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
};

