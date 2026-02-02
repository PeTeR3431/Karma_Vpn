export type CountryServer = {
    id?: string // Added ID for backend servers
    name: string
    city: string
    flag: string
    flagUrl: string
    code: string
    locations: number
    ping: number
    load: number
    signal: number
    category: string
    isFree: boolean
}

export const countryServers: CountryServer[] = [
    // Free Servers
    {
        name: "United Kingdom",
        city: "UK - Virtual",
        flag: "🇬🇧",
        flagUrl: "https://flagcdn.com/w160/gb.png",
        code: "UK",
        locations: 12,
        ping: 18,
        load: 25,
        signal: 5,
        category: "fast",
        isFree: true
    },
    {
        name: "Singapore",
        city: "Singapore - Virtual",
        flag: "🇸🇬",
        flagUrl: "https://flagcdn.com/w160/sg.png",
        code: "SG",
        locations: 4,
        ping: 160,
        load: 40,
        signal: 3,
        category: "fast",
        isFree: true
    },

    // Pro Servers
    {
        name: "Albania",
        city: "Tirana",
        flag: "🇦🇱",
        flagUrl: "https://flagcdn.com/w160/al.png",
        code: "AL",
        locations: 2,
        ping: 45,
        load: 15,
        signal: 5,
        category: "premium",
        isFree: false
    },
    {
        name: "Algeria",
        city: "Algeria - Virtual",
        flag: "🇩🇿",
        flagUrl: "https://flagcdn.com/w160/dz.png",
        code: "DZ",
        locations: 1,
        ping: 120,
        load: 30,
        signal: 4,
        category: "premium",
        isFree: false
    },
    {
        name: "Andorra",
        city: "Andorra la Vella - Virtual",
        flag: "🇦🇩",
        flagUrl: "https://flagcdn.com/w160/ad.png",
        code: "AD",
        locations: 1,
        ping: 35,
        load: 10,
        signal: 5,
        category: "premium",
        isFree: false
    },
    {
        name: "Argentina",
        city: "Buenos Aires",
        flag: "��🇷",
        flagUrl: "https://flagcdn.com/w160/ar.png",
        code: "AR",
        locations: 3,
        ping: 190,
        load: 50,
        signal: 4,
        category: "premium",
        isFree: false
    },
    {
        name: "Australia",
        city: "Luanda - Virtual",
        flag: "🇦🇺",
        flagUrl: "https://flagcdn.com/w160/au.png",
        code: "AU",
        locations: 6,
        ping: 250,
        load: 45,
        signal: 3,
        category: "premium",
        isFree: false
    },
    {
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
    },
    {
        name: "United States",
        city: "New York",
        flag: "🇺🇸",
        flagUrl: "https://flagcdn.com/w160/us.png",
        code: "US",
        locations: 24,
        ping: 110,
        load: 65,
        signal: 4,
        category: "streaming",
        isFree: false
    },
    {
        name: "Japan",
        city: "Tokyo",
        flag: "🇯🇵",
        flagUrl: "https://flagcdn.com/w160/jp.png",
        code: "JP",
        locations: 6,
        ping: 180,
        load: 30,
        signal: 3,
        category: "gaming",
        isFree: false
    },
]

export function getCategorizedServers() {
    return {
        free: countryServers.filter(s => s.isFree),
        pro: countryServers.filter(s => !s.isFree),
        fast: countryServers.filter(s => s.category === "fast"),
        premium: countryServers.filter(s => s.category === "premium"),
        streaming: countryServers.filter(s => s.category === "streaming"),
        gaming: countryServers.filter(s => s.category === "gaming"),
    }
}
