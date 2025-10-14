import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Body,
  UseFilters,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { HttpExceptionFilter } from "../../core/exceptions/http-exception.filter";
import { CatsService } from "./cats.service";
import { RolesGuard } from "../../core/common/guards/roles.guard";
import { Roles } from "../../core/common/decorators/roles.decorator";
import { User } from "../../core/common/decorators/user.decorator";
import { LoggingInterceptor } from "../../core/common/interceptors/logging.interceptor";
import { CacheInterceptor } from "../../core/common/interceptors/cache.interceptor";
import { TimeoutInterceptor } from "../../core/common/interceptors/timeout.interceptor";

@Controller("cats")
@UseGuards(RolesGuard)
@UseInterceptors(
  LoggingInterceptor,
  CacheInterceptor,
  TimeoutInterceptor
)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  @Roles(["admin"])
  async create(@Body() createCatDto: CreateCatDto) {
    return await this.catsService.create(createCatDto);
  }

  @Get()
  @Roles(["user", "admin"])
  async findAll() {
    return await this.catsService.findAll();
  }

  @Get("stats")
  @Roles(["admin"])
  async getStats() {
    const count = await this.catsService.getCount();
    return {
      totalCats: count,
      timestamp: new Date().toISOString(),
    };
  }

  @Get("test/timeout")
  async timeoutTest() {
    console.log("Timeout test started - will take 7 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 7000));
    return { message: "This should timeout!" };
  }

  @Get(":id")
  @Roles(["user", "admin"])
  async findOne(
    @Param("id", ParseIntPipe) id: number,
    @User("name") userName: string
  ) {
    console.log(`User ${userName} is requesting cat with ID: ${id}`);
    const cat = await this.catsService.findOne(id);
    if (!cat) {
      throw new Error(`Cat with ID ${id} not found`);
    }
    return cat;
  }
}
