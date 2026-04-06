import axiosClient from "./axiosClient";

const adminApi = {
    login: (data) => {
        const url = "/login";
        return axiosClient.post(url, data);
    },
    getAll: (params) => {
        const url = "/Admin";
        return axiosClient.get(url, { params });
    },
    getById: (id) => {
        const url = `/Admin/${id}`;
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = "/Admin";
        return axiosClient.post(url, data);
    },
    update: (id, data) => {
        const url = `/Admin/${id}`;
        return axiosClient.put(url, data);
    },
    delete: (id) => {
        const url = `/Admin/${id}`;
        return axiosClient.delete(url);
    }
};

export default adminApi;
