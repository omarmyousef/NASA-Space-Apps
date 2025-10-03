import React from 'react'
import { Input } from '~/components/ui/input'
import TextType from '~/components/TextType';

const MarkerPopover = () => {

    const states = ["idle", "processing", "informative"];
    const [state, setState] = React.useState("idle");

    return (
        <div className='flex flex-col'>
            <div className='my-16 text-4xl w-full max-w-96 flex justify-start items-center flex-col'>
                <img src={`/cloud-${state}.png`} className='w-2/3 h-auto aspect-2/1 object-cover' onClick={() => {
                    setState(states[((states.indexOf(state) || 0) + 1) % 3] || "idle")
                }}></img>
            <div className='w-full text-start mt-4'>

                <TextType text={["Text typing effect Text typing effect Text typing effect Text typing effect Text typing effect"]}
                    textColors={["black"]}
                    showCursor={false}
                    className='text-lg mx-6' />
            </div>
            </div>
            <Input alt='User Input' placeholder='eg. I want to have a picnic here'></Input>
        </div>
    )
}

export default MarkerPopover