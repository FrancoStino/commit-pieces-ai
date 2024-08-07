# Commit Pieces for Developer AI

Commit Pieces for Developer AI is a Visual Studio Code extension that uses the Pieces for Developer to enhance the code commit process.

## Configuration

To use Commit Pieces for Developer AI, you need to install **[Pieces for Developer](https://pieces.app/)**. Follow these steps:

1. You don't need any API key to use Commit Pieces for Developer.
2. Click on the Sparkle icon in the Source Control icon in the VS Code toolbar.
3. Open the VS Code settings (File > Preferences > Settings).
4. Search for "Commit Pieces for Developer" in the settings to customize it.
5. Enjoy!

<!-- 
## Reset API Key

1. `CTRL+SHIFT+P` or `CMD+SHIFT+P`
2. Type "Reset Pieces for Developer API Key" -->


## Settings

This extension contributes the following settings:

- "Run Commit Pieces for Developer": automatically generates a commit message for your commit.
<!-- - "Reset API Commit Pieces for Developer": resets your API key. -->

- Model: You can select the model from the plugin configuration.

`gpt-4o` - default

`gpt-4`

`gpt-3.5-turbo`

`gemini-1.5-pro`


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
- [Commit Pieces for Developer AI GitHub Repository](https://github.com/FrancoStino/commit-pieces-ai)

**Happy coding with Commit Pieces for Developer AI!**