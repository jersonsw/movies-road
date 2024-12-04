export interface PaginationResponse<T = Movie> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}