import axios from "axios";

export async function fetchProducts(brandConfig) {
  try {
    const api = axios.create({
      baseURL: `${brandConfig.url}/wp-json/wc/v3/`,
      timeout: 10000,
    });

    api.interceptors.request.use((config) => {
      config.params = config.params || {};
      config.params.consumer_key = brandConfig.key;
      config.params.consumer_secret = brandConfig.secret;
      return config;
    });

    const params = {
      per_page: 100,
      status: "publish",
    };

    if (brandConfig.categories) {
      params.category = Object.values(brandConfig.categories).join(",");
    }

    const productList = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await api.get("products", {
        params: { ...params, page },
      });

      const products = response.data;
      hasMore = products.length === 100;
      page++;

      for (const product of products) {
        if (product.type === "variable" && brandConfig.showVariations) {
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
    }

    return productList;
  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
}
