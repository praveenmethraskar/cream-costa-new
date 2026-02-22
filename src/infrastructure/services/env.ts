import { configDotenv } from "dotenv"

/**
 * Interface defining the configuration properties required for the application's environment settings.
 * These settings include application environment, ports, database configuration, JWT secrets, and various 
 * external service credentials like email and SMS configuration.
 */
export interface EnvService {
    databaseName: string
    /**
     * The current environment in which the application is running (e.g., "development", "production").
     * This property is typically used to control environment-specific configurations.
     * 
     * @type {string}
     */
    nodeEnv: string

    /**
     * The port on which the application should listen for incoming requests.
     * 
     * @type {number}
     */
    port: number

    /**
     * The URL to connect to the application's database.
     * This URL includes necessary information like the database type, host, and credentials.
     * 
     * @type {string}
     */
    databaseUrl: string

    /**
     * The secret key used to sign and verify JWT (JSON Web Tokens) for authentication.
     * This key should be kept secure and is used for all JWT operations.
     * 
     * @type {string}
     */
    jwtSecret: string

    /**
     * The encryption key used to encrypt the data.
     */
    encryptionKey: string

    /**
     * The expiration time for JWT tokens issued to admin users. 
     * Defines how long the admin JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpAdmin: string

    /**
     * The expiration time for JWT tokens issued to manager users.
     * Defines how long the manager JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpManager: string

    /**
     * The expiration time for JWT tokens issued to super admin users.
     * Defines how long the super admin JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpSuperAdmin: string

    /**
     * The expiration time for JWT tokens issued to regular users.
     * Defines how long the user JWT token remains valid before expiration.
     * 
     * @type {string}
     */
    jwtExpUser: string

    // Email Configuration
    /**
     * The username used to authenticate with the SMTP server for sending emails.
     * 
     * @type {string}
     */
    smtpUser: string

    /**
     * The SMTP key or password used to authenticate with the SMTP server for sending emails.
     * 
     * @type {string}
     */
    smtpKey: string

    /**
     * The Zepto mail key used to authenticate with the zepto mail server for sending emails.
     * 
     * @type {string}
     */
    mailerKey: string

    /**
     * The hostname or IP address of the SMTP server used to send emails.
     * 
     * @type {string}
     */
    smtpHost: string

    /**
     * The port number used to connect to the SMTP server.
     * Commonly used ports for SMTP are 25, 465, or 587.
     * 
     * @type {number}
     */
    smtpPort: number

    /**
     * The email address used as the sender in outgoing messages.
     * Typically shown as the "From" address in recipients' inboxes.
     * 
     * @type {string}
     */
    senderEmail: string

    // Text message (SMS) Configuration
    /**
     * The hostname or IP address of the SMS service provider's API.
     * 
     * @type {string}
     */
    messageHostName: string

    /**
     * The path/URL to the SMS API endpoint for sending messages.
     * 
     * @type {string}
     */
    messagePathUrl: string

    /**
     * The API key used to authenticate requests to the SMS service provider.
     * 
     * @type {string}
     */
    msg91Key: string

    /**
     * The MSG91 template ID used for sending OTP messages during user authentication flows.
     * This includes OTPs sent for customer registration, customer login, vendor registration,
     * and vendor login via terminal.
     * 
     * @type {string}
     */
    msg91OtpTemplateId: string

    /**
     * The status notify url used to face id & no face id terminals.
     */
    sprintsafeStatusNotifyUrl: string

    /**
     * The status notify url used to freshkart terminals.
     */
    freshkartStatusNotifyUrl: string
}

export class AppEnvService implements EnvService {
    constructor() {
        configDotenv()
    }

    public get nodeEnv(): string {
        return this.get<string>('NODE_ENV', true)
    }

    public get port(): number {
        return this.get<number>('PORT', true)
    }

    public get databaseName(): string {
        return this.get<string>('DATABASE_NAME', true)
    }

    public get databaseUrl(): string {
        return this.get<string>('MONGO_URI', true)
    }

    public get jwtSecret(): string {
        return this.get<string>('JWT_SECRET', true)
    }

    public get encryptionKey(): string {
        return this.get<string>('ENCRYPTION_KEY', false)
    }

    public get jwtExpAdmin(): string {
        return this.get<string>('JWT_EXPIRES_ADMIN', false, '1h')
    }

    public get jwtExpManager(): string {
        return this.get<string>('JWT_EXPIRES_MANAGER', false, '1h')
    }

    public get jwtExpSuperAdmin(): string {
        return this.get<string>('JWT_EXPIRES_SUPER_ADMIN', false, '1h')
    }

    public get jwtExpUser(): string {
        return this.get<string>('JWT_EXPIRES_USER', false, '1h')
    }

    public get smtpUser(): string {
        return this.get<string>('SMTP_USER', true)
    }

    public get smtpKey(): string {
        return this.get<string>('SMTP_SERVICE_KEY', true)
    }

    public get mailerKey(): string {
        return this.get<string>('ZEPTO_SERVICE_KEY', true)
    }

    public get smtpHost(): string {
        return this.get<string>('SMTP_HOST', true)
    }

    public get smtpPort(): number {
        return this.get<number>('SMTP_PORT', true)
    }

    public get senderEmail(): string {
        return this.get<string>('SENDER_EMAIL', true)
    }

    public get messageHostName(): string {
        return this.get<string>('MSG_HOST_NAME', true)
    }

    public get messagePathUrl(): string {
        return this.get<string>('MSG_PATH_URL', true)
    }

    public get msg91Key(): string {
        return this.get<string>('MSG91_AUTH_KEY', true)
    }

     public get msg91OtpTemplateId(): string {
        return this.get<string>('MSG91_OTP_TEMPLATE_ID', true)
    }

    public get sprintsafeStatusNotifyUrl(): string {
        return this.get<string>('STATUS_NOTIFY_URL_SPRINTSAFE', false)
    }

    public get freshkartStatusNotifyUrl(): string {
        return this.get<string>('STATUS_NOTIFY_URL_FRESHKART', false)
    }

    /**
     * Get the value of the environment variable.
     * Throws an error if the variable is required but not set.
     * 
     * @template T The expected type of the environment variable
     * @param {boolean} [required=false] Whether the variable is required
     * @param {T} [defaultValue] The default value to return if not found
     * @returns {T} The value of the environment variable
     */
    get<T>(name: string, required: boolean = false, defaultValue?: T): T {
        const value = process.env[name]

        if (value === undefined) {
            if (required) {
                throw new Error(`Environment variable '${name}' is required but not set.`)
            }
            if (defaultValue !== undefined) {
                return defaultValue
            }
            return undefined as any
        }

        return value as unknown as T
    }
}