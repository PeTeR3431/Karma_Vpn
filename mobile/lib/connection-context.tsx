import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import api from "./api";
import { type CountryServer } from "./countries-data";

type ConnectionContextType = {
    isConnected: boolean
    setIsConnected: (value: boolean) => void
    selectedServer: CountryServer | null
    setSelectedServer: (server: CountryServer) => void
    connect: () => Promise<void>
    disconnect: () => Promise<void>
    isConnecting: boolean
    hasUserSelected: boolean
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

const STORE_KEY = 'LAST_SELECTED_SERVER';

export function ConnectionProvider({ children }: { children: ReactNode }) {
    const [isConnected, setIsConnected] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [selectedServer, setSelectedServer] = useState<CountryServer | null>(null)
    const [hasUserSelected, setHasUserSelected] = useState(false)

    // Load persisted server on mount
    useEffect(() => {
        const init = async () => {
            try {
                const saved = await SecureStore.getItemAsync(STORE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setSelectedServer(parsed);
                    setHasUserSelected(true);

                    // Auto-connect if we have a saved server
                    // Wrap in timeout or check for auto-connect setting if needed
                    setTimeout(() => {
                        handleAutoConnect(parsed);
                    }, 500);
                } else {
                    // Try to fetch a default but keep hasUserSelected as false
                    const res = await api.get('/servers');
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
                }
            } catch (err) {
                console.log("Init fail", err);
            }
        };
        init();
    }, []);

    const handleAutoConnect = async (server: CountryServer) => {
        // Simple auto-connect logic
        if (server) {
            connect();
        }
    };

    const updateSelectedServer = async (server: CountryServer) => {
        setSelectedServer(server);
        setHasUserSelected(true);
        try {
            await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(server));
        } catch (e) {
            console.error("Save fail", e);
        }
    };

    const connect = async () => {
        if (isConnected || isConnecting || !selectedServer) return;

        setIsConnecting(true);
        try {
            if (selectedServer.id) {
                const response = await api.post('/sessions/connect', { serverId: selectedServer.id });
                const config = response.data;
                setSessionId(config.sessionId);
            } else {
                await new Promise(r => setTimeout(r, 1000));
            }
            setIsConnected(true);
        } catch (error) {
            console.error("Connection failed", error);
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
        } catch (error) {
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
            setSelectedServer: updateSelectedServer,
            connect,
            disconnect,
            isConnecting,
            hasUserSelected
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
