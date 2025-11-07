export interface Slider {
    id: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    createdAt: string;
}

export interface SliderCreateData {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}

export interface SliderUpdateData {
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    image?: string;
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}/slides`;

export const sliderService = {
    async getSliders(): Promise<Slider[]> {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${result.message || 'No message'}`);
            }

            if (result.success === false) {
                throw new Error(result.error || result.message || 'Failed to fetch sliders');
            }
            if (result.success && result.data) {
                return result.data;
            }
            if (Array.isArray(result)) {
                return result;
            }
            if (result.data && Array.isArray(result.data)) {
                return result.data;
            }

            throw new Error('Unexpected response format');
        } catch (error) {
            console.error('Error fetching sliders:', error);
            throw error;
        }
    },

    async createSlider(sliderData: SliderCreateData): Promise<Slider> {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sliderData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${result.message || 'No message'}`);
            }

            if (result.success === false) {
                throw new Error(result.error || result.message || JSON.stringify(result) || 'Failed to create slider');
            }

            if (!result.success && result.id) {
                return result as Slider;
            }

            if (!result.data) {
                throw new Error('Unexpected response format: no data field');
            }

            return result.data;
        } catch (error) {
            console.error('Error creating slider:', error);
            throw error;
        }
    },

    async updateSlider(id: string, sliderData: SliderUpdateData): Promise<Slider> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sliderData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${result.message || 'No message'}`);
            }

            if (!result.success) {
                throw new Error(result.error || result.message || JSON.stringify(result) || 'Failed to update slider');
            }

            return result.data;
        } catch (error) {
            console.error('Error updating slider:', error);
            throw error;
        }
    },

    async deleteSlider(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            let result;
            try {
                result = await response.json();
            } catch (e) {
                result = {};
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${result.message || 'No message'}`);
            }

            if (result.success === false) {
                throw new Error(result.error || result.message || JSON.stringify(result) || 'Failed to delete slider');
            }
        } catch (error) {
            console.error('Error deleting slider:', error);
            throw error;
        }
    }
};
