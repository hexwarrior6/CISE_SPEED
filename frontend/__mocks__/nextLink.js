module.exports = jest.fn(({ children, ...props }) => {
  return children;
});