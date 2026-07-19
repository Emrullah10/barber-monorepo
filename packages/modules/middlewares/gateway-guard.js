export const makeGatewayGuard = ({ gatewaySecret }) => (req, res, next) => {
  const isFromGateway = req.headers['x-gateway-secret'] === gatewaySecret;

  if (!isFromGateway) {
    return res.status(403).json({
      success: false,
      message: 'Yetkisiz Erişim! Bu sunucuya doğrudan bağlanılamaz. Lütfen API Gateway üzerinden geçin.',
    });
  }
  next();
};
