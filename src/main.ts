import { NestFactory } from "@nestjs/core";
import { FileModule } from "./file.module";

async function bootstrap() {
  const app = await NestFactory.create(FileModule);
  const port = Number.parseInt(process.env.PORT?.toString() ?? "");
  if (Number.isNaN(port) || port < 0 || port > 65535)
    throw new Error("No valid port is provided");
  await app.listen(port).then(() => console.log(`Listening on port ${port}`));
}

bootstrap()
  .catch((err) => console.error(err));
