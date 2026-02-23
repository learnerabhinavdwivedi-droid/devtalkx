const request = require("supertest");
const app = require("../../testApp");

// Mock the User model to avoid real DB calls
jest.mock("../models/user");
const User = require("../models/user");

// ─── POST /signup ──────────────────────────────────────────────────────────────

describe("POST /signup", () => {
    beforeEach(() => jest.clearAllMocks());

    // Test 1: Valid signup
    test("returns 200 with success message for valid data", async () => {
        User.mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(true),
        }));

        const res = await request(app).post("/signup").send({
            firstName: "John",
            lastName: "Doe",
            emailId: "john@example.com",
            password: "Str0ng@Pass!",
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    // Test 2: Missing firstName → validation throws
    test("returns 500 when firstName is missing", async () => {
        const res = await request(app).post("/signup").send({
            firstName: "",
            lastName: "Doe",
            emailId: "john@example.com",
            password: "Str0ng@Pass!",
        });

        // The global error handler returns 500 by default for unclassified errors
        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/Name is not valid/);
    });

    // Test 3: Invalid email
    test("returns 500 when email is invalid", async () => {
        const res = await request(app).post("/signup").send({
            firstName: "John",
            lastName: "Doe",
            emailId: "bad-email",
            password: "Str0ng@Pass!",
        });

        expect(res.status).toBe(500);
        expect(res.body.message).toMatch(/Email is not valid/);
    });
});

// ─── POST /login ───────────────────────────────────────────────────────────────

describe("POST /login", () => {
    beforeEach(() => jest.clearAllMocks());

    // Test 4: Valid credentials
    test("returns 200 and sets cookie for valid credentials", async () => {
        const mockUser = {
            _id: "mockId123",
            emailId: "john@example.com",
            validatePassword: jest.fn().mockResolvedValue(true),
            getJWT: jest.fn().mockResolvedValue("mock.jwt.token"),
        };
        User.findOne = jest.fn().mockResolvedValue(mockUser);

        const res = await request(app).post("/login").send({
            emailId: "john@example.com",
            password: "Str0ng@Pass!",
        });

        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"]).toBeDefined();
    });

    // Test 5: User not found
    test("returns 400 for unknown email", async () => {
        User.findOne = jest.fn().mockResolvedValue(null);

        const res = await request(app).post("/login").send({
            emailId: "ghost@example.com",
            password: "Whatever1@",
        });

        expect(res.status).toBe(400);
        expect(res.text).toMatch(/Invalid credentials/);
    });

    // Test 6: Wrong password
    test("returns 400 for wrong password", async () => {
        const mockUser = {
            validatePassword: jest.fn().mockResolvedValue(false),
        };
        User.findOne = jest.fn().mockResolvedValue(mockUser);

        const res = await request(app).post("/login").send({
            emailId: "john@example.com",
            password: "WrongPass1@",
        });

        expect(res.status).toBe(400);
        expect(res.text).toMatch(/Invalid credentials/);
    });
});

// ─── POST /logout ──────────────────────────────────────────────────────────────

describe("POST /logout", () => {
    // Test 7: Logout clears cookie
    test("returns 200 and expires the cookie", async () => {
        const res = await request(app).post("/logout");

        expect(res.status).toBe(200);
        expect(res.text).toMatch(/Logout Successful/);
        // Verify cookie is expired
        const cookie = res.headers["set-cookie"]?.[0] || "";
        expect(cookie).toContain("token=");
    });
});
