// Check os type
import * as Pieces from '@pieces.app/pieces-os-client';
import os from 'os';


const platform = os.platform();  // Ottieni il sistema operativo corrente
let port = 1000;

// Definisce la porta in base al sistema operativo. Per Linux, la porta è 5323, per macOS/Windows, la porta è 1000.
if (platform === 'linux') {
    port = 5323;
} else {
    port = 1000;
}
export const configurationPort = new Pieces.Configuration({
    basePath: `http://localhost:${port}`
});