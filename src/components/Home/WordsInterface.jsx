import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../../App.css'
import { useGlobalContext } from '../Context/Context'




const WordsInterface = () => {
    useGlobalContext
    const {paragraphs,randIndex,timer,setTimer,maxTime,setMaxTimer,timeLeft,setTimeLeft,charIndex,setCharIndex,mistakes,setMistakes,isTyping,setIsTyping,} = useGlobalContext()
    
    
    //load paragraph
    const inputFieldRef = useRef(null)
    
    useEffect(() => {
        inputFieldRef.current.focus();
    }, []);

    const handleTypingTextClick = (e) => {
        inputFieldRef.current.focus()
    }


    
    // typing
    
    let characters = paragraphs[randIndex]
    let charactersLength = characters.length
    let inputValue = ''
    let typedChar = ''

    const [updateValidity,setUpdateValidity] = useState(false)
    const [removeValidity,setRemoveValidity] = useState()
    const spanContainerRef = useRef(null)


    const handleTypingText = (e) => {
        inputValue = e.target.value
        typedChar = inputValue.split("")[charIndex]
        
        const previousSpan = spanContainerRef.current.children[charIndex]
        
        if (charIndex < charactersLength - 1 && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true)
            }
            
            if (typedChar == null || typedChar == undefined) {
                if (charIndex > 0) {
                    setCharIndex(preCharIndex => preCharIndex - 1)
                    
                    if (previousSpan.classList.contains('incorrect')) {
                        setMistakes(prevMistakes => prevMistakes - 1)
                    }

                    setUpdateValidity(false)
                    setRemoveValidity(true)
                }

            } else {


                setUpdateValidity(true)
                setRemoveValidity(false)

                if (typedChar !== characters[charIndex]) {
                    setMistakes(prevMistakes => prevMistakes + 1)
                }


                setCharIndex(preCharIndex => preCharIndex + 1)
            }
        }
        console.log(characters[charIndex] == typedChar, characters[charIndex], { typedChar })
    }



    return (
        <>
            <div className={`words-interface`}>
                <input type="text" className={`input-word-field`} ref={inputFieldRef} onChange={handleTypingText} />
                <div className={`content-box`}>
                    <div className="content">
                        <ul className={`result-details`}>
                            <li className={`time`}>
                                <span><b>60</b></span>
                            </li>
                            <li className={`wpm`}>
                                <span><b>0</b></span>
                            </li>
                        </ul>
                    </div>
                    <div className={`typing-text`} onClick={handleTypingTextClick}>
                        <p ref={spanContainerRef}>
                            {paragraphs[randIndex].split("").map((char, index) => (
                                <span
                                    key={index}
                                    className={`${index === charIndex ? 'active' : ''} ${updateValidity
                                            ? characters[charIndex] === typedChar
                                                ? 'correct'
                                                : 'incorrect'
                                            : ''
                                        }`}
                                >
                                    {char}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default WordsInterface