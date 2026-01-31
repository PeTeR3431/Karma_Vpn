export type CountryServer = {
    name: string
    flag: string
    code: string
    locations: number
    ping: number
    load: number
    signal: number
    category: string
}

export const countryServers: CountryServer[] = [
    { name: "Germany", flag: "🇩🇪", code: "DE", locations: 8, ping: 12, load: 25, signal: 5, category: "fast" },
    { name: "United Kingdom", flag: "🇬🇧", code: "UK", locations: 12, ping: 18, load: 45, signal: 5, category: "fast" },
    { name: "United States", flag: "🇺🇸", code: "US", locations: 24, ping: 110, load: 65, signal: 4, category: "streaming" },
    { name: "Japan", flag: "🇯🇵", code: "JP", locations: 6, ping: 180, load: 30, signal: 3, category: "gaming" },
    { name: "Netherlands", flag: "🇳🇱", code: "NL", locations: 5, ping: 15, load: 20, signal: 5, category: "fast" },
    { name: "France", flag: "🇫🇷", code: "FR", locations: 8, ping: 22, load: 35, signal: 5, category: "streaming" },
    { name: "Singapore", flag: "🇸🇬", code: "SG", locations: 4, ping: 160, load: 40, signal: 3, category: "gaming" },
    { name: "Canada", flag: "🇨🇦", code: "CA", locations: 10, ping: 105, load: 55, signal: 4, category: "premium" },
    { name: "Australia", flag: "🇦🇺", code: "AU", locations: 6, ping: 250, load: 45, signal: 2, category: "premium" },
    { name: "Brazil", flag: "🇧🇷", code: "BR", locations: 5, ping: 190, load: 60, signal: 3, category: "streaming" },
]

export function getCategorizedServers() {
    return {
        fast: countryServers.filter(s => s.category === "fast"),
        premium: countryServers.filter(s => s.category === "premium"),
        streaming: countryServers.filter(s => s.category === "streaming"),
        gaming: countryServers.filter(s => s.category === "gaming"),
    }
}
