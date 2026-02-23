const { validateSignUpData, validateEditProfileData } = require("./validation");

// ─── validateSignUpData ────────────────────────────────────────────────────────

describe("validateSignUpData", () => {
    // Test 1: Missing firstName
    test("throws when firstName is missing", () => {
        const req = { body: { firstName: "", lastName: "Doe", emailId: "test@example.com", password: "Str0ng@Pass!" } };
        expect(() => validateSignUpData(req)).toThrow("Name is not valid!");
    });

    // Test 2: Invalid email
    test("throws on invalid email", () => {
        const req = { body: { firstName: "John", lastName: "Doe", emailId: "not-an-email", password: "Str0ng@Pass!" } };
        expect(() => validateSignUpData(req)).toThrow("Email is not valid!");
    });

    // Test 3: Weak password
    test("throws on weak password", () => {
        const req = { body: { firstName: "John", lastName: "Doe", emailId: "john@example.com", password: "1234" } };
        expect(() => validateSignUpData(req)).toThrow("Please enter a strong Password!");
    });

    // Test 4: Valid data — no throw
    test("does not throw with valid data", () => {
        const req = { body: { firstName: "John", lastName: "Doe", emailId: "john@example.com", password: "Str0ng@Pass!" } };
        expect(() => validateSignUpData(req)).not.toThrow();
    });
});

// ─── validateEditProfileData ───────────────────────────────────────────────────

describe("validateEditProfileData", () => {
    // Test 5: All allowed fields → true
    test("returns true for all allowed fields", () => {
        const req = { body: { firstName: "John", bio: "Developer", skills: ["JS"] } };
        expect(validateEditProfileData(req)).toBe(true);
    });

    // Test 6: Disallowed field (e.g. 'password') → false
    test("returns false when a disallowed field is present", () => {
        const req = { body: { firstName: "John", password: "hack" } };
        expect(validateEditProfileData(req)).toBe(false);
    });
});
