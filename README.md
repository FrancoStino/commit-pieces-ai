<div align="center">

# Commit AI - Pieces for Developers

<img src="assets/icon.png" width="35%">

---

[![Version][version-badge]][marketplace-url]
[![Installs][installs-badge]][marketplace-url]
[![Rating][rating-badge]][marketplace-url]
[![License][license-badge]][license-url]
[![Pieces for Developers][pieces-badge]][pieces-url]

[version-badge]: https://img.shields.io/visual-studio-marketplace/v/DavideLadisa.commit-pieces-ai?style=for-the-badge
[installs-badge]: https://img.shields.io/visual-studio-marketplace/i/DavideLadisa.commit-pieces-ai?style=for-the-badge&color=red
[rating-badge]: https://img.shields.io/visual-studio-marketplace/r/DavideLadisa.commit-pieces-ai?style=for-the-badge
[license-badge]: https://img.shields.io/github/license/FrancoStino/commit-pieces-ai?style=for-the-badge
[pieces-badge]: https://img.shields.io/badge/pieces-for%20developers-191919?style=for-the-badge&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAB3UlEQVQoz11TTWgTQRj9IGya7UpEPMVuLagYkQr%20QOpRtOBJBBc8eyqCIHgrrYRiipeCCF715E2rULEU3cZWIqXUCtp68Kg0a8EF0WgS7TrveZidZDff6c03b773zTdvROJwxBusToXv%20Y8kqcKNWsUbcqQnhrN%20OWqyJ6KWXznWl6CV8sFLs6nYYAOqQ64vlfaYalbwQif%2F8g6KyDDDI5jBn5j6dXmkT0Tysj6pEy2eR4F3sYmPuIcBnoXpZXXaEbmyL%2FqllzdwEAGM5DaLuG5WratDUr2p8Q%2FafIbkVXzY%2FB7j2rSEbzVcQp5tfsElnMYsSHKHe7EQHw03hTsazilXkRcxigpy3AIJunhsNJQYoSfKVeBR9RCkjTcgt2Bxo9NMh%2FiIriJP4AGIfvWa5DWcRLfpjvSschU5hlG00a8WOAGHK12eknBNo6fKVWSdh3gAGea4H4uJGYQfpDah4XM1oEjyJ%20%2FDwm20Uq9euyVjhahBkqvIcRsk%20RkZfkpNNGp6g%20LIq3FthlM4gxUsYwTnkOJxfSovInLcCudJss4LyMLGZXxL0YLF4ayx2a5gXiebaKeLse6XdiccediaGzfmSPT22y8Xsz0et8UrVCeDtXiuUfiuWvbc7lf4Dx%2FMT2rumNvaAAAAAElFTkSuQmCC
[marketplace-url]: https://marketplace.visualstudio.com/items?itemName=DavideLadisa.commit-pieces-ai
[license-url]: https://github.com/FrancoStino/commit-pieces-ai/blob/main/LICENSE
[pieces-url]: https://pieces.app/

</div>

---

Commit AI - Pieces for Developers is a Visual Studio Code extension that uses the Pieces for Developers to enhance the code commit process.

## Configuration

To use Commit AI - Pieces for Developers, you need to install **[Pieces for Developers](https://pieces.app/)**. Follow these steps:

1. You don't need any API key to use Commit AI - Pieces for Developers.
2. Click on the Sparkle icon in the Source Control icon in the VS Code toolbar for use it.
3. Open the VS Code settings (File > Preferences > Settings).
4. Search for "Commit AI - Pieces for Developers" in the settings to customize it.
5. Enjoy!

## Features

![Commit Groq Demo](assets/commitpiecesai-demo.gif)

-   Automatic generation of commit messages based on modified code.
-   Code analysis for improvement suggestions before committing.
-   Seamless integration with Git workflow in VS Code.
-   Ability to translate commit messages into multiple languages.

## Usage

<!-- Insert icon svg Sparkle -->

1. Make your code changes as usual.
2. When you're ready to commit, use icon "Sparkle" in the Source Control toolbar or you can use the `Commit AI - Pieces for Developers: Create Commit"` command from the command palette `CTRL+SHIFT+P` or `CMD+SHIFT+P`.
3. The extension will generate a commit message based on your changes.
4. Review and modify the message if necessary, then proceed with the commit.

#### Get Models

1. Go to settings -> Search for "Commit AI - Pieces for Developers" -> Model
2. Click on link "Get Pieces for Developers Models"

###### OR

1. `CTRL+SHIFT+P` or `CMD+SHIFT+P`
2. Type "Get Pieces for Developers Models"

## Settings

This extension contributes the following settings:

-   Model: You can select the model from the plugin configuration (Cloud):

-   Use Emojis: It allows you to enable or disable the use of emojis in commit messages.

-   Custom Emojis: It allows you to write down the emojis you want to use in the next template object in the VSCode config.json.

```json
 "commit-pieces-ai.commitEmojis": {
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

-   Custom Summary Prompt: The prompt that will be used to generate the summary of all git diff.

-   Custom Commit Prompt: The prompt that will be used to generate the commit message.

-   Use Description: It allows you to enable or disable the use of commit description.

-   Number of characters: It allows you to select the number of characters for the commit message.

-   Commit Language: It allows you to select the language for the commit message translation.
    <table>
        <thead>
            <tr>
                <th>Languages</th>
            </tr>
        </thead>
        <tbody>
            <tr><td>🇬🇧 English</td></tr>
            <tr><td>🇨🇳 Mandarin Chinese</td></tr>
            <tr><td>🇮🇳 Hindi</td></tr>
            <tr><td>🇪🇸 Spanish</td></tr>
            <tr><td>🇫🇷 French</td></tr>
            <tr><td>🇮🇹 Italian</td></tr>
            <tr><td>🇸🇦 Arabic</td></tr>
            <tr><td>🇧🇩 Bengali</td></tr>
            <tr><td>🇷🇺 Russian</td></tr>
            <tr><td>🇵🇹 Portuguese</td></tr>
            <tr><td>🇯🇵 Japanese</td></tr>
        </tbody>
    </table>

-   Force Commit Lowercase: It allows you to enable or disable the lowercase of the commit message.

-   Force Commit Without dot at the end: It allows you to enable or disable the commit message without dot at the end.

## Known Issues

There are currently no known issues. If you encounter any problems, please open an issue on our GitHub repository.

---

## For more information

-   [Pieces for Developer Documentation](https://docs.pieces.app/)
-   [Commit AI - Pieces for Developers GitHub Repository](https://github.com/FrancoStino/commit-pieces-ai)

---

> ## Note
>
> **This extension is a community project and not officially supported by Pieces for Developers team.** <img src="https://cdn.discordapp.com/emojis/1099134036481413140.gif?size=40">

---

**Happy coding with Commit AI - Pieces for Developers!**
