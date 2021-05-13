export interface Signup {
    aws_marketplace_token: string;
    first_name: string;
    last_name: string;
    email: string;
    account_name: string;
    contact_phone: string;
    primary_title: string;
    primary_first_name: string;
    primary_last_name: string;
    primary_email: string;
    primary_contact_phone: string;
    primary_contact_mobile: string;
    secondary_title?: string;
    secondary_first_name?: string;
    secondary_last_name?: string;
    secondary_email?: string;
    secondary_contact_phone?: string;
    secondary_contact_mobile?: string;
    tertiary_title?: string;
    tertiary_first_name?: string;
    tertiary_last_name?: string;
    tertiary_email?: string;
    tertiary_contact_phone?: string;
    tertiary_contact_mobile?: string;
}

export interface SignupAWS {
    aws_marketplace_token: string;
    first_name: string;
    last_name: string;
    user_email: string;
    account_name: string;
    phone_number: string;
}
