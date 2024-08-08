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
        const models = modelsSnapshot.iterable || [];
        const selectedModel = models.find(model => model.cloud === true && model.unique === modelName);
        if (selectedModel) {
            return selectedModel.id;
        }
        throw new Error('The model: "' + modelName + '" is not available');
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
};

