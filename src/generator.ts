import { config } from "./config";
import { getSelectedModel } from './types/getModels';
import * as Pieces from '@pieces.app/pieces-os-client';

/**
 * Generates a concise summary of the changes in a Git repository.
 *
 * This function takes the output of `git diff` as input, and uses a QGPT API to generate a one-sentence summary of the changes.
 * The summary is generated based on a prompt that can be customized in the configuration.
 *
 * @param {string} diff - The output of `git diff`, representing the changes in the repository.
 * @return {string} A concise one-sentence summary of the changes.
 */
export async function getSummary(diff: string): Promise<string> {

    if (!diff || typeof diff !== 'string' || diff.trim() === '') {
        throw new Error('Invalid input: `diff` must be a non-empty string');
    }

    const { summaryPrompt, configurationUrl } = config.inference;
    const apiInstance = new Pieces.QGPTApi(configurationUrl);
    const selectedModelId = await getSelectedModel();

    const defaultSummaryPrompt = `You are an expert developer specialist in creating commits.
	Provide a super concise one sentence overall changes summary of the user \`git diff\` output following strictly the next rules:
	- Do not use any code snippets, imports, file routes or bullets points.
	- Do not mention the route of file that has been change.
	- Simply describe the MAIN GOAL of the changes.
	- Output directly the summary in plain text.`;

    const prompt = summaryPrompt || defaultSummaryPrompt;
    const fullQuery = `${prompt}\n\nHere is the \`git diff\` output: ${diff}`;

    const params = {
        query: fullQuery,
        relevant: { iterable: [] },
        model: selectedModelId
    };

    try {
        const result = await apiInstance.question({ qGPTQuestionInput: params });

        if (result.answers?.iterable?.[0]?.text) {
            return result.answers.iterable[0].text.trim().replace(/\n/g, ' ');
        } else {
            throw new Error('No valid answer found');
        }
    } catch (error: any) {
        const statusCode = error?.status_code || 'Unknown';
        const errorMessage = `Error calling API: ${error.message} (Status code: ${statusCode})`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}

/**
 * Generates a commit message based on the provided summaries of changes.
 *
 * @param {string[]} summaries - An array of summaries of changes.
 * @return {Promise<string>} A promise that resolves to the generated commit message.
 */
export async function getCommitMessage(summaries: string[]): Promise<string> {
    const { configurationUrl, commitPrompt, useEmojis, commitEmojis } = config.inference;
    const apiInstance = new Pieces.QGPTApi(configurationUrl);
    const selectedModelId = await getSelectedModel();

    const defaultCommitPrompt = `You are an expert developer specialist in creating commits messages.
	Your only goal is to retrieve a single commit message. 
	Based on the provided user changes, combine them in ONE SINGLE commit message retrieving the global idea, following strictly the next rules:
	- Always use the next format: \`{type}: {commit_message}\` where \`{type}\` is one of \`feat\`, \`fix\`, \`docs\`, \`style\`, \`refactor\`, \`test\`, \`chore\`, \`revert\`.
	- Output directly only one commit message in plain text.
	- Be as concise as possible. 50 characters max.
	- Do not add any issues numeration nor explain your output.`;

    const prompt = commitPrompt || defaultCommitPrompt;
    const fullQuery = `${prompt}\n\nHere are the summaries changes: ${summaries.join(", ")}`;

    const params = {
        query: fullQuery,
        relevant: { iterable: [] },
        model: selectedModelId
    };

    try {
        const result = await apiInstance.question({ qGPTQuestionInput: params });

        if (result.answers?.iterable?.[0]?.text) {
            let commit = result.answers.iterable[0].text.replace(/["`]/g, "").trim();

            if (useEmojis) {
                const emojisMap = new Map(Object.entries(commitEmojis));
                for (const [type, emoji] of emojisMap) {
                    const regex = new RegExp(`\\b${type}\\b`, "g");
                    commit = commit.replace(regex, `${type} ${emoji}`);
                }
            }

            return commit;
        } else {
            throw new Error('No valid answer found');
        }
    } catch (error: any) {
        console.error('Error calling API:', error);
        throw new Error(`Error calling API: ${error.message} (Status code: ${error.status_code || 'Unknown'})`);
    }
}
