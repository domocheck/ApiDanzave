export interface Type_company {
    name: string;
    id: number;
    icon: string;
}

export interface Company {
    value: string;
}

export class CompanyNameSingleton {
    private static instance: CompanyNameSingleton;
    private companyName: string = "";

    private constructor() { }

    static getInstance(): CompanyNameSingleton {
        if (!CompanyNameSingleton.instance) {
            CompanyNameSingleton.instance = new CompanyNameSingleton();
        }
        return CompanyNameSingleton.instance;
    }

    setCompanyName(name: string) {
        this.companyName = name;
    }

    getCompanyName(): string {
        return this.companyName;
    }
}
