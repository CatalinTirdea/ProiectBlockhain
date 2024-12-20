import {React, useState, createContext} from 'react'
import './App.css'
import ProposalList from './components/AllProposals'
import CreateProposal from "./components/CreateProposal.tsx";
import Wallet from "./components/Wallet.tsx";

export const Context = createContext("");

const ContextProvider = ({children}) => {
    let [address, setAddress] = useState("");

    return (
        <Context.Provider value={{address, setAddress}}>
            {children}
        </Context.Provider>
    )
}

function App() {
    const [count, setCount] = useState(0)
    const [address, setAddress] = useState('')

    return (
        <>
            <ContextProvider>
                <div className="container">
                    <div className="left-side">
                        <ProposalList />
                    </div>
                    <div className="right-side">
                        <CreateProposal />
                        <Wallet />
                    </div>
                </div>
            </ContextProvider>
        </>
    )
}

export default App
