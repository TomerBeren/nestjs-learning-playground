import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseInterceptors, 
  ClassSerializerInterceptor,
  SerializeOptions 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}