import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }
  /*
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(id, updateUserDto);
  }
*/
  @Patch(':id/makeAdmin')
  makeAdmin(
    @Param('id') id: string,
    @Body('superAdminId') superAdminId: string,
  ) {
    console.log(superAdminId);
    return this.authService.makeAdmin(superAdminId, id);
  }
  @Patch(':id/makeUser')
  makeUser(
    @Param('id') id: string,
    @Body('superAdminId') superAdminId: string,
  ) {
    return this.authService.makeUser(superAdminId, id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
  @Get('/connected-user')
  @UseGuards(AuthGuard('jwt'))
  getConnectedUser(@Req() req: Request) {
    // @ts-ignore
    return this.authService.findUserById(req.user._id);  // Renvoie les détails de l'utilisateur connecté
  }
}
