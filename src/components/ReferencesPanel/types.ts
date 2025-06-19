export interface ArxivPaper {
    id: string;
    title: string;
    authors: string;
    abstract: string;
    date: string;
    doi?: string | null;
    score?: number;
}

export type SortOption = 'score' | 'date' | 'title';

export interface ScoreColors {
    excellent: string;
    veryGood: string;
    good: string;
    fair: string;
    low: string;
}

export interface ScoreThresholds {
    excellent: number;
    veryGood: number;
    good: number;
    fair: number;
} 