const API_BASE_URL = "/api";

export interface PredictionRequest {
    percentile: number;
    category: string;
    branches: string[];
    districts: string[];
    collegeTypes: string[];
    examType?: "MHT-CET" | "JEE";
    gender?: string;
    isPwd?: boolean;
    isDefense?: boolean;
    isTfws?: boolean;
    isOrphan?: boolean;
}

export interface PredictionResponse {
    success: boolean;
    data: any[];
    count: number;
    message?: string;
    errors?: any[];
}

export interface FeedbackRequest {
    rating: number;
    message: string;
}

export interface FeedbackResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * Predict colleges based on student score, category, branch, and city
 */
export const predictColleges = async (request: PredictionRequest): Promise<PredictionResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to predict colleges");
        }

        return data;
    } catch (error) {
        console.error("Prediction error:", error);
        throw error;
    }
};

/**
 * Submit user feedback
 */
export const submitFeedback = async (request: FeedbackRequest): Promise<FeedbackResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to submit feedback");
        }

        return data;
    } catch (error) {
        console.error("Feedback error:", error);
        throw error;
    }
};

/**
 * Fetch available categories from backend
 */
export const fetchCategories = async (): Promise<{ label: string; apiValue: string }[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/meta/categories`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to fetch categories");
        }
        return data.data;
    } catch (error) {
        console.error("Fetch categories error:", error);
        return [];
    }
};

/**
 * Fetch available branches from backend (distinct from cutoff collection)
 */
export const fetchBranches = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/meta/branches`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to fetch branches");
        }
        return data.data;
    } catch (error) {
        console.error("Fetch branches error:", error);
        return [];
    }
};

/**
 * Fetch available cities from backend (distinct from cutoff collection)
 */
export const fetchCities = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/meta/cities`);
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to fetch cities");
        }
        return data.data;
    } catch (error) {
        console.error("Fetch cities error:", error);
        return [];
    }
};
