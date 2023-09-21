import { Controller, Get, Render } from "@nestjs/common";

@Controller()
export class AppController {
    private readonly title: string = "Gerador de Hashing";
    private readonly rootForm = {
        file: { name: "file", type: "file" },
        isMalicious: { name: "isMalicious", type: "checkbox" }
    };

    @Get()
    @Render('index')
    root() {
        return {
            title: this.title,
            formAction: "http://localhost:3000/files",
            formMethod: "post",
            rootForm: this.rootForm
        };
    }
}
