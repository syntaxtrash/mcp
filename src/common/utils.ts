export function isSelectQuery(query: string): boolean {
    const trimmed_query = query.trim().toUpperCase();
    return (
        trimmed_query.startsWith("SELECT") &&
        !trimmed_query.includes("INSERT") &&
        !trimmed_query.includes("UPDATE") &&
        !trimmed_query.includes("DELETE") &&
        !trimmed_query.includes("DROP")
    );
}