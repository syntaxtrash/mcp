export function isSafeQuery(query: string): boolean {
    const trimmedQuery = query.trim().toUpperCase();
    return (
        (trimmedQuery.startsWith("SELECT") ||
            trimmedQuery.startsWith("INSERT") ||
            trimmedQuery.startsWith("UPDATE") ||
            trimmedQuery.startsWith("DELETE")) &&
        !trimmedQuery.includes("DROP")
    );
}