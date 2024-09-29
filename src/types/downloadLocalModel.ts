import * as vscode from 'vscode';
import * as Pieces from '@pieces.app/pieces-os-client';
import { createConfig } from '../config';


export const downloadLocalModel = async (context: vscode.ExtensionContext) => {
    const config = createConfig(context);
    const inferenceConfig = await config.getInferenceConfig();
    const { configurationUrl } = inferenceConfig;




    const selectedModelId = inferenceConfig.modelName;


    const modelsApiInstance = new Pieces.ModelsApi(configurationUrl);
}



