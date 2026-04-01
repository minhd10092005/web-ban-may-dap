import axiosClient from "./axiosClient";

const userApi = {
    getAll: (params) => {
        const url = "/User";
        return axiosClient.get(url, { params });
    },
    getById: (id) => {
        const url = `/User/${id}`;
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = "/User";
        return axiosClient.post(url, data);
    },
    update: (id, data) => {
        const url = `/User/${id}`;
        return axiosClient.put(url, data);
    },
    delete: (id) => {
        const url = `/User/${id}`;
        return axiosClient.delete(url);
    }
};

export default userApi;
