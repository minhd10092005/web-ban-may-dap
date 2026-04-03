import axiosClient from "./axiosClient";

const productApi = {
  // params: { pageNumber, pageSize, searchTerm, cateId }
  getAll: (params) => {
    const url = '/product';
    return axiosClient.get(url, { params });
  },

  getById: (id) => {
    const url = `/product/${id}`;
    return axiosClient.get(url);
  },

  create: (data) => {
    const url = '/product';
    return axiosClient.post(url, data);
  },

  update: (id, data) => {
    const url = `/product/${id}`;
    return axiosClient.put(url, data);
  },

  delete: (id) => {
    const url = `/product/${id}`;
    return axiosClient.delete(url);
  }
};

export default productApi;