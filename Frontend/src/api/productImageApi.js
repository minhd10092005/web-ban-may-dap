import axiosClient from "./axiosClient";

const productImageApi = {
  // GET: /productimage?pageNumber=1&pageSize=10&searchTerm=&productId=&sortBy=id&sortDir=desc
  getAll: (params) => {
    return axiosClient.get("/productimage", { params });
  },

  getById: (id) => {
    return axiosClient.get(`/productimage/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/productimage", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/productimage/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/productimage/${id}`);
  },
};

export default productImageApi;
