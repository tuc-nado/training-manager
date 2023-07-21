import { Controller, UseGuards, Post, Body, Get, Request } from '@nestjs/common';

import { LocalAuthGuard } from './strategy/local/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategy/jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }
}
