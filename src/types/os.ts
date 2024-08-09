/**
 * Configures the Pieces OS client with the appropriate base path based on the current platform.
 * On Linux, the base path is set to `http://localhost:5323`, while on other platforms it is set to `http://localhost:1000`.
 */
import * as Pieces from '@pieces.app/pieces-os-client';
import os from 'os';

const platform = os.platform();
const port = platform === 'linux' ? 5323 : 1000;

export const configurationPort = new Pieces.Configuration({
    basePath: `http://localhost:${port}`
});