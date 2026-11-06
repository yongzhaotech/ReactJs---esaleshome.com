//Using fetch to post multipart form:
const submit = async (data: {
	requestData: string[];
	formData: boolean;
	contentType: string;
	script: string;
	form: HTMLFormElement;
}): Promise<ApiResponse> => {
	trackHit(data.script);

	// 1. Establish your base request options
	const url = `${host}/${data.script}`;
	const options: RequestInit = {
		method: 'POST',
		credentials: 'include', // Automatically passes your HttpOnly tokens/cookies
		headers: {}
	};

	// 2. Set up the payload body matching your conditional checks
	if (data.formData) {
		// Automatically packages text fields AND multiple files from your HTMLFormElement.
		// LEAVE options.headers EMPTY! The browser will auto-set "multipart/form-data" + boundaries.
		options.body = new FormData(data.form);
	} else {
		// Standard text/URL-encoded payload setup
		options.headers = {
			'Content-Type': data.contentType
		};
		options.body = data.requestData.join('&');
	}

	try {
		// 3. Execute the network request
		const response = await fetch(url, options);

		// 4. Handle token validation/expiration intercepts here if necessary (e.g., status 401/403)

		// 5. Enforce success checks (fetch doesn't reject on bad status codes)
		if (response.ok) {
			const apiResponseData = await response.json() as ApiData;
			return { data: apiResponseData };
		} else {
			throw new Error('backend_error');
		}
	} catch (error) {
		// 6. Map exceptions cleanly back to your existing labels
		if (error instanceof Error && error.message === 'backend_error') {
			throw { error: getLabel('backend_error') } as ApiError;
		}
		throw { error: getLabel('ui_error') } as ApiError;
	}
};

// node.js server CORS:
const cors = require('cors');

// 1. Define your whitelist of allowed domains
const allowedOrigins = [
    'http://localhost:3000',      // Local React/Vue dev server
    'http://localhost:5173',      // Local Vite dev server
    'https://yourdomain.com', // Production frontend
    'https://yourdomain.com'  // Production dashboard subdomain
];

const corsOptions = {
    origin: function (origin, callback) {
        // 2. Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        // 3. Check if the incoming request origin matches your whitelist
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Origin allowed
        } else {
            callback(new Error('Blocked by CORS policy: Origin not allowed.'));
        }
    },
    credentials: true // Crucial: Permits the browser to exchange HttpOnly cookies
};

// 4. Apply the dynamic options middleware
app.use(cors(corsOptions));

// frontend refresh token
// A central base URL for your API endpoints
const BASE_URL = 'http://localhost:5000/api';

/**
 * Custom wrapper around native fetch that handles automatic token refreshing
 */
export async function secureFetch(endpoint, options = {}) {
    // 1. Critical configuration: Ensure cookies are always sent/received
    options.credentials = 'include';
    options.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const url = `${BASE_URL}${endpoint}`;
    
    // 2. Execute the initial API request
    let response = await fetch(url, options);

    // 3. If access token is expired (assuming server throws 403 or 401)
    if (response.status === 403 || response.status === 401) {
        console.warn('Access token expired. Attempting safe background refresh...');

        // 4. Hit the refresh endpoint to get a new access-token cookie
        const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
            method: 'POST',
            credentials: 'include', // Must include the long-lived refresh-token cookie
        });

        if (refreshResponse.ok) {
            console.log('Token successfully refreshed. Re-trying original request.');
            
            // 5. Re-run the exact original request now that the new cookie is set
            response = await fetch(url, options);
        } else {
            console.error('Refresh token expired or invalid. Logging user out.');
            
            // 6. Optional: Redirect user to login page or dispatch log out event
            window.location.href = '/login';
            throw new Error('Session expired. Please log in again.');
        }
    }

    return response;
}
 // how to use in component
 import { secureFetch } from './api.js';

// Example: Fetching user dashboard data
async function loadDashboard() {
    try {
        const response = await secureFetch('/dashboard', { method: 'GET' });
        
        if (!response.ok) throw new Error('Failed to load dashboard data');
        
        const data = await response.json();
        console.log('Secure dashboard data:', data);
    } catch (error) {
        console.error('Dashboard Error:', error.message);
    }
}
