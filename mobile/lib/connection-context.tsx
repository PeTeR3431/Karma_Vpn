import React, { createContext, useContext, useState, ReactNode } from "react";
import api from "./api"; // Import the API instance
import { type CountryServer } from "./countries-data";

type ConnectionContextType = {
    isConnected: boolean
    setIsConnected: (value: boolean) => void // Keep for manual override if needed
    selectedServer: CountryServer
    setSelectedServer: (server: CountryServer) => void
    connect: () => Promise<void>
    disconnect: () => Promise<void>
    isConnecting: boolean
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export function ConnectionProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
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

    React.useEffect(() => {
        api.get('/servers').then(res => {
            if (res.data && res.data.length > 0) {
                const s = res.data[0];
                setSelectedServer({
                    id: s.id,
                    name: s.name,
                    city: s.city || 'Unknown',
                    flag: s.countryCode === 'UK' ? '🇬🇧' : '🇺🇸',
                    flagUrl: `https://flagcdn.com/w160/${s.countryCode.toLowerCase()}.png`,
                    code: s.countryCode,
                    locations: 1,
                    ping: 20,
                    load: s.capacity,
                    signal: 5,
                    category: s.category || 'fast',
                    isFree: true
                });
            }
        }).catch(err => console.log("Silent server fetch fail", err));
    }, []);

    const connect = async () => {
        if (isConnected || isConnecting) return;

        setIsConnecting(true);
        try {
            console.log("Connecting to", selectedServer.name);
            if (selectedServer.id) {
                // Real backend connection
                const response = await api.post('/sessions/connect', { serverId: selectedServer.id });
                const config = response.data;
                console.log("Received Config:", config);
                setSessionId(config.sessionId);

                // TODO: Initialize WireGuard with config.interface and config.peer
            } else {
                console.warn("No Server ID found, using simulation");
                await new Promise(r => setTimeout(r, 1000));
            }
            setIsConnected(true);
        } catch (error) {
            console.error("Connection failed", error);
            alert("Connection Failed");
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnect = async () => {
        if (!isConnected) return;

        setIsConnecting(true);
        try {
            if (sessionId) {
                await api.post('/sessions/disconnect', { sessionId });
                setSessionId(null);
            } else {
                await new Promise(r => setTimeout(r, 500));
            }
            setIsConnected(false);
            console.log("Disconnected");
        } catch (error) {
            console.error("Disconnect failed", error);
            // Even if api fails, we should update UI
            setIsConnected(false);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <ConnectionContext.Provider value={{
            isConnected,
            setIsConnected,
            selectedServer,
            setSelectedServer,
            connect,
            disconnect,
            isConnecting
        }}>
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
