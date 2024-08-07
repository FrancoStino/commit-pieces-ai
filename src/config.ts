import { workspace } from "vscode";
import os from 'os';


class Config {
    get inference() {
        const config = this.#config;

        // Load model
        let modelName: string = config.get("model") as string;
        if (modelName === "custom") {
            modelName = config.get("custom.model") as string;
        }

        // Load Emojis Config
        const useEmojis: boolean =
            config.get("useEmojis") as boolean;
        const commitEmojis: string[] =
            config.get("commitEmojis") as string[];

        // // Load endpoint
        // let endpoint: string =
        //     config.get("custom.endpoint") || "http://127.0.0.1:11434"
        // if (endpoint.endsWith("/")) {
        //     endpoint = endpoint.slice(0, -1).trim()
        // }

        // Load custom prompt and temperatures
        const summaryPrompt = config.get("custom.summaryPrompt") as string;
        const summaryTemperature = config.get("custom.summaryTemperature") as number;
        const commitPrompt = config.get("custom.commitPrompt") as string;
        const commitTemperature = config.get("custom.commitTemperature") as number;

        return {
            modelName,
            summaryPrompt,
            summaryTemperature,
            commitPrompt,
            commitTemperature,
            useEmojis,
            commitEmojis,
        };
    }

    get #config() {
        return workspace.getConfiguration("commit-pieces-ai");
    }
}

export const config = new Config();