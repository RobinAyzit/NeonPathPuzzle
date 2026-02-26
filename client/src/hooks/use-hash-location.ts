import { useState, useEffect, useCallback } from "react";

// Get current hash
const getHash = () => window.location.hash.replace(/^#/, "") || "/";

export function useHashLocation() {
    const [loc, setLoc] = useState(getHash());

    useEffect(() => {
        const handler = () => setLoc(getHash());
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
    }, []);

    const navigate = useCallback((to: string) => {
        window.location.hash = to;
    }, []);

    return [loc, navigate] as [string, (to: string) => void];
}
