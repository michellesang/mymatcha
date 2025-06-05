const API_BASE_URL = 'http://localhost:8000';

const authorizedFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth';
        throw new Error('Authentication required');
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth';
        throw new Error('Authentication required');
    }

    return response;
};


export const api = {
    createMatcha: async (matchaData) => {
        const formattedData = {
            brand: matchaData.brand,
            name: matchaData.name,
            price: Number(matchaData.price),
            rating: Number(matchaData.rating),
            notes: matchaData.notes || ''
        };

        const response = await authorizedFetch(`${API_BASE_URL}/matchas/`, {
            method: 'POST',
            body: JSON.stringify(formattedData),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || 'Failed to create matcha');
        }

        return result;
    },


    signIn: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        console.log("Login response:", data);

        return {
            access_token: data.token,
            user: {
                id: data.userId,
                email: data.email,
                createdAt: data.createdAt
            }
        };
    },


    signUp: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Signup failed');
        }

        const data = await response.json();
        console.log("Login response:", data);

        return {
            access_token: data.token || '',
            user: {
                id: data.user?.id,
                email: email
            }
        };
    },

    signOut: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch(`${API_BASE_URL}/auth/signout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.warn("Backend signout failed (may be safe to ignore):", error);
        }
    },


    getMatchas: async () => {
        const response = await authorizedFetch(`${API_BASE_URL}/matchas/`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch matchas');
        }

        return response.json();
    },

    updateMatcha: async (id, matchaData) => {
        const formattedData = {
            brand: matchaData.brand,
            name: matchaData.name,
            price: Number(matchaData.price),
            rating: Number(matchaData.rating),
            notes: matchaData.notes || ''
        };

        const response = await authorizedFetch(`${API_BASE_URL}/matchas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to update matcha');
        }

        return response.json();
    },


    deleteMatcha: async (id) => {
        const response = await authorizedFetch(`${API_BASE_URL}/matchas/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail);
        }
    },


    getMatchaStats: async () => {
        const response = await authorizedFetch(`${API_BASE_URL}/matchas/stats`);

        if (!response.ok) {
            throw new Error('Failed to fetch matcha stats');
        }

        return response.json();
    }
};