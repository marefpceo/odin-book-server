const helmetConfig = {
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: [
        /http:\/\/localhost:3000/,
        /http:\/\/localhost:5173/,
        /http:\/\/localhost:4173/,
        /.*\.railway.app.*/,
        /.*messaging-app-frontend-7ib.pages\.dev.*/,
      ],
    },
  },
};

export default helmetConfig;
