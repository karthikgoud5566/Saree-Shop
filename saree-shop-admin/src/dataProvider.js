const apiUrl = 'http://localhost:8080/api';

const httpClient = (url, options = {}) => {
    console.log(`🌐 Making request to: ${url}`);
    console.log(`📦 Request method: ${options.method || 'GET'}`);
    
    if (!options.headers) {
        options.headers = new Headers();
    }
    
    if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
        if (!options.headers.has('Content-Type')) {
            options.headers.set('Content-Type', 'application/json');
        }
    }
    
    if (!options.headers.has('Accept')) {
        options.headers.set('Accept', 'application/json');
    }
    
    const token = localStorage.getItem('adminToken');
    console.log('🔐 Admin token exists:', !!token);
    
    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log(`📋 Request headers:`, Object.fromEntries(options.headers.entries()));
    
    return fetch(url, options)
        .then(response => {
            console.log(`📡 Response status: ${response.status} for ${url}`);
            
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Handle empty responses (like DELETE)
            if (response.status === 204 || options.method === 'DELETE') {
                return { status: response.status, headers: response.headers, json: null };
            }
            
            return response.json().then(json => {
                console.log(`📦 Response JSON:`, json);
                return { status: response.status, headers: response.headers, json };
            });
        })
        .catch(error => {
            console.error(`💥 HTTP Client Error for ${url}:`, error);
            throw error;
        });
};

export const dataProvider = {
    getList: (resource, params) => {
        const url = `${apiUrl}/${resource}`;
        console.log(`📋 Fetching ${resource} from: ${url}`);
        
        return httpClient(url)
            .then(({ json }) => {
                console.log(`📊 Raw ${resource} response:`, json);
                
                if (json === undefined || json === null) {
                    console.error(`❌ Received undefined/null response for ${resource}`);
                    return { data: [], total: 0 };
                }
                
                let data;
                if (Array.isArray(json)) {
                    data = json;
                    console.log(`✅ Direct array response: ${data.length} items`);
                } else if (json && json.data && Array.isArray(json.data)) {
                    data = json.data;
                    console.log(`✅ Wrapped response: ${data.length} items`);
                } else if (json && json.content && Array.isArray(json.content)) {
                    data = json.content;
                    console.log(`✅ Paginated response: ${data.length} items`);
                } else {
                    console.warn(`⚠️ Unexpected ${resource} response structure:`, json);
                    data = [];
                }
                
                return { data: data, total: data.length };
            })
            .catch(error => {
                console.error(`❌ Error fetching ${resource}:`, error);
                return { data: [], total: 0 };
            });
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    create: (resource, params) => {
        console.log(`🚀 Creating ${resource}:`, params.data);
        
        return httpClient(`${apiUrl}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(({ json }) => {
            console.log(`✅ Created ${resource}:`, json);
            return { data: json };
        }).catch(error => {
            console.error(`❌ Error creating ${resource}:`, error);
            throw error;
        });
    },

    update: (resource, params) => {
        console.log(`🔄 Updating ${resource} ${params.id}:`, params.data);
        
        return httpClient(`${apiUrl}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(({ json }) => {
            console.log(`✅ Updated ${resource}:`, json);
            return { data: json };
        }).catch(error => {
            console.error(`❌ Error updating ${resource}:`, error);
            throw error;
        });
    },

    // ✅ FIXED: Delete method without relying on response JSON

delete: (resource, params) => {
    console.log(`🗑️ Deleting ${resource} ${params.id}`);
    
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: 'DELETE',
    }).then(() => {
        console.log(`✅ Deleted ${resource} ${params.id}`);
        
        // Force page reload after successful delete
        setTimeout(() => {
            window.location.reload();
        }, 1000);
        
        return { data: { id: params.id } };
    }).catch(error => {
        console.error(`❌ Error deleting ${resource}:`, error);
        throw error;
    });
},


    

    getMany: (resource, params) => {
        console.log(`📋 GetMany ${resource}:`, params.ids);
        return Promise.resolve({ data: [] });
    },
    
    getManyReference: (resource, params) => {
        console.log(`📋 GetManyReference ${resource}:`, params);
        return Promise.resolve({ data: [], total: 0 });
    },
    
    updateMany: (resource, params) => {
        console.log(`🔄 UpdateMany ${resource}:`, params.ids);
        return Promise.resolve({ data: params.ids });
    },
    
    deleteMany: (resource, params) => {
    console.log(`🗑️ DeleteMany ${resource}:`, params.ids);
    
    // Delete each saree individually
    const deletePromises = params.ids.map(id => 
        httpClient(`${apiUrl}/${resource}/${id}`, {
            method: 'DELETE',
        })
    );
    
    return Promise.all(deletePromises).then(() => {
        console.log(`✅ Deleted multiple ${resource}:`, params.ids);
        
        // Force page reload after successful deletion
        setTimeout(() => {
            window.location.reload();
        }, 500);
        
        return { data: params.ids };
    }).catch(error => {
        console.error(`❌ Error deleting multiple ${resource}:`, error);
        throw error;
    });
},

};
