import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../../App.css'
import { useGlobalContext } from '../Context/Context'




const WordsInterface = () => {
    useGlobalContext
    const {paragraphs,randIndex,timer,setTimer,maxTime,setMaxTimer,timeLeft,setTimeLeft,charIndex,setCharIndex,mistakes,setMistakes,isTyping,setIsTyping,inputVal, setInputVal,validIndex,setValidIndex} = useGlobalContext()
    
    
    //load paragraph
    const inputFieldRef = useRef(null)
    
    useEffect(() => {
        inputFieldRef.current.focus();
    }, []);

    const handleTypingTextClick = (e) => {
        inputFieldRef.current.focus()
    }

    
    
    // typing

    // useEffect(() => {
    //     console.log(inputVal)
    // },[inputVal])
    
    let characters = paragraphs[randIndex]
    let charactersLength = characters.length
    let inputValue = ''
    let typedChar = characters[charIndex]

    const spanContainerRef = useRef(null)
    

    

    const handleTypingText = (e) => {
        inputValue = e.target.value
        typedChar = inputValue.split("")[charIndex]
        
        
        setInputVal(prevInputVal => {

            console.log(prevInputVal)

            return inputValue
        })
        
        
        
        if (charIndex < charactersLength - 1 && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true)
            }


            if (typedChar === null || typedChar === undefined){
                if (charIndex > 0) {

                    setCharIndex(preCharIndex => preCharIndex - 1)

                    if (mistakes !== 0){
                        setMistakes(prevState => prevState - 1)
                    }


                    setValidIndex((prevState) => {
                        const newValidIndex = [...prevState]
                        newValidIndex.pop()
                        return newValidIndex
                    })
                    
                }
            }
            else {
                
                
                setValidIndex((prevState) => {
                    return [...prevState, typedChar === characters[charIndex] ? `correct` : `incorrect`]
                })
                
                
                if (typedChar !== characters[charIndex] && charIndex > 0){
                    setMistakes(prevState => prevState + 1)
                    
                }  
                
                setCharIndex(preCharIndex => preCharIndex + 1)

            }


            
        }
        // console.log(characters[charIndex] == typedChar, characters[charIndex], { typedChar })
    }


    const handleDeletion = (e) => {
        const isCtrlKey = e.ctrlKey
        const backSpace = e.key === 'Backspace'
        const lastWord = inputVal.split(" ").pop()
        const lastWordLength = lastWord.length
        
        const previousSpan = spanContainerRef.current.children[charIndex]
        
        if (isCtrlKey && backSpace){
            setCharIndex(preCharIndex => preCharIndex - lastWordLength)
        }

    }

    

    return (
        <>
            <div className={`words-interface`}>
                <input type="text" className={`input-word-field`} ref={inputFieldRef} onChange={handleTypingText} onKeyDown={handleDeletion}/>
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
                                    className={`${index === charIndex ? 'active' : ''} ${validIndex[index] ? validIndex[index] : ``}`}>
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