import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../../App.css'
import { useGlobalContext } from '../Context/Context'




const WordsInterface = () => {
    
    const { paragraphs, randIndex, timer, setTimer, maxTime, setMaxTimer, timeLeft, setTimeLeft, charIndex, setCharIndex, mistakes, setMistakes, isTyping, setIsTyping, inputVal, setInputVal, validIndex, setValidIndex } = useGlobalContext()


    
    const inputFieldRef = useRef(null)
    const typingTextBoxRef = useRef(null)
    const overlapBoxDetectorRef = useRef(null)

    
    
    
    const handleTypingTextClick = (e) => {
        inputFieldRef.current.focus()
    }
    
    // typing
    let characters = paragraphs[randIndex]
    let charactersLength = characters.length
    let inputValue = ''
    let typedChar = characters[charIndex]
    let charactersArray = characters.split("").join("")
    const lastWordArray = charactersArray.split(""); 

    console.log(lastWordArray.slice(0, charIndex).join("").split(" "))
    
    const [wordStack,setWordStack] = useState('')
    const [lastWord,setLastWord] = useState('')

    const [ctrlPressed,setCtrlPressed] = useState(false)
    const [ctrlTimer, setCtrlTimer] = useState(null)
    const [ctrlCount, setCtrlCount] = useState(0)
 
    
    
    useEffect(() => {
        inputFieldRef.current.focus();
        // console.log(charactersArray)
        
    }, []);
    
    useEffect(() => {
        console.log(wordStack[wordStack?.length - 1]);
        
    }, [wordStack]);
    
    useEffect(() => {
        console.log(lastWord);
    }, [lastWord]);

    
    const spanContainerRef = useRef(null)
    const aSpan = spanContainerRef?.current?.children?.[charIndex]
    
    const unitHeight = Math.round(spanContainerRef?.current?.children?.[0].getBoundingClientRect().height + 1)
    
    const [scrollDistance, setScrollDistance] = useState(0)
    
    useEffect(() => {
        
    },[scrollDistance])
    
    const handleTypingText = (e) => {
        inputValue = e.target.value
        typedChar = inputValue.split("")[charIndex]
        
        
        setInputVal(prevInputVal => {
            return inputValue
        })
        
        
        if (charIndex < charactersLength && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true)
            }
            
            
            
            if (typedChar === null || typedChar === undefined) {
                if (charIndex > 0) {
                    
                    
                    setCharIndex(preCharIndex => preCharIndex - 1)
                    
                    if (mistakes !== 0) {
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
                const overlapBoxDetector = overlapBoxDetectorRef.current.getBoundingClientRect()
                const spanContainer = aSpan?.getBoundingClientRect()
                
                if ((Boolean(overlapBoxDetectorRef.current &&
                    spanContainerRef.current) && (overlapBoxDetector.right > spanContainer?.left &&
                        overlapBoxDetector.left < spanContainer?.right &&
                        overlapBoxDetector.bottom > spanContainer?.top &&
                        overlapBoxDetector.top < spanContainer?.bottom))
                        ) {
                            
                            setScrollDistance(prevState => {
                                const newScrollDistance = prevState + (spanContainerRef.current.scrollHeight / 3) - (2 * unitHeight);
                                typingTextBoxRef.current.scrollTo({
                            top: newScrollDistance,
                            behavior: 'smooth',
                        });
                        return newScrollDistance;
                    });
                    
                } 
                
                setValidIndex((prevState) => {
                    return [...prevState, typedChar === characters[charIndex] ? `correct` : `incorrect`]
                })
                
                
                if (typedChar !== characters[charIndex] && charIndex >= 0) {
                    setMistakes(prevState => prevState + 1)
                    
                }
                
                setCharIndex(preCharIndex => preCharIndex + 1)
                
            }
               
        }
          
    }
    

    const handleSpecialKeyForTypingText = (e) => {
        const isCtrlKey = e.ctrlKey;
        const isSpace = e.key === ' ';
        const backSpace = e.key === 'Backspace';
    
        if (isCtrlKey) {
            setCtrlTimer(setTimeout(() => {
                setCtrlPressed(true);
                setCtrlCount((prevState) => prevState + 1);
            }, 50));
        }
    
        setWordStack((prevState) => {
            const newWordStack = [...lastWordArray.slice(0, charIndex).join("").split(" ")];
    
            if (isSpace) {
                newWordStack.pop();
            }
    
            return newWordStack;
        });
    
        
        const lastWordLength = wordStack[wordStack?.length - 1]?.length;
        console.log(lastWordLength)
    
        if ((isCtrlKey && backSpace) || (ctrlPressed && ctrlCount === 1)) {
            setCharIndex((preCharIndex) => preCharIndex - lastWordLength);
            if (mistakes > 0) {
                setMistakes((prevState) => prevState - lastWordLength);
            }
    
            setValidIndex((prevState) => {
                const newValidIndex = [...prevState];
                for (let i = 0; i < lastWordLength; i++) {
                    newValidIndex.pop();
                }
                return newValidIndex;
            });
    
            setWordStack((prevState) => {
                const newWordStack = [...prevState];
                newWordStack.pop();
                return newWordStack;
            });
    
            setCtrlCount(0);
        }
    };
    

    const handleKeyUp = (e) => {
        if (e.key === 'Control') {
            setCtrlPressed(false);

            clearTimeout(ctrlTimer);
        }
    };

    useEffect(() => {
        // Cleanup the timer when the component is unmounted
        return () => {
            clearTimeout(ctrlTimer);
        };
    }, [ctrlTimer]);




    return (
        <>
            <div className={`words-interface`}>
                <input type="text" className={`input-word-field`} ref={inputFieldRef} onChange={handleTypingText} onKeyDown={handleSpecialKeyForTypingText} onKeyUp={handleKeyUp}/>
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
                    <div className={`overlap-active-box`} ref={overlapBoxDetectorRef}></div>
                    <div className={`typing-text`} onClick={handleTypingTextClick} ref={typingTextBoxRef}>
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