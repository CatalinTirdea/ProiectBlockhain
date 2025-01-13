import {React, useState, createContext} from 'react'
import './App.css'
import ProposalList from './components/AllProposals'
import CreateProposal from "./components/CreateProposal.tsx";
import Wallet from "./components/Wallet.tsx";
import Donate from "./components/Donate.tsx";
import EventsListener from './components/EventsListener';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
                <Router>
                    <Routes>
                        <Route path="/donate" element={<Donate />} />
                        <Route path="/events" element={<EventsListener />} />
                        <Route path="/" element={
                            <div className="container">
                                <div className="left-side">
                                    <ProposalList />
                                </div>
                                <div className="right-side">
                                    <CreateProposal />
                                    <Wallet />
                                </div>
                            </div>
                        } />
                    </Routes>
                </Router>
            </ContextProvider>
        </>
    )
}

export default App