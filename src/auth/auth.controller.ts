import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { AuthService } from "./auth.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { AuthGuard } from "src/guards/auth.guard";
import { FileService } from "src/file/file.service";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ) {}
    
    @Post('login')
    public async login(@Body() {email, password}: AuthLoginDTO) {
        return this.authService.login(email, password)
    }

    @Post('register')
    public async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }

    @Post('forget')
    public async forget(@Body() {email}: AuthForgetDTO) {
        return this.authService.forget(email);
    }

    @Post('reset')
    public async reset(@Body() {password, token}: AuthResetDTO) {
        return this.authService.reset(password, token);
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('photo')
    public async uploadPhoto(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType: /image\/\w+/}),
                new MaxFileSizeValidator({maxSize: 1024 * 500})
            ]
        })
    ) file: Express.Multer.File) {
        const path = join(__dirname, '..', '..', '..', 'storage', 'photos', `file-name.png`);

        try {
            await this.fileService.upload(file, path);
        } catch (e) {
            throw e;
        }

        return {file};
    }
}