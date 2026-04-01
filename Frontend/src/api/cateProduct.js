import axiosClient from "./axiosClient";

const categoryApi = {
  getAll: () => {
    const url = '/cate';
    return axiosClient.get(url);
  },

  getById: (id) => {
    const url = `/cate/${id}`;
    return axiosClient.get(url);
  },

  create: (data) => {
    const url = '/cate';
    return axiosClient.post(url, data);
  },

  delete: (id) => {
    const url = `/cate/${id}`;
    return axiosClient.delete(url);
  }
};

export default categoryApi;