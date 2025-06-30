import axios from "axios";

export async function fetchProducts(brandConfig) {
  try {
    // Create brand-specific API instance
    const api = axios.create({
      baseURL: `${brandConfig.url}/wp-json/wc/v3/`,
      timeout: 10000,
    });

    // Add auth parameters to all requests
    api.interceptors.request.use((config) => {
      config.params = config.params || {};
      config.params.consumer_key = brandConfig.key;
      config.params.consumer_secret = brandConfig.secret;
      return config;
    });

    let params = {
      per_page: 100,
      status: "publish",
    };
    // Fetch products with variations
    if (brandConfig.categories) {
      // go through object , and get all values of params
      params.category = Object.values(brandConfig.categories).join(",");
    }
    console.log("params", params);
    const response = await api.get("products", { params });

    const productList = [];

    for (const product of response.data) {
      if (product.type === "variable" && brandConfig.showVariations) {
        // Fetch variations for variable products
        const variationsResponse = await api.get(
          `products/${product.id}/variations`
        );

        for (const variation of variationsResponse.data) {
          productList.push({
            id: product.id + "-" + variation.id,
            name: product.name,
            image: variation.image?.src || product.images[0]?.src || "",
            categories: product.categories.map((cat) => cat.id),
            url: product.permalink,
            isFlipped: false,
            isMatched: false,
          });
        }
      } else {
        // Simple product
        productList.push({
          id: product.id,
          name: product.name,
          url: product.permalink,
          categories: product.categories.map((cat) => cat.id),
          image: product.images[0]?.src || "",
          isFlipped: false,
          isMatched: false,
        });
      }
    }

    return productList;
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}
