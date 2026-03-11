import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PrescriptionsService } from './prescriptions.service';
import { Response } from 'express';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PrescriptionsController {
  constructor(private prescriptionsService: PrescriptionsService) {}

  @Post('prescriptions')
  @Roles('doctor')
  create(@Req() req: any, @Body() body: any) {
    return this.prescriptionsService.create(req.user.sub, body.patientId, body.notes, body.items);
  }

  @Get('prescriptions')
  @Roles('doctor')
  findAll(@Req() req: any, @Query() query: any) {
    return this.prescriptionsService.findAll({
      userId: req.user.sub,
      role: req.user.role,
      status: query.status,
      from: query.from,
      to: query.to,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      order: query.order,
    });
  }

  @Get('prescriptions/:id')
  @Roles('doctor', 'patient', 'admin')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.prescriptionsService.findOne(id, req.user.sub, req.user.role);
  }

  @Get('me/prescriptions')
  @Roles('patient')
  myPrescriptions(@Req() req: any, @Query() query: any) {
    return this.prescriptionsService.findAll({
      userId: req.user.sub,
      role: 'patient',
      status: query.status,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    });
  }

  @Put('prescriptions/:id/consume')
  @Roles('patient')
  consume(@Param('id') id: string, @Req() req: any) {
    return this.prescriptionsService.consume(id, req.user.sub);
  }

  @Get('prescriptions/:id/pdf')
  @Roles('patient', 'doctor', 'admin')
  getPdf(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
    return this.prescriptionsService.generatePdf(id, req.user.sub, req.user.role, res);
  }

  @Get('admin/prescriptions')
  @Roles('admin')
  adminList(@Req() req: any, @Query() query: any) {
    return this.prescriptionsService.findAll({
      userId: req.user.sub,
      role: 'admin',
      status: query.status,
      doctorId: query.doctorId,
      patientId: query.patientId,
      from: query.from,
      to: query.to,
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    });
  }
}