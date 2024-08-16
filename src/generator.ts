import { config } from "./config";  // Import the custom configuration
import * as Pieces from '@pieces.app/pieces-os-client';  //Import client Pieces
import { getSelectedModel } from './types/getModels';


// Define a function to get the summary
export async function getSummary(diff: string): Promise<string> {

    const {
        summaryPrompt,
        configurationUrl
        // summaryTemperature
    } = config.inference;

    const apiInstance = new Pieces.QGPTApi(configurationUrl);

    const selectedModelId = await getSelectedModel();

    // Define the system prompt as a text that precedes the question
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
        console.error(`Error: ${error.message}, statusCode: ${error?.status_code}`);

        throw new Error(`Error calling API: ${error.message} (Status code: ${error.status_code || 'Unknown'})`);
    }
}


export async function getCommitMessage(summaries: string[]) {
    const {
        configurationUrl,
        commitPrompt,
        // commitTemperature,
        useEmojis,
        commitEmojis,
    } = config.inference;

    const apiInstance = new Pieces.QGPTApi(configurationUrl);

    const selectedModelId = await getSelectedModel();

    // Define the system prompt as text that precedes the question
    const defaultCommitPrompt = `You are an expert developer specialist in creating commits messages.
	Your only goal is to retrieve a single commit message. 
	Based on the provided user changes, combine them in ONE SINGLE commit message retrieving the global idea, following strictly the next rules:
	- Always use the next format: \`{type}: {commit_message}\` where \`{type}\` is one of \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\`, \`chore\`, \`revert\`.
	- Output directly only one commit message in plain text.
	- Be as concise as possible. 50 characters max.
	- Do not add any issues numeration nor explain your output.`;


    const prompt = commitPrompt || defaultCommitPrompt;

    // Combine the system prompt with the query
    const fullQuery = `${prompt}\n\nHere are the summaries changes: ${summaries.join(", ")}`;

    // Define the parameters for the API request
    const params = {
        query: fullQuery,
        relevant: {
            iterable: []
        },
        model: selectedModelId
    };


    try {
        // Send the query to the API and get the result
        const result = await apiInstance.question({ qGPTQuestionInput: params });

        // Check if there are answers and return the text of the first answer
        if (result.answers && result.answers.iterable && result.answers.iterable.length > 0) {
            const firstAnswer = result.answers.iterable[0];

            if (firstAnswer && firstAnswer.text) {
                let commit = firstAnswer.text.replace(/["`]/g, "");

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

    } catch (error: any) {
        console.error('Error calling API:', error);
        throw new Error(`Error calling API: ${error.message} (Status code: ${error.status_code || 'Unknown'})`);
    }
}
