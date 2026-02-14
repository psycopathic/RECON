import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProduct: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  //false ==> loading band aur true ==> loading nhi band
  fetchAllProducts: async () =>{
    console.log("inside fetch all products");
    set({loading:true});
    try {
        const response = await axios.get("/products");
        console.log("fetched products", response.data);
        set({products:response.data, loading:false});
    } catch (error) {
        set({error:"Failed to fetch products", loading:false});
        toast.error(error.response.data.error || "Failed to fetch products");
    }
  },

  fetchProductsByCategory:async(category) =>{
    set({loading:true});
    try {
      const response = await axios.get(`products/category/${category}`);
      set ({products:response.data.products, loading:false});
    } catch (error) {
      set({error:"failed to fetch products by category",loading:false});
      toast.error(error.response.data.error || "Failed to fetch products by category");
    }
  },
  deleteProduct: async (productId) => {
    set({loading:true});
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts)=>({
        products:prevProducts.products.filter((product)=>product._id !== productId),
        loading:false
      }))
    } catch (error) {
      set({loading:false});
      toast.error(error.response.data.error || "Failed to delete product");
      
    }
  },
  toggleFeaturedProduct: async (productId) => {
      set({loading:true});
      try {
        const response = await axios.patch(`/products/${productId}`);
        //this will update the isFeature prop of the product
       set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
      } catch (error) {
        set({loading:false});
        toast.error(error.response.data.error || "Failed to toggle featured product");
      }
  },
  fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));
