"use client";

import type { ReactNode } from "react";
import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    type ChatModelAdapter,
} from "@assistant-ui/react";

const MyModelAdapter: ChatModelAdapter = {
    async *run({ messages, abortSignal }) {
        const lastMessage = messages[messages.length - 1];
        const lastMessageText =
            lastMessage.content.find((part) => part.type === "text")?.text || "";

        const request = {
            message: lastMessageText,
            conversationId: "example-conversation-id",
        };
        // TODO replace with your own API
        const result = await fetch("http://localhost:8080/ai/chat/stream", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
            signal: abortSignal,
        });
        if (!result.ok) {
            throw new Error(`API error: ${result.status} ${result.statusText}`);
        }

        // const data = await result.text();
        //
        // return {
        //     content: [
        //         {
        //             type: "text",
        //             text: data,
        //         },
        //     ],
        // };

        if (!result.body) {
            throw new Error("No response body");
        }

        const reader = result.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let fullContent = "";
        let buffer = "";
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.startsWith("data:")) {
                        const dataChunk = line.substring(5);
                        if (dataChunk === "") {
                            fullContent += "\n";
                        } else {
                            try {
                                fullContent += JSON.parse(dataChunk);
                            } catch (e) {
                                fullContent += dataChunk;
                            }
                        }
                    } else if (line) {
                        fullContent += line;
                    }
                }

                if (fullContent) {
                    yield {
                        content: [
                            {
                                type: "text",
                                text: fullContent,
                            },
                        ],
                    };
                }
            }

            if (buffer.startsWith("data: ")) {
                fullContent += buffer.substring(6);
            } else if (buffer) {
                fullContent += buffer;
            }

            yield {
                content: [{ type: "text", text: fullContent }],
            };
        } catch (error) {
            yield {
                content: [
                    {
                        type: "text",
                        text: "\n\n[Có lỗi xảy ra khi nhận phản hồi từ máy chủ.]",
                    },
                    {
                        type: "text",
                        text: `\n\n[Chi tiết lỗi: ${(error as Error).message}]`,
                    },
                ],
            };
        } finally {
            reader.releaseLock();
        }
    },
};

export function MyChatRuntimeProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const runtime = useLocalRuntime(MyModelAdapter);

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
        </AssistantRuntimeProvider>
    );
}
