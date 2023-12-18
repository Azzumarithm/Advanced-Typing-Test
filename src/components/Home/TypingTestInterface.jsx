import React from 'react'

import WordsInterface from './wordsInterface'
import { useGlobalContext } from '../Context/context'


const TypingTestInterface = () => {

    const {} = useGlobalContext()
    return (
        <>
            <WordsInterface/>
        </>
    )
}
export default TypingTestInterface