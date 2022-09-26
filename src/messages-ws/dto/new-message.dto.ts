import { IsString, MinLength } from "class-validator";

export class NewMessageDto {
    id: string;

    @IsString()
    @MinLength(1)
    message: string;
}