import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import helmet from "helmet"
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security: Helmet helps secure Express apps by setting HTTP response headers
  app.use(helmet())
  //Rate limiting  (basic DDOS protection)

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,// limit each IP to 100 requests per windowMs
    message: {
      statusCode: 429,
      message: "Too many requests, please try again later"
    },
    standardHeaders: true,
    legacyHeaders: false
  })

  // Enable CORS
  app.enableCors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  // API prefix
  app.setGlobalPrefix("api")

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const port = process.env.PORT || 4000
  await app.listen(port)

  console.log(`🚀 Server running on http://localhost:${port}`)
}
bootstrap()
