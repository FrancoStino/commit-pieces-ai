import { workspace } from "vscode";
import * as Pieces from '@pieces.app/pieces-os-client';
import os from 'os';

class Config {
    get inference() {
        const config = this.#config;

        // Load model
        const modelName: string = config.get("model") as string;
        // if (modelName === "custom") {
        //     modelName = config.get("custom.model") as string;
        // }

        // Load Emojis Config
        const useEmojis: boolean =
            config.get("useEmojis") as boolean;
        const commitEmojis: string[] =
            config.get("commitEmojis") as string[];

        /**
         * Configures the Pieces OS client with the appropriate base path based on the current platform.
         * On Linux, the base path is set to `http://localhost:5323`, while on other platforms it is set to `http://localhost:1000`.
        */
        const platform = os.platform();
        const port = platform === 'linux' ? 5323 : 1000;

        // Load Url
        const piecesConfig = workspace.getConfiguration("pieces");
        let piecesCustomUrl = piecesConfig.get("customUrl") as string;
        let url: string = piecesCustomUrl || `http://localhost:${port}`
        if (url.endsWith("/")) {
            url = url.slice(0, -1).trim()
        }

        const configurationUrl = new Pieces.Configuration({
            basePath: url
        });

        // Load custom prompt and temperatures
        const summaryPrompt = config.get("custom.summaryPrompt") as string;
        // const summaryTemperature = config.get("custom.summaryTemperature") as number;
        const commitPrompt = config.get("custom.commitPrompt") as string;
        // const commitTemperature = config.get("custom.commitTemperature") as number;

        return {
            modelName,
            summaryPrompt,
            // summaryTemperature,
            commitPrompt,
            // commitTemperature,
            useEmojis,
            commitEmojis,
            configurationUrl,
        };
    }

    get #config() {
        return workspace.getConfiguration("commit-pieces-ai");
    }
}

export const config = new Config();