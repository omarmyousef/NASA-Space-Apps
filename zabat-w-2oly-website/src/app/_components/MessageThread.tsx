import React from 'react'
import { motion } from 'framer-motion'
import type { conversationThread } from './MarkerPopover'
import { UserIcon, Cloud, CloudIcon } from 'lucide-react'

interface messageThreadProps {
    message: conversationThread,
    className?: string,
    children: React.ReactNode,
    style: any
}

const MessageThread = ({ message, className, children, style }: messageThreadProps) => {
    return (
        <motion.div
            className='flex my-2'
            dir={{ system: "ltr", user: "rtl" }[message.author]}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <motion.span
                className='rounded-full border-2 border-neutral-600 aspect-square h-12 w-12 flex justify-center items-center mx-2'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            >
                {{ system: (<CloudIcon />), user: (<UserIcon />) }[message.author]}
            </motion.span>
            <motion.div
                dir="auto"
                className={`rounded-lg border-2 border-neutral-600 drop-shadow-lg w-full py-2 flex justify-start items-center ${{ system: "bg-orange-100", user: "bg-neutral-100" }[message.author] || "bg-white"} ${className}`}
                initial={{ opacity: 0, x: { system: -20, user: 20 }[message.author] }}
                animate={{ 
                    opacity: 1, 
                    x: 0,
                    height: "auto"
                }}
                transition={{ 
                    opacity: { delay: 0.15, duration: 0.3 },
                    x: { delay: 0.15, duration: 0.3, ease: "easeOut" },
                    height: { duration: 0.3, ease: "easeInOut" }
                }}
                style={{ overflow: "hidden" }}
            >
                {children}
            </motion.div>
        </motion.div>
    )
}

export default MessageThread