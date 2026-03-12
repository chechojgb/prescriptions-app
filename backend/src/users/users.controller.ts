import { Controller, Get, Param, Query, UseGuards, Post, Body, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @Get('patients/search')
    @Roles('doctor', 'admin')
    searchPatients(
      @Query('query') query?: string,
      @Query('page') page?: string,
      @Query('limit') limit?: string,
    ) {
      return this.usersService.searchPatients(query, Number(page) || 1, Number(limit) || 10);
  }

  @Get()
  @Roles('admin')
  findAll(
    @Query('role') role?: string,
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.findAll(role, query, Number(page) || 1, Number(limit) || 10);
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: { name?: string; email?: string }
  ) {
    return this.usersService.update(id, updateDto);
  }
}