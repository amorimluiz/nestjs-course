import { MailerService } from "@nestjs-modules/mailer";
import { Provider } from "@nestjs/common";

export const MailerServiceMock: Provider = {
    provide: MailerService,
    useValue: {
        sendMail: jest.fn()
    }
}
