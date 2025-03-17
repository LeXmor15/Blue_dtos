// src/services/chatService.ts
import api from './api';

export const sendMessage = async (userInput: string): Promise<string> => {
    try {
        const response = await api.get('/chat', {
            params: { user_input: userInput }, // Envía el parámetro user_input como query string
        });
        
        // Aseguramos que devolvemos el texto de la respuesta
        return response.data;
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error; // Propaga el error para manejarlo en el componente
    }
};