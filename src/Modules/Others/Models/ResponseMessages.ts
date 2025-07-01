export class ResponseMessages {
    private HasErrors: boolean;
    private ErrorMessages: string[];
    private HasWarnings: boolean;
    private WarningMessages: string[];
    private HasSuccess: boolean;
    private SuccessMessages: string[];

    constructor() {
        this.HasErrors = false;
        this.ErrorMessages = [];
        this.HasWarnings = false;
        this.WarningMessages = [];
        this.HasSuccess = false;
        this.SuccessMessages = [];
    }

    setError(message: string): void {
        this.HasErrors = true;
        this.ErrorMessages.push(message);
    }

    setWarning(message: string): void {
        this.HasWarnings = true;
        this.WarningMessages.push(message);
    }

    setSuccess(message: string): void {
        this.HasSuccess = true;
        this.SuccessMessages.push(message);
    }

    getErrors(): string[] {
        return this.ErrorMessages;
    }

    getWarnings(): string[] {
        return this.WarningMessages;
    }

    getSuccess(): string[] {
        return this.SuccessMessages;
    }

    hasErrors(): boolean {
        return this.HasErrors;
    }

    hasWarnings(): boolean {
        return this.HasWarnings;
    }

    hasSuccess(): boolean {
        return this.HasSuccess;
    }

    Clear() {
        this.HasErrors = false;
        this.ErrorMessages = [];
        this.HasWarnings = false;
        this.WarningMessages = [];
        this.HasSuccess = false;
        this.SuccessMessages = [];
    }
}
