export function isSafeQuery(query: string): boolean {
    const trimmedQuery = query.trim().toUpperCase();
    return (
        (trimmedQuery.startsWith("SELECT") || trimmedQuery.startsWith("INSERT")) &&
        !trimmedQuery.includes("UPDATE") &&
        !trimmedQuery.includes("DELETE") &&
        !trimmedQuery.includes("DROP")
    );
}