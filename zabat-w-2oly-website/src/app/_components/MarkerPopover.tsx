import React, { useRef, useEffect } from 'react'
import { Input } from '~/components/ui/input'
import TextType, { calculateTypingDuration } from '~/components/TextType';
import type { markerLocationType } from './Map';
import MessageThread from './MessageThread';

export interface conversationThread {
    author: "user" | "system";
    content: string;
    timestamp: Date;
    id: number
}

interface MarkerPopoverProps {
    markerLocation: markerLocationType
}

const MarkerPopover = ({ markerLocation }: MarkerPopoverProps) => {

    const states = ["idle", "processing", "informative"];
    const [state, setState] = React.useState("idle");
    const [conversation, setConversation] = React.useState<conversationThread[]>([]);

    const chatDisplay = useRef<HTMLDivElement | null>(null);

    const sendMessage = (content: string, author: "user" | "system" = "user") => {
        setConversation(prev => [
            ...prev,
            {
                author,
                content,
                timestamp: new Date(),
                id: Date.now() + Math.random()
            }
        ]);
    };

    // ✅ Scroll to bottom whenever conversation changes
    useEffect(() => {
        if (chatDisplay.current) {
            chatDisplay.current.scrollTop = chatDisplay.current.scrollHeight;
        }
    }, [conversation]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (state === "informative" && chatDisplay.current) {
            interval = setInterval(() => {
                if (chatDisplay.current) {
                    chatDisplay.current.scrollTop = chatDisplay.current.scrollHeight;
                }
            }, 1); // every 5ms
        }

        // cleanup when state changes or component unmounts
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [state, conversation]);

    return (
        <div className='flex flex-col'>
            <div className='mt-4 mb-4 text-4xl w-full flex justify-start items-center flex-col'>
                <div className="relative w-2/3 h-auto aspect-2/1 animate-floating">
                    {["idle", "processing", "informative"].map((imgState) => (
                        <img
                            key={imgState}
                            src={`/cloud-${imgState}.png`}
                            className={`absolute top-0 left-0 w-full scale-75 h-full object-cover transition-opacity duration-300 ${
                                state === imgState ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                            style={{ pointerEvents: state === imgState ? "auto" : "none" }}
                        />
                    ))}
                </div>
                <div className='w-full text-start mt-4'>
                    <div ref={chatDisplay} className='max-h-96 overflow-y-scroll pr-3'>
                        {conversation.map((e, idx) => (
                            <MessageThread
                                key={e.id}
                                message={e}
                                className="transition-all duration-500 ease-out animate-fade-in animatioyyyy"
                                style={{
                                    animationDelay: `${idx * 80}ms`,
                                    opacity: 0,
                                    animationFillMode: "forwards"
                                }}
                            >
                                {e.author === "system" ? (
                                    <TextType
                                        text={e.content}
                                        textColors={["black"]}
                                        typingSpeed={8}
                                        pauseDuration={32}
                                        showCursor={false}
                                        className='text-lg mx-4'
                                    />
                                    // <span className='text-lg mx-6'>{e.content}</span>
                                ) : (
                                    <span className='text-lg mx-4'>{e.content}</span>
                                )}
                            </MessageThread>
                        ))}
                    </div>
                    <span className={`text-sm mt-2 transition-all duration-500 flex items-center overflow-hidden ${state == "processing" ? "text-neutral-600 h-6" : "text-white h-0"}`}>Cloudiii is processing</span>
                </div>
            </div>
            <Input
                alt='User Input'
                placeholder='eg. I want to have a picnic here'
                dir='auto'
                onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                        sendMessage(e.currentTarget.value);
                        e.currentTarget.value = ""; // clear input after sending

                        setState("processing");

                        setTimeout(() => {
                            setState("informative");
                            sendMessage(
                                "Hi Omar, it's very unlikely to rain on November 4th, so you can confidently plan your picnic!",
                                "system"
                            );
                        }, 1000);

                        setTimeout(() => {
                            setState("idle");
                        }, calculateTypingDuration({
                            text: "Hi Omar, it's very unlikely to rain on November 4th, so you can confidently plan your picnic!",
                            typingSpeed: 8,
                            pauseDuration: 32,
                            deletingSpeed: 8,
                            initialDelay: 0,
                            variableSpeed: undefined,
                            loop: false,
                            reverseMode: false
                        }) * 4);
                    }
                }}
            />
        </div>
    );
};

export default MarkerPopover;
