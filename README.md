# Commit AI - Pieces for Developers


Commit AI - Pieces for Developers is a Visual Studio Code extension that uses the Pieces for Developers to enhance the code commit process.


## Configuration

To use Commit Pieces for Developers AI, you need to install **[Pieces for Developers](https://pieces.app/)**. Follow these steps:

1. You don't need any API key to use Commit Pieces for Developers.
2. Click on the Sparkle icon in the Source Control icon in the VS Code toolbar.
3. Open the VS Code settings (File > Preferences > Settings).
4. Search for "Commit Pieces for Developers" in the settings to customize it.
5. Enjoy!

<!--
## Reset API Key

1. `CTRL+SHIFT+P` or `CMD+SHIFT+P`
2. Type "Reset Pieces for Developer API Key" -->

## Features

![Commit Groq Demo](https://raw.githubusercontent.com/FrancoStino/commit-pieces-ai/main/assets/commitpiecesai-demo.gif)

- Automatic generation of commit messages based on modified code.
- Code analysis for improvement suggestions before committing.
- Seamless integration with Git workflow in VS Code.

## Usage

1. Make your code changes as usual.
2. When you're ready to commit, use the "Run Commit Pieces for Developers" command from the command palette (Ctrl+Shift+P).
3. The extension will generate a commit message based on your changes.
4. Review and modify the message if necessary, then proceed with the commit.

## Settings

This extension contributes the following settings:

- "Run Commit Pieces for Developers": automatically generates a commit message for your commit.
<!-- - "Reset API Commit Pieces for Developers": resets your API key. -->

- Model: You can select the model from the plugin configuration.

`chat-bison`

`claude-3-5-sonnet@20240620`

`claude-3-haiku@20240307`

`claude-3-opus@20240229`

`claude-3-sonnet@20240229`

`codechat-bison`

`gemini-1.5-flash`

`gemini-1.5-pro`

`gemini-pro`

`gpt-3.5-turbo`

`gpt-3.5-turbo-16k`

`gpt-4`

`gpt-4-turbo`

`gpt-4o` - default

`gpt-4o-mini`

Use Emojis: It allows you to enable or disable the use of emojis in commit messages.

Custom Emojis: It allows you to write down the emojis you want to use in the next template object in the VSCode config.json.

```json
 "commitollama.commitEmojis": {
  "feat": "✨",
  "fix": "🐛",
  "docs": "📝",
  "style": "💎",
  "refactor": "♻️",
  "test": "🧪",
  "chore": "📦",
  "revert": "⏪"
}
```

<!-- - Custom Endpoint: Ollama usually uses port 11434. It is the value that will be used if empty. -->

- Custom Summary Prompt: The prompt that will be used to generate the summary of all git diff.

- Custom Commit Prompt: The prompt that will be used to generate the commit message.

<!-- - Custom Summary Temperature: The temperature that will be used to generate the summary of all git diff. -->

<!-- - Custom Commit Temperature: The temperature that will be used to generate the commit message. -->

## Known Issues

There are currently no known issues. If you encounter any problems, please open an issue on our GitHub repository.

---

## For more information

- [Pieces for Developer Documentation](https://docs.pieces.app/)
- [Commit AI - Pieces for Developers GitHub Repository](https://github.com/FrancoStino/commit-pieces-ai)

**Happy coding with Commit AI - Pieces for Developers!**