# magic-arxiv-writer

> Chat-driven creation and editing of technical reports in Markdown using a public agent API.

## Features

- Generate and edit technical reports in Markdown via chat-driven instructions.
- Live Markdown preview.
- Chat-driven editing: request changes and see updates streamed in real time.
- No OpenAI SDK required—plain `fetch` calls to the OpenAI REST API.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. In the chat section, enter instructions to generate or edit your report (e.g. _"Generate an initial report for arXiv paper 2101.00001"_, _"Improve grammar"_, _"Add a conclusion"_).
2. Click **Send** to apply changes—updates will stream live into the document.

## License
MIT
