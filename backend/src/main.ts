import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import helmet from "helmet"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Security: Helmet helps secure Express apps by setting HTTP response headers
  app.use(helmet())

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
