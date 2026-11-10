const crypto = require("crypto");
const clientModel = require("../models/client.model");
const { generateVevoPdfBuffer } = require("../services/pdf.service");
const { sendVisaPdfEmail } = require("../services/email.service");

/**
 * Generates an automated unique Transaction Reference Number (TRN).
 * Follows Australian Department of Home Affairs format: EGOR + 6 alphanumeric characters.
 * Guarantees uniqueness by querying existing records in MongoDB.
 */
async function generateUniqueReferenceNumber() {
    const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let isUnique = false;
    let candidateRef = "";
    let attempts = 0;

    while (!isUnique && attempts < 10) {
        attempts++;
        let randomPart = "";
        const bytes = crypto.randomBytes(6);
        for (let i = 0; i < 6; i++) {
            randomPart += chars[bytes[i] % chars.length];
        }
        candidateRef = `EGOR${randomPart}`;

        const existing = await clientModel.findOne({ ReferenceNumber: candidateRef });
        if (!existing) {
            isUnique = true;
        }
    }

    if (!isUnique) {
        candidateRef = `EGOR${Date.now().toString().slice(-6)}`;
    }

    return candidateRef;
}

exports.createClient = async (req, res) => {
    const { 
        Category, 
        FullName, 
        FamilyName,
        GivenNames,
        Email, 
        Password, 
        Gender, 
        Address, 
        telephone, 
        DOB, 
        POB, 
        CountryofCitizenship, 
        PassportNumber,
        ReferenceNumber,
        Status,
        Paragraph,
        Documents
    } = req.body;

    try {
        const famName = FamilyName !== undefined ? FamilyName : (req.body.surname || "");
        const givNames = GivenNames !== undefined ? GivenNames : (req.body.givenName || "");
        const resolvedFullName = FullName || (famName ? `${givNames} ${famName}`.trim() : givNames.trim());

        if(!Category || !resolvedFullName || !Email || !Gender || !Address || !telephone || !DOB || !POB || !CountryofCitizenship || !PassportNumber) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Generate automated unique reference number (TRN) if not provided
        let uniqueRef = ReferenceNumber || req.body.referenceNumber;
        if (!uniqueRef || !uniqueRef.trim()) {
            uniqueRef = await generateUniqueReferenceNumber();
        } else {
            uniqueRef = uniqueRef.trim().toUpperCase();
        }

        const newClient = new clientModel({
            Category,
            FullName: resolvedFullName,
            FamilyName: famName,
            GivenNames: givNames,
            Email,
            Password: Password || "",
            Gender,
            Address,
            telephone,
            DOB,
            POB,
            CountryofCitizenship,
            PassportNumber,
            ReferenceNumber: uniqueRef,
            Status: Status || "Pending",
            Paragraph: Paragraph || "Currently the status is pending, the application is under review.",
            Documents: Array.isArray(Documents) ? Documents : []
        });
        await newClient.save();

        // Generate official PDF and send email notification to the given email
        try {
            const pdfBuffer = await generateVevoPdfBuffer(newClient);
            const emailResult = await sendVisaPdfEmail(newClient, pdfBuffer, 'created');
            console.log("[Email Notification Result]:", emailResult);
        } catch (err) {
            console.error("[Email Notification Warning]: Failed to generate or send PDF email:", err.message);
        }

        res.status(201).json(newClient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAClients = async (req, res) => {
    const { Email, Password, PassportNumber, identNum, ReferenceNumber, referenceNumber } = req.body;
    const passportToSearch = PassportNumber || identNum;
    const refToSearch = ReferenceNumber || referenceNumber;

    try {
        // If Password is sent, treat as User Login authentication
        if (Password !== undefined) {
            if (!Email || !Email.trim() || !Password || !Password.trim()) {
                return res.status(400).json({ message: "Email ID and Password are required." });
            }

            const client = await clientModel.findOne({
                Email: { $regex: new RegExp(`^${Email.trim()}$`, "i") }
            });

            if (!client || client.Password !== Password.trim()) {
                return res.status(400).json({ message: "Invalid Email ID or Password." });
            }

            return res.status(200).json(client);
        }

        // Admin lookup by Email, ReferenceNumber, or PassportNumber
        const query = {};
        if (Email && Email.trim()) {
            query.Email = { $regex: new RegExp(`^${Email.trim()}$`, "i") };
        }

        if (refToSearch && refToSearch.trim()) {
            query.ReferenceNumber = { $regex: new RegExp(`^${refToSearch.trim()}$`, "i") };
        } else if (passportToSearch && passportToSearch.trim()) {
            query.$or = [
                { PassportNumber: { $regex: new RegExp(`^${passportToSearch.trim()}$`, "i") } },
                { ReferenceNumber: { $regex: new RegExp(`^${passportToSearch.trim()}$`, "i") } }
            ];
        }

        if (!query.Email && !query.ReferenceNumber && !query.$or) {
            return res.status(400).json({ message: "Please provide an Email, Reference Number, or Passport / Identification Number to search." });
        }

        const client = await clientModel.findOne(query);
        if (!client) {
            return res.status(404).json({ message: "No client application found matching your details." });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.editClient = async (req, res) => {
    const { id } = req.params;

    try {
        const client = await clientModel.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        // Ensure a unique reference number exists
        if (!client.ReferenceNumber && !req.body.ReferenceNumber) {
            client.ReferenceNumber = await generateUniqueReferenceNumber();
        }

        Object.assign(client, req.body);
        await client.save();

        // Generate updated official PDF and send email notification
        try {
            const pdfBuffer = await generateVevoPdfBuffer(client);
            const emailResult = await sendVisaPdfEmail(client, pdfBuffer, 'updated');
            console.log("[Email Notification Result]:", emailResult);
        } catch (err) {
            console.error("[Email Notification Warning]: Failed to send updated PDF email:", err.message);
        }

        res.status(200).json(client);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.testEmail = async (req, res) => {
    try {
        const mockClient = {
            FullName: "Deployment Test Applicant",
            GivenNames: "Deployment",
            FamilyName: "Test",
            Category: "Student Visa",
            Email: req.body?.Email || req.query?.email || "deployment-test@homeaffairs.gov.au",
            PassportNumber: "DEP99999",
            ReferenceNumber: "EGOR123456",
            Status: "Issued",
            Paragraph: "This is a diagnostic test email verifying live server email configuration.",
            Documents: ["Passport", "Photo", "Aadhar"],
            CountryofCitizenship: "Australia"
        };
        const pdfBuffer = await generateVevoPdfBuffer(mockClient);
        const result = await sendVisaPdfEmail(mockClient, pdfBuffer, 'updated');
        
        return res.status(result.success ? 200 : 500).json({
            message: result.success ? "Test email sent successfully!" : "Failed to send test email.",
            result,
            envSummary: {
                hasSmtpUser: Boolean(process.env.SMTP_USER),
                hasSmtpPass: Boolean(process.env.SMTP_PASS),
                smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
                smtpPort: process.env.SMTP_PORT || '587',
                hasResendApi: Boolean(process.env.RESEND_API),
                recipientConfigured: process.env.RECIEVER_EMAIL || process.env.RECIEVER_EMIAL || process.env.RECEIVER_EMAIL || 'abhinavsho220@gmail.com'
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


