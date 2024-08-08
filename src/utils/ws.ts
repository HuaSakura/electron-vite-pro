let websocket: WebSocket;
let connectedURLs: string[] = [];

function initws(messageCallback: (message: string) => void) {
    let wsAddr: any = localStorage.getItem('wsAddr') ? localStorage.getItem('wsAddr') : 'ws://127.0.0.1:5678/link_screen'
    function connectWebSocket() {
        if (connectedURLs.includes(wsAddr)) {
            return;
        }

        websocket = new WebSocket(wsAddr);
        websocket.onopen = () => {
            connectedURLs.push(wsAddr);
        };

        websocket.onmessage = (event: any) => {
            const message = event.data;
            messageCallback(message);
        };

        websocket.onclose = () => {
            const index = connectedURLs.indexOf(wsAddr);
            if (index !== -1) {
                connectedURLs.splice(index, 1);
            }
            setTimeout(connectWebSocket, 1000);
        };
    }

    connectWebSocket();
}

export {initws};
