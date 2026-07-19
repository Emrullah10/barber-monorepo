export class CustomError extends Error {
  constructor(message, statusCode = 400) {
    super(message); // Mesajı JavaScript'in ana Error sınıfına gönder
    this.name = this.constructor.name; // Hatanın adını CustomError yap
    this.statusCode = statusCode; // Örn: 404 (Not Found), 400 (Bad Request), 401 (Unauthorized)
    Error.captureStackTrace(this, this.constructor); // Hatayı takip etmeyi kolaylaştırır
  }
}
