const API_BASE_URL = "/api";

export interface PredictionRequest {
    score: number;
    category: string;
    branch: string;
    city: string;
    examType?: "MHT-CET" | "JEE";
    collegeType?: "Any" | "Government" | "Private";
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

