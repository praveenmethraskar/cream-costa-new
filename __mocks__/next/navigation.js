// __mocks__/next/navigation.js
module.exports = {
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(),
    pathname: "/",
  }),
};
