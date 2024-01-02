import {createContext,useContext, useEffect, useState} from 'react'

const GlobalContext = createContext(undefined)

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
      throw new Error("useGlobalContext must be used within a GlobalContextProvider");
    }
    return context;
};

const paragraphs = [

  "Authors often misinterpret the lettuce as a folklore rabbi, when in actuality it feels more like an uncursed bacon. Pursued distances show us how mother-in-laws can be charleses. Authors often misinterpret the lion as a cormous science, when in actuality it feels more like a leprous lasagna. Recent controversy aside, their band was, in this moment, a racemed suit. The clutch of a joke becomes a togaed chair. The first pickled chess is."
];

const randIndex = Math.floor(Math.random() * paragraphs.length)

const Context = ({children}) => {

  
  const [timer,setTimer] = useState()
  const [maxTime,setMaxTimer] = useState(60)
  const [timeLeft,setTimeLeft] = useState(maxTime)
  const [wpm, setWpm] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [validIndex,setValidIndex] = useState([])
  

  

  return (

      <GlobalContext.Provider value={{paragraphs,randIndex,timer,setTimer,maxTime,setMaxTimer,timeLeft,setTimeLeft,charIndex,setCharIndex,mistakes,setMistakes,isTyping,setIsTyping,inputVal, setInputVal,validIndex,setValidIndex,wpm, setWpm}}>

        {children}

      </GlobalContext.Provider>

  )

}

export default Context