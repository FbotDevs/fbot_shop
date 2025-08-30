import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const fetchData = async () => {
    try {
        const response = await axios.get(`${API_URL}/data`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const createData = async (data: any) => {
    try {
        const response = await axios.post(`${API_URL}/data`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating data:', error);
        throw error;
    }
};

export const updateData = async (id: string, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/data/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

export const deleteData = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/data/${id}`);
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};