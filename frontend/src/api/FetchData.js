import api from "./ApiLink";

export function createResource(promise) {
    let status = "pending";
    let result;
    let suspender = promise.then(
        r => {
            status = "success";
            result = r;
        },
        e => {
            status = "error";
            result = e;
        }
    );

    return {
        read() {
            if (status === "pending") {
                throw suspender;
            } else if (status === "error") {
                throw result;
            } else if (status === "success") {
                return result;
            }
        }
    };
}

export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchProducts() {
    try {
        const response = await api.get('test/');    
        return response.data.products;
    } catch (error) {
        throw new Error("Network error occurred while fetching products.");
    }
}

export async function fetchSingleProduct(id) {
    try {
        const response = await api.get(`test/product/${id}`);
        return response.data.product;
    } catch (error) {
        throw new Error("Network error occured while fetching products.");
    }
}

export async function fetchNewArrivalProducts() {
    try {
        const response = await api.get('test/product/trending');
        return response.data.products;
    } catch (error) {
        throw new Error("Network error occurred while fetching products.");
    }
}

export async function fetchTrendingProducts(initialSlice, endSlice) {
    try {
        const response = await api.get('test/');
        const totalProducts = response.data.products;
        const products = totalProducts.slice(initialSlice, endSlice);
        return { totalProducts, products };
    } catch (error) {
        throw new Error("Network error occurred while fetching products.");
    }
}

export async function fetchSearchProductsNavbar(query) {
    try {
        const formData = new FormData();
        formData.append('query',query);
        const response = await api.post('test/product/search',formData);
        return response.data.products;
    } catch (error) {
        throw new Error("Network error occurred while fetching products.");
    }
}

export async function fetchProductRatings(id) {
    try{
        const response = await api.get(`rating/product_ratings/${id}`);
        return response.data.ratings;
    } catch (error) {
        throw new Error("Network error occured while fetching product ratings.");
    }
}

export async function fetchUsers() {
    try {
        const response = await api.get('user/retrieve');
        return response.data.users;
    } catch (error) {
        throw new Error("Network error occured while fetching users.");
    }
}

export async function fetchEditProfile(auth) {
    try {
        const response = await api.get('user/profile_edit',{
            headers: {
                "Authorization": `Token ${auth}`
            }
        });
        return response.data.user
    } catch (error) {
        throw new Error("Network error occured while fetching users.");
    }
}

export async function fetchDashboardTransaction() {
    try {
        const response = await api.get('transaction/dashboard');
        return response.data.transactions;
    } catch (error) {
        throw new Error("Network error occured while fetching data.");
    }
}

export async function fetchDashboardUser() {
    try {
        const response = await api.get('user/dashboard');
        return response.data.users;
    } catch (error) {
        throw new Error("Network error occured while fetching data.");
    }
}

export async function fetchDashboardProductsTrending() {
    try {
        const response = await api.get('test/product/dashboard_trending');
        return response.data.products;
    } catch (error) {
        throw new Error("Network error occured while fetching data.");
    }
}

export async function fetchDashboardProductsCategory() {
    try {
        const response = await api.get('test/product/dashboard_category');
        return response.data.products;
    } catch (error) {
        throw new Error("Network error occured while fetching data.");
    }
}