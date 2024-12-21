import axios, { AxiosResponse } from 'axios';
import {  Testimonial } from '@lib/testimonialLib/type/Testimonial';
import { Template } from '@/types/Template';
import {Profession} from '@lib/ProfessionLib/type/Profession';

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

// Fonctions d'API

export const getProfessions = async (): Promise<{ data: Profession[] }> => {
    const response: AxiosResponse<{ data: Profession[] }> = await axiosInstance.get('/profession/get-all');
    return response.data;
};

export const getContracts = async (): Promise<Template[]> => {
    const response: AxiosResponse<{ data: Template[] }> = await axiosInstance.get('/products');
    return response.data.data;
};

export const getTemplateByProfession = async (profession: string): Promise<{ data: Template[] }> => {
    const response: AxiosResponse<{ data: Template[] }> = await axiosInstance.get(`/profession/${profession}`);
    return response.data;
};

export const getProfessionByContractId = async (contractId: string): Promise<{ data: Profession[] }> => {
    const response: AxiosResponse<{ data: Profession[] }> = await axiosInstance.get(`/profession/get-by-contract-id/${contractId}`);
    return response.data;
};

export const getAvailableContracts = async (): Promise<{ data: Template[] }> => {
    const response: AxiosResponse<{ data: Template[] }> = await axiosInstance.get('/profession/get-all-available');
    return response.data;
};

export const getTestimonials = async (): Promise<{ data: Testimonial[] }> => {
    const response: AxiosResponse<{ data: Testimonial[] }> = await axiosInstance.get('/api/testimonials/get-all');
    return response.data;
};
