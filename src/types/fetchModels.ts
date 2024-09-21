import * as vscode from 'vscode';
import * as Pieces from '@pieces.app/pieces-os-client';
import { createConfig } from '../config';
import { QuickPickItem, Disposable, QuickInputButton, QuickInput, QuickInputButtons } from 'vscode';

class InputFlowAction {
    static back = new InputFlowAction();
    static cancel = new InputFlowAction();
    static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
    title: string;
    step: number;
    totalSteps: number;
    items: T[];
    activeItem?: T;
    ignoreFocusOut?: boolean;
    placeholder: string;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

interface InputBoxParameters {
    title: string;
    step: number;
    totalSteps: number;
    value: string;
    prompt: string;
    validate: (value: string) => Promise<string | undefined>;
    buttons?: QuickInputButton[];
    ignoreFocusOut?: boolean;
    placeholder?: string;
    shouldResume: () => Thenable<boolean>;
}

class MultiStepInput {
    static async run<T>(start: InputStep) {
        const input = new MultiStepInput();
        return input.stepThrough(start);
    }

    private current?: QuickInput;
    private steps: InputStep[] = [];

    private async stepThrough<T>(start: InputStep) {
        let step: InputStep | void = start;
        while (step) {
            this.steps.push(step);
            if (this.current) {
                this.current.enabled = false;
                this.current.busy = true;
            }
            try {
                step = await step(this);
            } catch (err) {
                if (err === InputFlowAction.back) {
                    this.steps.pop();
                    step = this.steps.pop();
                } else if (err === InputFlowAction.resume) {
                    step = this.steps.pop();
                } else if (err === InputFlowAction.cancel) {
                    step = undefined;
                } else {
                    throw err;
                }
            }
        }
        if (this.current) {
            this.current.dispose();
        }
    }

    async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, ignoreFocusOut, placeholder, buttons, shouldResume }: P) {
        const disposables: Disposable[] = [];
        try {
            return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = vscode.window.createQuickPick<T>();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.ignoreFocusOut = ignoreFocusOut ?? false;
                input.placeholder = placeholder;
                input.items = items;
                if (activeItem) {
                    input.activeItems = [activeItem];
                }
                input.buttons = [
                    ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
                    ...(buttons || [])
                ];
                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidChangeSelection(items => resolve(items[0])),
                    input.onDidHide(() => {
                        (async () => {
                            reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
                        })()
                            .catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }

    async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, validate, buttons, ignoreFocusOut, placeholder, shouldResume }: P) {
        const disposables: Disposable[] = [];
        try {
            return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = vscode.window.createInputBox();
                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.value = value || '';
                input.prompt = prompt;
                input.ignoreFocusOut = ignoreFocusOut ?? false;
                input.placeholder = placeholder;
                input.buttons = [
                    ...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
                    ...(buttons || [])
                ];
                let validating = validate('');
                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidAccept(async () => {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;
                        if (!(await validate(value))) {
                            resolve(value);
                        }
                        input.enabled = true;
                        input.busy = false;
                    }),
                    input.onDidChangeValue(async text => {
                        const current = validate(text);
                        validating = current;
                        const validationMessage = await current;
                        if (current === validating) {
                            input.validationMessage = validationMessage;
                        }
                    }),
                    input.onDidHide(() => {
                        (async () => {
                            reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
                        })()
                            .catch(reject);
                    })
                );
                if (this.current) {
                    this.current.dispose();
                }
                this.current = input;
                this.current.show();
            });
        } finally {
            disposables.forEach(d => d.dispose());
        }
    }
}

export async function fetchModels(context: vscode.ExtensionContext) {
    const config = createConfig(context);
    let inferenceConfig;

    try {
        inferenceConfig = await config.getInferenceConfig();
    } catch (error) {
        vscode.window.showErrorMessage('Failed to get inference config: ' + (error instanceof Error ? error.message : 'Unknown error'));
        return;
    }

    const { configurationUrl } = inferenceConfig;
    const modelsApiInstance = new Pieces.ModelsApi(configurationUrl);

    try {
        const response = await modelsApiInstance.modelsSnapshot();

        if (!response || response.iterable.length === 0) {
            vscode.window.showErrorMessage('No models available from Pieces for Developers.');
            return;
        }

        const models = response.iterable;

        const modelsWithProvider = models.map((model: Pieces.Model) => {
            if (model.foundation && (model.foundation.includes('PHI'))) {
                return { ...model, provider: 'Microsoft' };
            }
            if (model.foundation && (model.foundation.includes('LLAMA'))) {
                return { ...model, provider: 'Meta' };
            }
            if (model.foundation && (model.foundation.includes('GEMMA'))) {
                return { ...model, provider: 'Google' };
            }
            if (model.foundation && (model.foundation.includes('GRANITE'))) {
                return { ...model, provider: 'IBM' };
            }
            return model;
        });

        const cloudModels = modelsWithProvider.filter(model => model.cloud === true);
        const localModels = modelsWithProvider.filter(model => model.cloud !== true && model.unique !== undefined);

        interface State {
            modelType: QuickPickItem;
            selectedModel: QuickPickItem;
        }

        async function collectInputs() {
            const state = {} as Partial<State>;
            await MultiStepInput.run(input => pickModelType(input, state));
            return state as State;
        }

        const title = 'Select Model';

        async function pickModelType(input: MultiStepInput, state: Partial<State>) {
            const modelTypes = [
                { label: 'Cloud Models', detail: 'Models hosted on the cloud', iconPath: new vscode.ThemeIcon('cloud') },
                { label: 'Local Models', detail: 'Models available locally', iconPath: new vscode.ThemeIcon('vm') }
            ];

            state.modelType = await input.showQuickPick({
                title,
                step: 1,
                totalSteps: 2,
                placeholder: 'Select model type',
                items: modelTypes,
                shouldResume: shouldResume
            });
            return (input: MultiStepInput) => pickModel(input, state);
        }

        async function pickModel(input: MultiStepInput, state: Partial<State>) {
            const modelsToShow = state.modelType!.label === 'Cloud Models' ? cloudModels : localModels;
            console.log('Models: ', modelsToShow);
            const modelItems = modelsToShow.map((model) => ({
                label: model.unique ?? 'Unknown Model',
                description: model.provider && typeof model.provider === 'string' ? model.provider.toLowerCase().charAt(0).toUpperCase() + model.provider.toLowerCase().slice(1) : 'Unknown Provider',
                iconPath: vscode.Uri.file(context.asAbsolutePath(`assets/${(typeof model.provider === 'string' ? model.provider : '').toLowerCase().replace(/\s+/g, '-')}.webp`)),
            })
            )
                .sort((a, b) => a.description.localeCompare(b.description));

            state.selectedModel = await input.showQuickPick({
                title,
                step: 2,
                totalSteps: 2,
                placeholder: 'Select a model for commit generation',
                items: modelItems,
                shouldResume: shouldResume
            });
        }

        function shouldResume() {
            return Promise.resolve(false);
        }

        const state = await collectInputs();

        if (state.selectedModel) {
            await vscode.workspace.getConfiguration().update('commit-pieces-ai.model', state.selectedModel.label, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Model "${state.selectedModel.label}" has been selected.`);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to retrieve models from Pieces for Developers: ${errorMessage}`);
    }
}