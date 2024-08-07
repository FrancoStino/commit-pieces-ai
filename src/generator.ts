import * as vscode from "vscode";  // Importa il modulo vscode
import { config } from "./config";  // Importa la configurazione personalizzata
import * as Pieces from '@pieces.app/pieces-os-client';  // Importa il client Pieces
import { port } from "./types/os";


// Configura l'istanza dell'API
const configuration = new Pieces.Configuration({
    basePath: `http://localhost:${port}`
});
const apiInstance = new Pieces.QGPTApi(configuration);
const modelsApiInstance = new Pieces.ModelsApi(configuration);

const { modelName } = config.inference;

// Funzione per ottenere i modelli disponibili
const getAvailableModels = async (): Promise<Pieces.Model[]> => {
    try {
        const modelsSnapshot = await modelsApiInstance.modelsSnapshot();
        return modelsSnapshot.iterable || [];
    } catch (error) {
        console.error('Error fetching models:', error);
        throw error;
    }
};

// Funzione per selezionare un modello
const selectModel = (models: Pieces.Model[]): string => {
    // Per questo esempio, selezioniamo il primo modello disponibile
    // In un'applicazione reale, potresti implementare una logica più sofisticata per la selezione
    if (models.length > 0 && models[0]?.id) {
        console.log(models);
        console.log(`Selected models: `, models.filter(model => model.unique === modelName).map(model => model.unique));
        const selectedModel = models.filter(model => model.cloud === true && model.unique === "gemini-1.5-pro")[0];
        if (selectedModel && selectedModel.id) {
            return selectedModel.id;
        }
    }
    throw new Error('No models available');
};

export async function getSummary(diff: string): Promise<string> {

    const { summaryPrompt, summaryTemperature } =
        config.inference;
    // Ottieni i modelli disponibili
    const availableModels = await getAvailableModels();

    // Seleziona un modello
    const selectedModelId = selectModel(availableModels);

    // Definisci il prompt di sistema come testo che precede la domanda
    const defaultSummaryPrompt = `You are an expert developer specialist in creating commits.
	Provide a super concise one sentence overall changes summary of the user \`git diff\` output following strictly the next rules:
	- Do not use any code snippets, imports, file routes or bullets points.
	- Do not mention the route of file that has been change.
	- Simply describe the MAIN GOAL of the changes.
	- Output directly the summary in plain text.`;

    const prompt = summaryPrompt || defaultSummaryPrompt;

    // Combina il prompt di sistema con la query
    const fullQuery = `${prompt}\n\nHere is the \`git diff\` output: ${diff}`;

    // Definisci i parametri per la richiesta API
    const params = {
        query: fullQuery,
        relevant: {
            iterable: []
        },
        model: selectedModelId
    };


    try {
        // Invia la query all'API e ottieni il risultato
        const result = await apiInstance.question({ qGPTQuestionInput: params });

        // Verifica se esistono risposte e restituisci il testo della prima risposta
        if (result.answers && result.answers.iterable && result.answers.iterable.length > 0) {
            const firstAnswer = result.answers.iterable[0];
            if (firstAnswer && firstAnswer.text) {
                return firstAnswer.text
                    .trimStart()
                    .split("\n")
                    .map((v) => v.trim())
                    .join("\n");
            } else {
                throw new Error('First answer is missing text.');
            }
        } else {
            throw new Error('No answers found');
        }

    } catch (error: any) {
        if (error?.status_code === 404) {
            const errorMessage =
                error.message.charAt(0).toUpperCase() + error.message.slice(1);

            vscode.window
                .showErrorMessage(errorMessage, "Go to Pieces website")
                .then((action) => {
                    if (action === "Go to Pieces website") {
                        vscode.env.openExternal(
                            vscode.Uri.parse("https://pieces.app/"),
                        );
                    }
                });

            throw new Error();
        }

        throw new Error(
            "Unable to connect to ollama. Please, check that ollama is running.",
        );
    }
}


export async function getCommitMessage(summaries: string[]) {
    const {
        commitPrompt,
        commitTemperature,
        useEmojis,
        commitEmojis,
        modelName,
    } = config.inference;

    // Ottieni i modelli disponibili
    const availableModels = await getAvailableModels();

    // Seleziona un modello
    const selectedModelId = selectModel(availableModels);

    // Definisci il prompt di sistema come testo che precede la domanda
    const defaultCommitPrompt = `You are an expert developer specialist in creating commits messages.
	Your only goal is to retrieve a single commit message. 
	Based on the provided user changes, combine them in ONE SINGLE commit message retrieving the global idea, following strictly the next rules:
	- Always use the next format: \`{type}: {commit_message}\` where \`{type}\` is one of \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\`, \`chore\`, \`revert\`.
	- Output directly only one commit message in plain text.
	- Be as concise as possible. 50 characters max.
	- Do not add any issues numeration nor explain your output.`;


    const prompt = commitPrompt || defaultCommitPrompt;

    // Combina il prompt di sistema con la query
    const fullQuery = `${prompt}\n\nHere are the summaries changes: ${summaries.join(", ")}`;

    // Definisci i parametri per la richiesta API
    const params = {
        query: fullQuery,
        relevant: {
            iterable: []
        },
        model: selectedModelId
    };


    try {
        // Invia la query all'API e ottieni il risultato
        const result = await apiInstance.question({ qGPTQuestionInput: params });

        // Verifica se esistono risposte e restituisci il testo della prima risposta
        if (result.answers && result.answers.iterable && result.answers.iterable.length > 0) {
            const firstAnswer = result.answers.iterable[0];

            if (firstAnswer && firstAnswer.text) {
                var commit = firstAnswer.text.replace(/["`]/g, "");

                // Add the emoji to the commit if activated
                if (useEmojis) {
                    const emojisMap = JSON.parse(JSON.stringify(commitEmojis));
                    for (const [type, emoji] of Object.entries(emojisMap)) {
                        const regex = new RegExp(`\\b${type}\\b`, "g");
                        commit = commit.replace(regex, `${type} ${emoji}`);
                    }
                }

                return commit.trim();
            } else {
                throw new Error('First answer is missing text.');
            }
        } else {
            throw new Error('No answers found');
        }

    } catch (error) {
        console.error('Error calling API:', error);
        throw error;
    }
}
