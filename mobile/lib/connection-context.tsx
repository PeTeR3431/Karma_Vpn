import React, { createContext, useContext, useState, ReactNode } from "react";

import { type CountryServer } from "./countries-data";

type ConnectionContextType = {
    isConnected: boolean
    setIsConnected: (value: boolean) => void
    selectedServer: CountryServer
    setSelectedServer: (server: CountryServer) => void
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export function ConnectionProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false)
    const [selectedServer, setSelectedServer] = useState<CountryServer>({
        name: "Germany",
        city: "Frankfurt",
        flag: "🇩🇪",
        flagUrl: "https://flagcdn.com/w160/de.png",
        code: "DE",
        locations: 8,
        ping: 12,
        load: 25,
        signal: 5,
        category: "fast",
        isFree: false
    })

    return (
        <ConnectionContext.Provider value={{ isConnected, setIsConnected, selectedServer, setSelectedServer }}>
            {children}
        </ConnectionContext.Provider>
    )
}

export function useConnection() {
    const context = useContext(ConnectionContext)
    if (!context) {
        throw new Error("useConnection must be used within ConnectionProvider")
    }
    return context
}
