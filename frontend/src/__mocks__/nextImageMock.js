module.exports = {
  default: function MockImage(props) {
    return <img {...props} />;
  },
  getImageProps: jest.fn(() => ({
    src: '',
  })),
};