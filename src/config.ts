import { workspace, ExtensionContext } from "vscode";
import { fetchModels } from './types/fetchModels';
import * as Pieces from '@pieces.app/pieces-os-client';
import os from 'os';

class Config {
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    async getInferenceConfig() {
        const config = this.#config;

        let modelName: string = config.get("model") as string;


        // Load Emojis Config
        const useEmojis: boolean =
            config.get("useEmojis") as boolean;
        const commitEmojis: string[] =
            config.get("commitEmojis") as string[];
        const useDescription: boolean =
            config.get("useDescription") as boolean;

        /**
     * Configures the Pieces OS client with the appropriate base path based on the current platform.
     * On Linux, the base path is set to `http://localhost:5323`, while on other platforms it is set to `http://localhost:1000`.
        */
        const platform = os.platform();
        const port = platform === 'linux' ? 5323 : 1000;

        // Load Url
        const piecesConfig = workspace.getConfiguration("pieces");
        const piecesCustomUrl = piecesConfig.get("customUrl") as string;
        let url: string = piecesCustomUrl || `http://localhost:${port}`;
        if (url.endsWith("/")) {
            url = url.slice(0, -1).trim();
        }

        const configurationUrl = new Pieces.Configuration({
            basePath: url
        });

        // Load custom prompt and temperatures
        const summaryPrompt: string = config.get("custom.summaryPrompt") as string;
        // const summaryTemperature = config.get("custom.summaryTemperature") as number;
        const commitPrompt: string = config.get("custom.commitPrompt") as string;
        // const commitTemperature = config.get("custom.commitTemperature") as number;
        const forceCommitLowerCase: boolean = config.get('forceCommitLowerCase') as boolean;
        const forceCommitWithoutDotsAtEnd: boolean = config.get('forceCommitWithoutDotsAtEnd') as boolean;

        return {
            modelName,
            summaryPrompt,
            // summaryTemperature,
            commitPrompt,
            // commitTemperature,
            useEmojis,
            commitEmojis,
            useDescription,
            configurationUrl,
            forceCommitLowerCase,
            forceCommitWithoutDotsAtEnd
        };
    }

    get #config() {
        return workspace.getConfiguration("commit-pieces-ai");
    }
}

export const createConfig = (context: ExtensionContext): Config => new Config(context);