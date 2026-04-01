import axiosClient from "./axiosClient";

const quoteApi = {
    getAll: (params) => {
        const url = "/Quote";
        return axiosClient.get(url, { params });
    },
    getById: (id) => {
        const url = `/Quote/${id}`;
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = "/Quote";
        return axiosClient.post(url, data);
    },
    delete: (id) => {
        const url = `/Quote/${id}`;
        return axiosClient.delete(url);
    }
};

export default quoteApi;
