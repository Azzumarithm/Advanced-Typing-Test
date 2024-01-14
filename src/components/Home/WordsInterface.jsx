import React, { useCallback, useEffect, useRef, useState } from 'react'
import '../../App.css'
import { useGlobalContext } from '../Context/Context'
import reload from '../../assets/images/reload.svg'

const WordsInterface = () => {
    
    const { paragraphs, randIndex, timer, setTimer, maxTime, setMaxTimer, timeLeft, setTimeLeft, charIndex, setCharIndex, mistakes, setMistakes, isTyping, setIsTyping, inputVal, setInputVal, validIndex, setValidIndex,wpm, setWpm } = useGlobalContext()

    const inputFieldRef = useRef(null)
    const typingTextBoxRef = useRef(null)
    const overlapBoxDetectorRef = useRef(null)

    const handleTypingTextClick = (e) => {
        inputFieldRef.current.focus()
    }
    
    const [ctrlPressed,setCtrlPressed] = useState(false)
    const [ctrlBackspacePressed,setCtrlBackspacePressed] = useState(false)
    const [ctrlTimer, setCtrlTimer] = useState(null)
    const [testTimer, setTestTimer] = useState(null);
    const [commaPeriodIndexOccurrence, setCommaPeriodIndexOccurrence] = useState(new Set())
    const [commaPeriodIndexOccArray, setCommaPeriodIndexOccArray] = useState([])
    const [trackCommaPeriodIndexOcc, setTrackCommaPeriodIndexOcc] = useState([])
    const [diffCommaPeriodOcc, setDiffCommaPeriodOcc] = useState(0)
    const [offSetCommaPeriodOccArray, setOffSetCommaPeriodOccArray] = useState(0)
    
    // typing
    let characters = paragraphs[randIndex]
    let charactersLength = characters.length
    let inputValue = ''
    let typedChar = characters[charIndex]

    // let charArray = inputVal.split(/(\s+|,\s*|\.\s*)/).filter(s => s != " ").filter(s => s != '')
    const [charArray, setCharArray] = useState([])
    const [lastWord,setLastWord] = useState()
    // const [modifiedLastWord,setModifiedLastWord] = useState('')
    const [currentStringGapIndex,setCurrentStringGapIndex] = useState(0)
   
    
    // let currentStringGapIndex = charArray.length - 2
    useEffect(() => {
        inputFieldRef.current.focus();
        // console.log(charactersArray)
    }, []);
    
    useEffect(() => {
        setCharArray([...inputVal.split(/(\s+|,|\.\s*)/).filter(s => s != " ").filter(s => s != '').map((s, index, array) => (index === array.length - 1) ? s : (s === '. ' || s === ', ') ? s : s + " ")])
    
        console.log(inputVal[charIndex - 1])
        console.log(characters[charIndex - 1])
        console.log(inputVal[charIndex - 2])
        console.log(characters[charIndex - 2])
    }, [inputVal]);
    
    useEffect(() => {
        
        setLastWord(`${charArray[charArray.length - 1]}`)
        
    },[charArray])
    
    useEffect(() => {
        if (lastWord === '.' || lastWord === ","){
            setCommaPeriodIndexOccurrence((prevState) => {
                const newSetCommaPeriodIndexOccurrence = new Set(prevState);
                newSetCommaPeriodIndexOccurrence.add(charArray.length);
                return newSetCommaPeriodIndexOccurrence;
            });
        }

    },[lastWord])
    

    useEffect(() => {
        setCommaPeriodIndexOccArray(Array.from(commaPeriodIndexOccurrence));
        
    }, [commaPeriodIndexOccurrence]);

    useEffect(() => {
        setTrackCommaPeriodIndexOcc(commaPeriodIndexOccArray)
    }, [commaPeriodIndexOccArray]);
    
    useEffect(() => {
        

        if (commaPeriodIndexOccArray.length >= 2) {
            setDiffCommaPeriodOcc(commaPeriodIndexOccArray[commaPeriodIndexOccArray.length - 1] - commaPeriodIndexOccArray[commaPeriodIndexOccArray.length - 2]);

            setOffSetCommaPeriodOccArray(prevState=> prevState + 1)
        }



    }, [commaPeriodIndexOccArray]);

    useEffect(() => {

        // if (commaPeriodIndexOccArray?.length > trackCommaPeriodIndexOcc.length && commaPeriodIndexOccArray.length >= 2){
        //     setOffSetCommaPeriodOccArray(prevState => prevState - 1)
        // }

        if (commaPeriodIndexOccArray?.length - trackCommaPeriodIndexOcc.length == 2 && trackCommaPeriodIndexOcc.length >= 2){
            setOffSetCommaPeriodOccArray(prevState => prevState - 1)
        }
        
        
    }, [trackCommaPeriodIndexOcc]);

    useEffect(() => {  

        if (commaPeriodIndexOccArray.length >= 2){

            if (charArray.length === 1){
                setLastWord(`${charArray[charArray.length - 1]}`)
            }
            else if (charArray.length < commaPeriodIndexOccArray[commaPeriodIndexOccArray.length - 1] - 1 && charArray.length > commaPeriodIndexOccArray[commaPeriodIndexOccArray.length - 2]) {

                // let modifiedLastWord = lastWord?.trim()

                if(lastWord !== '.' || lastWord !== ','){
                    setLastWord(`${charArray[charArray.length - 1]} `)
                }

                
            }
        }
        

    },[lastWord])

    useEffect(() => {

    },[ctrlBackspacePressed])
    

    const spanContainerRef = useRef(null)
    const aSpan = spanContainerRef?.current?.children?.[charIndex]
    
    const unitHeight = Math.round(spanContainerRef?.current?.children?.[0].getBoundingClientRect().height + 1)
    
    const [scrollDistance, setScrollDistance] = useState(0)
    
    useEffect(() => {
        
    },[scrollDistance])


    useEffect(() => {
        setWpm(Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60) || 0)
    },[timeLeft])
    
    
    const handleTypingText = (e) => {
        inputValue = e.target.value
        typedChar = inputValue.split("")[charIndex]
        
        
        setInputVal(inputValue)
        

        if (charIndex < charactersLength && timeLeft > 0) {
            if (!isTyping) {

                setIsTyping(true)

                const newIntervalId = setInterval(() => {

                    setTimeLeft((prevState) => {
                        if (prevState > 0) {

                            return prevState - 1;
                        } else {
                            clearInterval(newIntervalId); 
                            return prevState;
                        }

                    });
                }, 1000);

                setTestTimer(newIntervalId);
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
        const isEnter = e.key === 'Enter'
        const isShift = e.shiftKey

        
    
        if (isCtrlKey) {

            if (ctrlTimer < 70 && charIndex > 0){
                setCtrlTimer(setTimeout(() => {
                    setCtrlPressed(true);
                    // setCtrlCount((prevState) => prevState + 1);
                }, 70));
            }
        }

        let lastWordLength 
        // let lastWordLength = lastWord?.length - 1

        if (characters[charIndex - 1] === ' ' && inputVal[charIndex - 1] === ' ' && (characters[charIndex - 2] !== ',' || characters[charIndex - 2] !== '.' && inputVal[charIndex - 2] !== ',' || inputVal[charIndex - 2] !== '.')){
            lastWordLength = lastWord?.length 
        }
        else{
            lastWordLength = lastWord?.length - 1
        }
        
        
        

        // const popElementFromTrackCommaPeriodIndexOcc = () => {
        //     setTrackCommaPeriodIndexOcc([...commaPeriodIndexOccArray].pop());
            
        //     // setCommaPeriodIndexOccArray((prevState) => {
        //     //     const newCommaPeriodIndexOccArray = [...prevState];
        //     //     newCommaPeriodIndexOccArray.pop();
        //     //     return newCommaPeriodIndexOccArray;
        //     // });
        // };

        let modifiedLastWord = lastWord?.trim()

        
        if ((isCtrlKey && backSpace)) {

            setCtrlBackspacePressed(true)


            if (modifiedLastWord === '.' || modifiedLastWord === ','){
                setTrackCommaPeriodIndexOcc(prevState=> {
                    const newTrackCommaPeriodIndexOcc = [...prevState]
                    newTrackCommaPeriodIndexOcc.pop()
                    return newTrackCommaPeriodIndexOcc
                });
            }

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
        }

        if ((isShift || isEnter)){
            setCharIndex(0)
            setValidIndex([])
            setMistakes(0)
            setInputVal('')
            setIsTyping(false)
            setTimeLeft(maxTime)
            
            e.target.value = ''
            clearInterval(testTimer)
            setTestTimer(null)
        }
    };
    

    const handleKeyUp = (e) => {
        if (e.key === 'Control') {
            setCtrlPressed(false);
            clearTimeout(ctrlTimer);
            setCtrlTimer(0)
        }

        if (e.key === 'Control' && e.key === 'Backspace'){
            setCtrlBackspacePressed(false)
        }
    };

    useEffect(() => {
        // Cleanup the timer when the component is unmounted
        return () => {
            clearTimeout(ctrlTimer);
            
        };
    }, [ctrlTimer]);


    const handleResetTypingTest = (e) => {
        setCharIndex(0)
        setValidIndex([])
        setMistakes(0)
        setInputVal('')
        setIsTyping(false)
        setTimeLeft(maxTime)
        clearInterval(testTimer)
        setTestTimer(null)
        e.target.value = ''
    }


    return (
        <>
            <div className={`words-interface`}>
                <input type="text" className={`input-word-field`} ref={inputFieldRef} onChange={handleTypingText} onKeyDown={handleSpecialKeyForTypingText} onKeyUp={handleKeyUp} />
                <div className={`content-box`}>
                    <div className="content">
                        <ul className={`result-details`}>
                            <li className={`time`}>
                                <span><b>{timeLeft}</b></span>
                            </li>
                            <li className={`wpm`}>
                                <span><b>{wpm}</b></span>
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
                    <div className={`reload`}>
                        <svg fill="#ffffff" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" className={`reload-icon`} onClick={handleResetTypingTest}>
                            <title>reload</title>
                            <path d="M0 16q0-2.784 1.088-5.312t2.912-4.384 4.384-2.912 5.344-1.088q2.784 0 5.312 1.088t4.384 2.912 2.912 4.384 1.088 5.312h2.304q0.736 0 1.28 0.416t0.8 1.024 0.16 1.28-0.64 1.184l-4.576 4.576q-0.672 0.672-1.6 0.672t-1.632-0.672l-4.576-4.576q-0.512-0.512-0.608-1.184t0.128-1.28 0.8-1.024 1.312-0.416h2.272q0-2.464-1.216-4.576t-3.328-3.328-4.576-1.216-4.608 1.216-3.328 3.328-1.216 4.576 1.216 4.608 3.328 3.328 4.608 1.216q1.728 0 3.36-0.64l3.424 3.392q-3.136 1.824-6.784 1.824-2.816 0-5.344-1.088t-4.384-2.912-2.912-4.384-1.088-5.344z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    )
}
export default WordsInterface