import axiosClient from "./axiosClient";

const productDetailApi = {
  // GET /api/productdetail
  getAll: () => axiosClient.get('/productdetail'),

  // GET /api/productdetail/{id}
  getById: (id) => axiosClient.get(`/productdetail/${id}`),

  // POST /api/productdetail
  create: (data) => axiosClient.post('/productdetail', data),

  // PUT /api/productdetail/{id}
  update: (id, data) => axiosClient.put(`/productdetail/${id}`, data),

  // DELETE /api/productdetail/{id}
  delete: (id) => axiosClient.delete(`/productdetail/${id}`),
};

export default productDetailApi;