"use client";

import { useState, useEffect, useCallback } from 'react';
import { sliderService, Slider, SliderCreateData } from '@/services/slider.service';

export const useSlider = () => {
    const [sliders, setSliders] = useState<Slider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSliders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await sliderService.getSliders();
            setSliders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    const createSlider = useCallback(async (sliderData: SliderCreateData) => {
        try {
            const newSlider = await sliderService.createSlider(sliderData);
            setSliders(prev => [newSlider, ...prev]);
            return newSlider;
        } catch (err) {
            throw err;
        }
    }, []);

    const refetch = useCallback(() => {
        fetchSliders();
    }, [fetchSliders]);

    useEffect(() => {
        fetchSliders();
    }, [fetchSliders]);

    return {
        sliders,
        loading,
        error,
        refetch,
        createSlider
    };
};
