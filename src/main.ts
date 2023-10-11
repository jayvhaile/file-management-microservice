import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number.parseInt(process.env.PORT?.toString() ?? "");
  if (Number.isNaN(port) || port < 0 || port > 65535)
    throw new Error("No valid port provided");
  await app.listen(port);
}

bootstrap()
  .then(() => console.log("Server started"))
  .catch((err) => console.error(err));
