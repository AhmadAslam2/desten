# React Native Shopify Example

A React Native mobile application example that demonstrates integration with Shopify's Storefront API. This example app showcases:

- Multi-store support
- Product browsing and search
- Shopping cart functionality
- User authentication
- Multi-language support
- Location-based store selection

## Features

- React Native with Expo
- Shopify Storefront API integration
- Apollo Client for GraphQL
- Multi-language support (English, German, French, Polish)
- Location-based store selection
- Secure authentication
- Responsive UI with custom components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your Shopify store credentials in `src/config/stores.ts`
4. Start the development server:
   ```bash
   npm start
   ```

## Configuration

Update the store configuration in `src/config/stores.ts` with your Shopify store details:

```typescript
export const stores = [
  {
    id: 'your-store-id',
    name: 'Your Store Name',
    url: 'your-store.myshopify.com',
    accessToken: 'your-storefront-access-token',
    language: 'en',
    currency: 'USD',
    isActive: true,
    location: {
      country: 'US',
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    },
  },
];
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.