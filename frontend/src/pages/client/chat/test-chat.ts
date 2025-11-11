import { ACCESS_TOKEN_STORAGE_KEY } from "@/constant/SecurityConstant";
import { Client } from "@stomp/stompjs";

const ACCESS_TOKEN = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

export const client = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
    debug: (str) => {
        console.log(str);
    },
    onConnect: () => {
        console.log("Connected to WebSocket server");
        client.subscribe("/topic/conversations/1", (message) => {
            console.log("Received message:", message.body);
        });
        client.publish({
            destination: "/app/conversations/1/send-message",
            body: JSON.stringify({ content: "Hello, World!" }),
        });
    },
});
