import axiosClient from "./axiosClient";

const candidateProfileApi = {
    getAll: (params) => {
        const url = "/candidate-profiles";
        return axiosClient.get(url, { params });
    },
    getById: (id) => {
        const url = `/candidate-profiles/${id}`;
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = "/candidate-profiles";
        return axiosClient.post(url, data);
    },
    update: (id, data) => {
        const url = `/candidate-profiles/${id}`;
        return axiosClient.put(url, data);
    },
    delete: (id) => {
        const url = `/candidate-profiles/${id}`;
        return axiosClient.delete(url);
    }
};

export default candidateProfileApi;
