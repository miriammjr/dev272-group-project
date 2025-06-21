// utils/GenerateStoreLink.ts
export function generateStoreLinks(productName: string) {
  const query = encodeURIComponent(productName.trim());
  return [
    {
      name: 'Amazon',
      url: `https://www.amazon.com/s?k=${query}`,
      price: 0,
    },
    {
      name: 'Walmart',
      url: `https://www.walmart.com/search?q=${query}`,
      price: 0,
    },
  ];
}
